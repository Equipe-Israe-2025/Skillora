export default {
  path: '/prof',
  name: 'teacher',
  component: () => import('@/components/DynamicSidebar.vue'),
  meta: { 
    requiresRole: ['prof'],
    title: 'Espace Professeur'
  },
  children: [
    {
      path: '',
      name: 'TeacherDashboard',
      component: () => import('@/components/Prof/Profile.vue'),
      meta: { title: 'Tableau de Bord' }
    },
    {
      path: 'ajouter-groupe',
      name: 'AjouterGroupe',
      component: () => import('@/components/Prof/AjouterGroupe.vue'),
      meta: { title: 'Gestion des Groupes' }
    },
    {
      path: 'evaluation',
      name: 'Evaluation',
      component: () => import('@/components/Prof/Evaluation.vue'),
      meta: { title: 'Évaluations' }
    },
    {
      path: 'signalement',
      name: 'Signalement',
      component: () => import('@/components/Prof/Signalement.vue'),
      meta: { title: 'Signalements' }
    },
    {
      path: 'suivi',
      name: 'Suivi',
      component: () => import('@/components/Prof/Suivi.vue'),
      meta: { title: 'Suivi des Étudiants' }
    }
  ]
}