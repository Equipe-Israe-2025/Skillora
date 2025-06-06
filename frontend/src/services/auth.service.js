import api from './api'

export default {
  async login(credentials) {
    return api.post('/utilisateurs/login', credentials)
  },
  
  async logout() {
    return api.post('/utilisateurs/logout')
  },
  
  async validateToken() {
    return api.get('/auth/validate')
  },
  
  async getUserPermissions() {
    return api.get('/auth/permissions')
  }
}