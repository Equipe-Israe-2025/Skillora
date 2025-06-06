import { defineStore } from 'pinia'
import router from '@/router'
import api from '@/services/api'
import { nextTick } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),
  
  getters: {
    userId: (state) => state.user?.Id_U || null,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const { data } = await api.post('/utilisateurs/login', credentials)
        console.log(data.user, 'Hello Hajar l Jamila ')
        this.user = data.user
        this.isAuthenticated = true
        
        localStorage.setItem('auth', JSON.stringify({
          user: data.user,
          token: data.token
        }))

        // Load role-specific routes
        await router.setupRoleRoutes(data.user.role)
        await nextTick()

        // Redirect to role-specific dashboard
        const redirectPath = router.currentRoute.value.query.redirect || `/${data.user.role}/${data.user.Id_U}`
        router.push(redirectPath)
        
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } finally {
        this.clearAuth()
        router.push('/login')
      }
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('auth')
    },

    async checkAuth() {
      const authData = JSON.parse(localStorage.getItem('auth'))
      if (!authData?.token) return false

      try {
        await api.get('/validate')
        this.user = authData.user
        this.isAuthenticated = true
        return true
      } catch {
        this.clearAuth()
        return false
      }
    }
  }
})