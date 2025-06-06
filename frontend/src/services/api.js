import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const api = axios.create({
  baseURL:  'http://localhost:3000/api',
  timeout: 10000
})

// Request interceptor
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = JSON.parse(localStorage.getItem('auth'))?.token
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      await authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default api