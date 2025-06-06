import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from './publicRoutes'
import setupGuards from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})

// Dynamic role-based routing
router.setupRoleRoutes = async (role) => {
  try {
    const roleRoutes = {
      Administrateur: () => import('./adminRoutes.js'),
      Etudiant: () => import('./studentRoutes.js'),
      Encadrant: () => import('./teacherRoutes.js'),
      Tuteur: () => import('./tutorRoutes.js')
    }[role]
    
    if (roleRoutes) {
      const routes = await roleRoutes()
      // Remove existing role routes if they exist
      if (router.hasRoute(role)) {
        router.removeRoute(role)
      }
      router.addRoute(routes.default)
    }
  } catch (error) {
    console.error(`Failed to load ${role} routes:`, error)
  }
}

setupGuards(router)

export default router