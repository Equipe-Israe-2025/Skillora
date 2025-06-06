export const getNavItems = (userId) => [
  // ============ Admin Routes ============
  {
    path: `/Administrateur/${userId}/profile`,
    text: 'Profile',
    icon: 'profile.png',
    roles: ['Administrateur']
  },
  {
    path: `/Administrateur/${userId}/inscription`,
    text: 'Inscription',
    icon: 'inscription.png',
    roles: ['Administrateur']
  },
  {
    path: `/Administrateur/${userId}/competences`,
    text: 'Compétences',
    icon: 'competence.png',
    roles: ['Administrateur']
  },
  {
    path: `/Administrateur/${userId}/notifications`,
    text: 'Notifications',
    icon: 'notification.png',
    roles: ['Administrateur']
  },

  // ============ Student Routes ============
  {
    path: `/Etudiant/${userId}`,
    text: 'Mon Profil',
    icon: 'profile.png',
    roles: ['Etudiant']
  },
  {
    path: `/Etudiant/${userId}/auto-evaluation`,
    text: 'Auto-Évaluation',
    icon: 'evaluation.png',
    roles: ['Etudiant']
  },
  {
    path: `/Etudiant/${userId}/evaluation-pairs`,
    text: 'Évaluation des Pairs',
    icon: 'group-eval.png',
    roles: ['Etudiant']
  },
  {
    path: `/Etudiant/${userId}/evaluer-etudiant/:id`,
    text: 'Évaluer un Étudiant',
    icon: 'grade.png',
    roles: ['Etudiant'],
    showInSidebar: false
  },
  {
    path: `/Etudiant/${userId}/suivi`,
    text: 'Suivi Académique',
    icon: 'progress.png',
    roles: ['Etudiant']
  },

  // ============ Professor Routes ============
  {
    path: `/Encadrant/${userId}`,
    text: 'Mon Profil',
    icon: 'profile.png',
    roles: ['Encadrant']
  },
  {
    path: `/Encadrant/${userId}/ajouter-groupe`,
    text: 'Gestion des Groupes',
    icon: 'groups.png',
    roles: ['Encadrant']
  },
  {
    path: `/Encadrant/${userId}/evaluation`,
    text: 'Évaluations',
    icon: 'grading.png',
    roles: ['Encadrant']
  },
  {
    path: `/Encadrant/${userId}/signalement`,
    text: 'Signalements',
    icon: 'alert.png',
    roles: ['Encadrant']
  },
  {
    path: `/Encadrant/${userId}/suivi`,
    text: 'Suivi des Étudiants',
    icon: 'monitoring.png',
    roles: ['Encadrant']
  },

  // ============ Shared Routes ============
  {
    path: '/settings',
    text: 'Paramètres',
    icon: 'settings.png',
    roles: ['Etudiant', 'Encadrant']
  }
]