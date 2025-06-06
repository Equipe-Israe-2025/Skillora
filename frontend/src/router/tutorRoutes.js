export default {
  path: '/Tuteur/:id',
  name: 'tutor',
  component: () => import('@/components/DynamicSidebar.vue'),
  meta: { 
    requiresRole: ['Tuteur'],
    title: 'Espace Tuteur'
  },
  children: [
    {
      path: '',
      name: 'TutorDashboard',
      component: () => import('@/views/TutorView.vue'),
      meta: { title: 'Tableau de Bord Tuteur' }
    }
  ]
}