export default {
  path: '/Administrateur/:id',
  name: 'admin',
  component: () => import('@/components/DynamicSidebar.vue'),
  meta: { 
    requiresRole: ['Administrateur'],
    title: 'Administration'
  },
  children: [
    {
      path: '',
      name: 'AdminProfile',
      component: () => import('@/components/Admin/ProfileView.vue'),
      meta: { title: 'Profil Admin' }
    },
    {
      path: 'inscription',
      name: 'AdminInscription',
      component: () => import('@/components/Admin/InscriptionView.vue'),
      meta: { title: 'Gestion Inscriptions' }
    },
    {
      path: 'competences',
      name: 'AdminCompetences',
      component: () => import('@/components/Admin/CompetenceView.vue'),
      meta: { title: 'Gestion Compétences' }
    },
    {
      path: 'notifications',
      name: 'AdminNotifications',
      component: () => import('@/components/Admin/NotificationView.vue'),
      meta: { title: 'Notifications' }
    },
    {
      path: 'profileEtudiant/:id',
      name: 'AdminProfileEtudiant',
      component: () => import('@/components/Admin/suiviEtudiant.vue'),
      props: true,
      meta: { 
        title: 'Profil Étudiant',
        showInSidebar: false
      }
    }
  ]
}