export default [
  {
    path:'/',
    redirect: '/login'
  }
  ,{
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { 
      public: true,
      title: 'Connexion'
    }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/Unauthorized.vue'),
    meta: {
      public: true,
      title: 'Non Autorisé'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      public: true,
      title: 'Page Introuvable'
    }
  }
]