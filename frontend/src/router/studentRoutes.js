export default {
  path: '/etudiant',
  name: 'student',
  component: () => import('@/components/DynamicSidebar.vue'),
  meta: { 
    requiresRole: ['etudiant'],
    title: 'Espace Étudiant'
  },
  children: [
    {
      path: '',
      name: 'StudentDashboard',
      component: () => import('@/components/Etudiant/StudentProfile.vue'),
      meta: { title: 'Mon Profil' }
    },
    {
      path: 'auto-evaluation',
      name: 'AutoEvaluation',
      component: () => import('@/components/Etudiant/AutoEvaluation.vue'),
      meta: { title: 'Auto-Évaluation' }
    },
    {
      path: 'evaluation-pairs',
      name: 'EvaluationPairs',
      component: () => import('@/components/Etudiant/EvaluationPairs.vue'),
      meta: { title: 'Évaluation des Pairs' }
    },
    {
      path: 'evaluer-etudiant/:id',
      name: 'EvaluerEtudiant',
      component: () => import('@/components/Etudiant/EvaluerEtudiant.vue'),
      props: true,
      meta: { 
        title: 'Évaluer un Étudiant',
        showInSidebar: false
      }
    },
    {
      path: 'suivi',
      name: 'SuiviEtudiant',
      component: () => import('@/components/Etudiant/SuiviEtudiant.vue'),
      meta: { title: 'Suivi Académique' }
    }
  ]
}