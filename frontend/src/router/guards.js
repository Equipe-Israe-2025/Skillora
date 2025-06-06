export default function (router) {
  router.beforeEach(async (to) => {
    const { useAuthStore } = await import('@/stores/auth.store')  // ✅ bien importer useAuthStore
    const authStore = useAuthStore() // ✅ instancier le store

    document.title = to.meta.title || 'School Management System'

    if (to.meta.public) return true

    const isAuthenticated = await authStore.checkAuth()  // ✅ ici checkAuth existera
    console.log(isAuthenticated , 'hello')

    if (!isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }

      // Dynamically load role-based routes only if not already loaded
    const role = authStore.user?.role
    if (role && !router.hasRoute(role)) {
      await router.setupRoleRoutes(role)
    }
    
    if (to.meta.requiresRole && !to.meta.requiresRole.includes(authStore.user.role)) {
      return { name: 'unauthorized' }
    }

    return true
  })
}
