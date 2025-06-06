<template>
  <div class="registration-container">
    <h1 class="page-title">Gestion des Utilisateurs</h1>
    
    <!-- Tableau des utilisateurs existants -->
    <div class="users-card">
      <div class="card-header">
        <h2 class="card-title">Utilisateurs existants</h2>
        <div class="header-actions">
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              class="search-input" 
              placeholder="Rechercher un utilisateur..."
            />
            <span class="search-icon">🔍</span>
          </div>
          <button class="btn-primary" @click="showAddUserForm">
            <span class="btn-icon">+</span> Nouvel utilisateur
          </button>
        </div>
      </div>
      
      <!-- Onglets pour les types d'utilisateurs -->
      <div class="tabs-container">
        <div 
          v-for="tab in tabs" 
          :key="tab.value" 
          class="tab" 
          :class="{ 'active': activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ getFilteredUsersByType(tab.value).length }}</span>
        </div>
      </div>
      
      <div class="users-table-container">

        <table class="users-table" v-if="activeTab === 'student'">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              
              
              
              <th>Numéro</th>
              <th>Niveau</th>
              
              
              
              <!-- <th>Statut</th> -->
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="user in filteredUsers" :key="user.id">
              <router-link :to="`/admin/profileEtudiant/${user.id}`">
              <td>{{ user.lastName }} {{ user.firstName }}</td>
            </router-link>
              <td>{{ user.email }}</td>
              
              
              
              <!-- Données spécifiques pour les étudiants -->
              <td >{{ user.studentId }}</td>
              <td >{{ user.level }}</td>
              
              
              
              <!-- <td>
                <span class="status-badge" :class="{ active: user.isActive }">
                  {{ user.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td> -->
              <td class="actions-cell">
                <button class="action-btn edit" @click="editUser(user)">
                  ✏️ <span class="action-text">Modifier</span>
                </button>
                <button class="action-btn delete" @click="confirmDeleteUser(user)">
                  🗑️ <span class="action-text">Supprimer</span>
                </button>
              </td>
            
            </tr>
          
          
            <tr v-if="filteredUsers.length === 0">
              <td :colspan="getColspan()">
                <div class="no-results">
                  <div class="no-results-icon">🔍</div>
                  <div class="no-results-text">
                    Aucun {{ getUserTypeLabel(activeTab).toLowerCase() }} trouvé
                    <span v-if="searchQuery">pour la recherche "{{ searchQuery }}"</span>
                  </div>
                </div>
              </td>
              
            </tr>
          </tbody>
        </table>


        <!--=================================================-->


        <table class="users-table" v-else>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <!-- Colonnes spécifiques pour les professeurs -->
              <th v-if="activeTab === 'professor'">Département</th>
              <th v-if="activeTab === 'professor'">Spécialité</th>
              
              <!-- Colonnes spécifiques pour les étudiants -->
              <!-- <th v-if="activeTab === 'student'">Numéro</th>
              <th v-if="activeTab === 'student'">Niveau</th> -->
              
              <!-- Colonnes spécifiques pour les tuteurs -->
              <th v-if="activeTab === 'tutor'">Entreprise</th>
              <th v-if="activeTab === 'tutor'">Poste</th>
              
              <!-- <th>Statut</th> -->
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.lastName }} {{ user.firstName }}</td>
              <td>{{ user.email }}</td>
              
              <!-- Données spécifiques pour les professeurs -->
              <td v-if="activeTab === 'professor'">{{ getDepartmentLabel(user.department) }}</td>
              <td v-if="activeTab === 'professor'">{{ user.specialty }}</td>
              
              <!-- Données spécifiques pour les étudiants -->
              <!-- <td v-if="activeTab === 'student'">{{ user.studentId }}</td>
              <td v-if="activeTab === 'student'">{{ user.level }}</td> -->
              
              <!-- Données spécifiques pour les tuteurs -->
              <td v-if="activeTab === 'tutor'">{{ user.company }}</td>
              <td v-if="activeTab === 'tutor'">{{ user.position }}</td>
              
              <!-- <td>
                <span class="status-badge" :class="{ active: user.isActive }">
                  {{ user.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td> -->
              <td class="actions-cell">
                <button class="action-btn edit" @click="editUser(user)">
                  ✏️ <span class="action-text">Modifier</span>
                </button>
                <button class="action-btn delete" @click="confirmDeleteUser(user)">
                  🗑️ <span class="action-text">Supprimer</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td :colspan="getColspan()">
                <div class="no-results">
                  <div class="no-results-icon">🔍</div>
                  <div class="no-results-text">
                    Aucun {{ getUserTypeLabel(activeTab).toLowerCase() }} trouvé
                    <span v-if="searchQuery">pour la recherche "{{ searchQuery }}"</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Formulaire d'ajout/modification d'utilisateur -->
    <div v-if="showForm" class="registration-card">
      <div class="card-header">
        <h2 class="card-title">{{ isEditing ? 'Modifier un utilisateur' : 'Ajouter un nouvel utilisateur' }}</h2>
        <p class="card-subtitle">Veuillez remplir tous les champs obligatoires (*)</p>
      </div>
      
      <div class="form-container">
        <!-- Type d'utilisateur -->
        <div class="form-group">
          <label class="form-label">Type d'utilisateur *</label>
          <div class="user-type-selector">
            <div 
              v-for="type in userTypes" 
              :key="type.value" 
              class="user-type-option" 
              :class="{ 'selected': formData.userType === type.value }"
              @click="selectUserType(type.value)"
            >
              <div class="user-type-icon">{{ type.icon }}</div>
              <div class="user-type-label">{{ type.label }}</div>
            </div>
          </div>
        </div>
        
        <!-- Informations personnelles -->
        <div class="form-section">
          <h3 class="section-title">Informations personnelles</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nom *</label>
              <input 
                type="text" 
                v-model="formData.lastName" 
                class="form-input"
                :class="{ 'input-error': errors.lastName }"
                placeholder="Nom de famille"
              />
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Prénom *</label>
              <input 
                type="text" 
                v-model="formData.firstName" 
                class="form-input"
                :class="{ 'input-error': errors.firstName }"
                placeholder="Prénom"
              />
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input 
                type="email" 
                v-model="formData.email" 
                class="form-input"
                :class="{ 'input-error': errors.email }"
                placeholder="adresse@exemple.com"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            
            <!-- <div class="form-group">
              <label class="form-label">Téléphone</label>
              <input 
                type="tel" 
                v-model="formData.phone" 
                class="form-input"
                placeholder="Ex: 06 12 34 56 78"
              />
            </div> -->
          </div>
          
          <div class="form-row">
            <!-- <div class="form-group">
              <label class="form-label">Date de naissance</label>
              <input 
                type="date" 
                v-model="formData.birthDate" 
                class="form-input"
              />
            </div> -->
            
            <div class="form-group">
              <label class="form-label">Genre</label>
              <select v-model="formData.gender" class="form-select">
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Informations spécifiques au type d'utilisateur -->
        <div v-if="formData.userType" class="form-section">
          <h3 class="section-title">
            Informations {{ 
              formData.userType === 'professor' ? 'du Professeur' : 
              formData.userType === 'student' ? 'de l\'Étudiant' : 
              'du Tuteur' 
            }}
          </h3>
          
          <!-- Champs spécifiques pour les professeurs -->
          <div v-if="formData.userType === 'professor'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Département *</label>
                <select 
                  v-model="formData.department" 
                  class="form-select"
                  :class="{ 'input-error': errors.department }"
                >
                  <!-- <option value="">Sélectionner un département</option> -->
                  <option value="informatique">Informatique</option>
                  <option value="mathematiques">Mathématiques</option>
                  <option value="industriel">Idustriel</option>
                  <option value="automobile">Automobile</option>
                  <option value="energie">Energie</option>
                  <option value="systeme">Système Embarqué</option>
                  <!-- <option value="economie">Économie et Gestion</option> -->
                </select>
                <span v-if="errors.department" class="error-message">{{ errors.department }}</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">Spécialité *</label>
                <input 
                  type="text" 
                  v-model="formData.specialty" 
                  class="form-input"
                  :class="{ 'input-error': errors.specialty }"
                  placeholder="Ex: Intelligence Artificielle"
                />
                <span v-if="errors.specialty" class="error-message">{{ errors.specialty }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Numéro d'employé *</label>
              <input 
                type="text" 
                v-model="formData.employeeId" 
                class="form-input"
                :class="{ 'input-error': errors.employeeId }"
                placeholder="Ex: PROF-12345"
              />
              <span v-if="errors.employeeId" class="error-message">{{ errors.employeeId }}</span>
            </div>
          </div>
          
          <!-- Champs spécifiques pour les étudiants -->
          <div v-if="formData.userType === 'student'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Numéro d'étudiant *</label>
                <input 
                  type="text" 
                  v-model="formData.studentId" 
                  class="form-input"
                  :class="{ 'input-error': errors.studentId }"
                  placeholder="Ex: ETU-12345"
                />
                <span v-if="errors.studentId" class="error-message">{{ errors.studentId }}</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">Promotion *</label>
                <input 
                  type="text" 
                  v-model="formData.promotion" 
                  class="form-input"
                  :class="{ 'input-error': errors.promotion }"
                  placeholder="Ex: 2023-2024"
                />
                <span v-if="errors.promotion" class="error-message">{{ errors.promotion }}</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Filière *</label>
                <select 
                  v-model="formData.major" 
                  class="form-select"
                  :class="{ 'input-error': errors.major }"
                >
                  <option value="">Sélectionner une filière</option>
                  <option value="informatique">Informatique</option>
                  <option value="mathematiques">Mathématiques</option>
                  <option value="physique">Physique</option>
                  <option value="chimie">Chimie</option>
                  <option value="biologie">Biologie</option>
                  <option value="langues">Langues</option>
                  <option value="economie">Économie et Gestion</option>
                </select>
                <span v-if="errors.major" class="error-message">{{ errors.major }}</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">Niveau d'études *</label>
                <select 
                  v-model="formData.level" 
                  class="form-select"
                  :class="{ 'input-error': errors.level }"
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="L1">Licence 1</option>
                  <option value="L2">Licence 2</option>
                  <option value="L3">Licence 3</option>
                  <option value="M1">Master 1</option>
                  <option value="M2">Master 2</option>
                  <option value="D">Doctorat</option>
                </select>
                <span v-if="errors.level" class="error-message">{{ errors.level }}</span>
              </div>
            </div>
          </div>
          
          <!-- Champs spécifiques pour les tuteurs -->
          <div v-if="formData.userType === 'tutor'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Entreprise *</label>
                <input 
                  type="text" 
                  v-model="formData.company" 
                  class="form-input"
                  :class="{ 'input-error': errors.company }"
                  placeholder="Nom de l'entreprise"
                />
                <span v-if="errors.company" class="error-message">{{ errors.company }}</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">Poste *</label>
                <input 
                  type="text" 
                  v-model="formData.position" 
                  class="form-input"
                  :class="{ 'input-error': errors.position }"
                  placeholder="Ex: Ingénieur Senior"
                />
                <span v-if="errors.position" class="error-message">{{ errors.position }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Domaine d'expertise *</label>
              <input 
                type="text" 
                v-model="formData.expertise" 
                class="form-input"
                :class="{ 'input-error': errors.expertise }"
                placeholder="Ex: Développement Web"
              />
              <span v-if="errors.expertise" class="error-message">{{ errors.expertise }}</span>
            </div>
          </div>
        </div>
        
        <!-- Informations de compte -->
        <div class="form-section">
          <h3 class="section-title">Informations de compte</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nom d'utilisateur *</label>
              <input 
                type="text" 
                v-model="formData.username" 
                class="form-input"
                :class="{ 'input-error': errors.username }"
                placeholder="Nom d'utilisateur"
              />
              <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Mot de passe {{ isEditing ? '' : '*' }}</label>
              <div class="password-input-container">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="formData.password" 
                  class="form-input"
                  :class="{ 'input-error': errors.password }"
                  :placeholder="isEditing ? 'Laisser vide pour ne pas modifier' : 'Mot de passe'"
                />
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Statut du compte</label>
            <div class="status-toggle">
              <span class="status-label">Inactif</span>
              <label class="switch">
                <input type="checkbox" v-model="formData.isActive">
                <span class="slider"></span>
              </label>
              <span class="status-label">Actif</span>
            </div>
          </div>
        </div>
        
        <!-- Boutons d'action -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="cancelForm">Annuler</button>
          <button type="button" class="btn-primary" @click="submitForm">
            {{ isEditing ? 'Enregistrer les modifications' : 'Inscrire l\'utilisateur' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Message de confirmation -->
    <div v-if="showSuccessMessage" class="success-message">
      <div class="success-icon">✓</div>
      <div class="success-content">
        <h3>{{ successTitle }}</h3>
        <p>{{ successMessage }}</p>
      </div>
      <button class="close-button" @click="showSuccessMessage = false">×</button>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="modal-close" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-content">
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{{ userToDelete.firstName }} {{ userToDelete.lastName }}</strong> ?</p>
          <p class="warning-text">Cette action est irréversible.</p>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showDeleteModal = false">Annuler</button>
          <button class="btn-danger" @click="deleteUser">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRegistrationView',
  
  data() {
    return {
      // Onglets pour les types d'utilisateurs
      tabs: [
        { value: 'all', label: 'Tous', icon: '👥' },
        { value: 'professor', label: 'Professeurs', icon: '👨‍🏫' },
        { value: 'student', label: 'Étudiants', icon: '👨‍🎓' },
        { value: 'tutor', label: 'Tuteurs', icon: '👨‍💼' }
      ],
      activeTab: 'all',
      
      // Données pour la liste des utilisateurs
      users: [
        {
          id: 1,
          userType: 'professor',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@universite.fr',
          // phone: '06 12 34 56 78',
          // birthDate: '1975-05-15',
          gender: 'M',
          department: 'informatique',
          specialty: 'Intelligence Artificielle',
          employeeId: 'PROF-1001',
          username: 'jdupont',
          isActive: true
        },
        {
          id: 2,
          userType: 'professor',
          firstName: 'Sophie',
          lastName: 'Moreau',
          email: 'sophie.moreau@universite.fr',
          // phone: '06 23 45 67 89',
          // birthDate: '1980-03-12',
          gender: 'F',
          department: 'mathematiques',
          specialty: 'Algèbre',
          employeeId: 'PROF-1002',
          username: 'smoreau',
          isActive: true
        },
        {
          id: 3,
          userType: 'student',
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie.martin@etudiant.fr',
          // phone: '07 23 45 67 89',
          // birthDate: '1998-09-23',
          gender: 'F',
          studentId: 'ETU-2001',
          promotion: '2023-2024',
          major: 'informatique',
          level: 'M1',
          username: 'mmartin',
          isActive: true
        },
        {
          id: 4,
          userType: 'student',
          firstName: 'Lucas',
          lastName: 'Bernard',
          email: 'lucas.bernard@etudiant.fr',
          // phone: '07 34 56 78 90',
          // birthDate: '2000-07-15',
          gender: 'M',
          studentId: 'ETU-2002',
          promotion: '2023-2024',
          major: 'physique',
          level: 'L3',
          username: 'lbernard',
          isActive: true
        },
        {
          id: 5,
          userType: 'tutor',
          firstName: 'Pierre',
          lastName: 'Leroy',
          email: 'pierre.leroy@entreprise.com',
          // phone: '06 98 76 54 32',
          // birthDate: '1980-12-10',
          gender: 'M',
          company: 'Tech Solutions',
          position: 'Directeur Technique',
          expertise: 'Développement Web',
          username: 'pleroy',
          isActive: false
        },
        {
          id: 6,
          userType: 'tutor',
          firstName: 'Isabelle',
          lastName: 'Dubois',
          email: 'isabelle.dubois@entreprise.com',
          // phone: '06 87 65 43 21',
          // birthDate: '1985-04-22',
          gender: 'F',
          company: 'Marketing Pro',
          position: 'Consultante Marketing',
          expertise: 'Marketing Digital',
          username: 'idubois',
          isActive: true
        }
      ],
      searchQuery: '',
      showForm: false,
      isEditing: false,
      editingUserId: null,
      showDeleteModal: false,
      userToDelete: {},
      
      // Types d'utilisateurs
      userTypes: [
        { value: 'professor', label: 'Professeur', icon: '👨‍🏫' },
        { value: 'student', label: 'Étudiant', icon: '👨‍🎓' },
        { value: 'tutor', label: 'Tuteur', icon: '👨‍💼' }
      ],
      
      // Données du formulaire
      formData: {
        userType: '',
        firstName: '',
        lastName: '',
        email: '',
        // phone: '',
        // birthDate: '',
        gender: '',
        
        // Champs pour professeur
        department: '',
        specialty: '',
        employeeId: '',
        
        // Champs pour étudiant
        studentId: '',
        promotion: '',
        major: '',
        level: '',
        
        // Champs pour tuteur
        company: '',
        position: '',
        expertise: '',
        
        // Informations de compte
        username: '',
        password: '',
        isActive: true
      },
      
      // Erreurs de validation
      errors: {},
      
      // Affichage du mot de passe
      showPassword: false,
      
      // Message de succès
      showSuccessMessage: false,
      successTitle: '',
      successMessage: ''
    }
  },
  
  computed: {
    filteredUsers() {
      // Filtrer d'abord par type d'utilisateur selon l'onglet actif
      let users = this.users;
      if (this.activeTab !== 'all') {
        users = users.filter(user => user.userType === this.activeTab);
      }
      
      // Ensuite filtrer par la recherche
      if (!this.searchQuery) {
        return users;
      }
      
      const query = this.searchQuery.toLowerCase();
      return users.filter(user => {
        return user.firstName.toLowerCase().includes(query) ||
               user.lastName.toLowerCase().includes(query) ||
               user.email.toLowerCase().includes(query) ||
               (user.userType === 'professor' && user.specialty && user.specialty.toLowerCase().includes(query)) ||
               (user.userType === 'student' && user.studentId && user.studentId.toLowerCase().includes(query)) ||
               (user.userType === 'tutor' && user.company && user.company.toLowerCase().includes(query));
      });
    }
  },
  
  methods: {
    // Obtenir le libellé du type d'utilisateur
    getUserTypeLabel(type) {
      if (type === 'all') return 'Utilisateurs';
      const userType = this.userTypes.find(ut => ut.value === type);
      return userType ? userType.label : '';
    },
    
    // Obtenir le libellé du département
    getDepartmentLabel(department) {
      const departments = {
        'informatique': 'Informatique',
        'mathematiques': 'Mathématiques',
        'industriel': 'Industriel',
        'automobile': 'Automobile',
        'systeme': 'Système Embarqué',
        'energie': 'Energie',
        // 'economie': 'Économie et Gestion'
      };
      
      return departments[department] || department;
    },
    
    // Obtenir le nombre de colonnes pour le tableau
    getColspan() {
      switch (this.activeTab) {
        case 'professor':
        case 'student':
        case 'tutor':
          return 4; // Nom, Email, 2 colonnes spécifiques, Statut, Actions
        default:
          return 3; // Nom, Email, Statut, Actions
      }
    },
    
    // Filtrer les utilisateurs par type
    getFilteredUsersByType(type) {
      if (type === 'all') {
        return this.users;
      }
      return this.users.filter(user => user.userType === type);
    },
    
    // Afficher le formulaire d'ajout d'utilisateur
    showAddUserForm() {
      this.isEditing = false;
      this.editingUserId = null;
      
      // Si un onglet spécifique est sélectionné, présélectionner ce type d'utilisateur
      if (this.activeTab !== 'all') {
        this.formData.userType = this.activeTab;
      } else {
        this.resetForm();
      }
      
      this.showForm = true;
    },
    
    // Éditer un utilisateur existant
    editUser(user) {
      this.isEditing = true;
      this.editingUserId = user.id;
      
      // Copier les données de l'utilisateur dans le formulaire
      this.formData = { ...user, password: '' };
      
      this.showForm = true;
    },
    
    // Confirmer la suppression d'un utilisateur
    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    
    // Supprimer un utilisateur
    deleteUser() {
      // Dans une application réelle, vous feriez un appel API ici
      this.users = this.users.filter(user => user.id !== this.userToDelete.id);
      
      this.showDeleteModal = false;
      this.successTitle = 'Utilisateur supprimé';
      this.successMessage = `L'utilisateur ${this.userToDelete.firstName} ${this.userToDelete.lastName} a été supprimé avec succès.`;
      this.showSuccessMessage = true;
      
      // Réinitialiser l'utilisateur à supprimer
      this.userToDelete = {};
    },
    
    // Sélectionner le type d'utilisateur
    selectUserType(type) {
      this.formData.userType = type;
      // Réinitialiser les champs spécifiques au type d'utilisateur
      if (type === 'professor') {
        this.formData.studentId = '';
        this.formData.promotion = '';
        this.formData.major = '';
        this.formData.level = '';
        this.formData.company = '';
        this.formData.position = '';
        this.formData.expertise = '';
      } else if (type === 'student') {
        this.formData.department = '';
        this.formData.specialty = '';
        this.formData.employeeId = '';
        this.formData.company = '';
        this.formData.position = '';
        this.formData.expertise = '';
      } else if (type === 'tutor') {
        this.formData.department = '';
        this.formData.specialty = '';
        this.formData.employeeId = '';
        this.formData.studentId = '';
        this.formData.promotion = '';
        this.formData.major = '';
        this.formData.level = '';
      }
    },
    
    // Valider le formulaire
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      // Validation des champs communs
      if (!this.formData.userType) {
        this.errors.userType = "Veuillez sélectionner un type d'utilisateur";
        isValid = false;
      }
      
      if (!this.formData.firstName.trim()) {
        this.errors.firstName = "Le prénom est obligatoire";
        isValid = false;
      }
      
      if (!this.formData.lastName.trim()) {
        this.errors.lastName = "Le nom est obligatoire";
        isValid = false;
      }
      
      if (!this.formData.email.trim()) {
        this.errors.email = "L'email est obligatoire";
        isValid = false;
      } else if (!this.validateEmail(this.formData.email)) {
        this.errors.email = "Veuillez entrer une adresse email valide";
        isValid = false;
      }
      
      if (!this.formData.username.trim()) {
        this.errors.username = "Le nom d'utilisateur est obligatoire";
        isValid = false;
      }
      
      // Validation du mot de passe uniquement pour les nouveaux utilisateurs
      if (!this.isEditing && !this.formData.password.trim()) {
        this.errors.password = "Le mot de passe est obligatoire";
        isValid = false;
      } else if (this.formData.password.trim() && this.formData.password.length < 8) {
        this.errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        isValid = false;
      }
      
      // Validation des champs spécifiques au type d'utilisateur
      if (this.formData.userType === 'professor') {
        if (!this.formData.department) {
          this.errors.department = "Le département est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.specialty.trim()) {
          this.errors.specialty = "La spécialité est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.employeeId.trim()) {
          this.errors.employeeId = "Le numéro d'employé est obligatoire";
          isValid = false;
        }
      }
      
      if (this.formData.userType === 'student') {
        if (!this.formData.studentId.trim()) {
          this.errors.studentId = "Le numéro d'étudiant est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.promotion.trim()) {
          this.errors.promotion = "La promotion est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.major) {
          this.errors.major = "La filière est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.level) {
          this.errors.level = "Le niveau d'études est obligatoire";
          isValid = false;
        }
      }
      
      if (this.formData.userType === 'tutor') {
        if (!this.formData.company.trim()) {
          this.errors.company = "L'entreprise est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.position.trim()) {
          this.errors.position = "Le poste est obligatoire";
          isValid = false;
        }
        
        if (!this.formData.expertise.trim()) {
          this.errors.expertise = "Le domaine d'expertise est obligatoire";
          isValid = false;
        }
      }
      
      return isValid;
    },
    
    // Valider le format de l'email
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    
    // Soumettre le formulaire
    submitForm() {
      if (this.validateForm()) {
        if (this.isEditing) {
          // Mettre à jour un utilisateur existant
          const index = this.users.findIndex(user => user.id === this.editingUserId);
          
          if (index !== -1) {
            // Si le mot de passe est vide, conserver l'ancien
            if (!this.formData.password) {
              this.formData.password = this.users[index].password;
            }
            
            // Mettre à jour l'utilisateur
            this.users.splice(index, 1, { ...this.formData, id: this.editingUserId });
            
            this.successTitle = 'Utilisateur modifié';
            this.successMessage = `Les informations de ${this.formData.firstName} ${this.formData.lastName} ont été mises à jour.`;
          }
        } else {
          // Ajouter un nouvel utilisateur
          const newId = Math.max(...this.users.map(user => user.id), 0) + 1;
          this.users.push({ ...this.formData, id: newId });
          
          this.successTitle = 'Utilisateur créé';
          this.successMessage = `L'utilisateur ${this.formData.firstName} ${this.formData.lastName} a été créé avec succès.`;
        }
        
        this.showSuccessMessage = true;
        this.showForm = false;
        this.resetForm();
      }
    },
    
    // Annuler le formulaire
    cancelForm() {
      this.showForm = false;
      this.resetForm();
    },
    
    // Réinitialiser le formulaire
    resetForm() {
      this.formData = {
        userType: '',
        firstName: '',
        lastName: '',
        email: '',
        // phone: '',
        // birthDate: '',
        gender: 'M',
        
        // Champs pour professeur
        department: 'informatique',
        specialty: '',
        employeeId: '',
        
        // Champs pour étudiant
        studentId: '',
        promotion: '',
        major: '',
        level: '',
        
        // Champs pour tuteur
        company: '',
        position: '',
        expertise: '',
        
        // Informations de compte
        username: '',
        password: '',
        isActive: true
      };
      this.errors = {};
      this.isEditing = false;
      this.editingUserId = null;
    }
  }
}
</script>

<style>
/* Variables de couleur */
:root {
  --primary-color: #a8e4e0;
  --primary-light: #a8e0d9;
  --primary-dark: #2c5c55;
  --secondary-color: #f5f5f5;
  --text-color: #333;
  --text-light: #777;
  --border-color: #e0e0e0;
  --error-color: #d32f2f;
  --success-color: #4caf50;
  --danger-color: #f44336;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Conteneur principal */
.registration-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

/* Titre de la page */
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-color);
}

/* Carte des utilisateurs */
.users-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 30px;
}

/* En-tête de la carte */
.card-header {
  padding: 20px;
  background-color: var(--primary-color);
  color: white;
}

.card-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
}

.card-subtitle {
  font-size: 14px;
  opacity: 0.8;
}

/* Actions d'en-tête */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

/* Recherche */
.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 15px 8px 35px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color:black
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

/* Bouton avec icône */
.btn-icon {
  margin-right: 5px;
}

/* Onglets */
.tabs-container {
  display: flex;
  background-color: #f9f9f9;
  border-bottom: 1px solid var(--border-color);
}

.tab {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  background-color: #f0f0f0;
}

.tab.active {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  font-size: 14px;
}

.tab-count {
  background-color: #eee;
  color: var(--text-color);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
}

.tab.active .tab-count {
  background-color: var(--primary-light);
  color: var(--primary-dark);
}

/* Tableau des utilisateurs */
.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.users-table th {
  background-color: var(--secondary-color);
  font-weight: 500;
  color: var(--text-color);
}

.users-table tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Badge de type d'utilisateur */
.user-type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.user-type-badge.professor {
  background-color: #e3f2fd;
  color: #1976d2;
}

.user-type-badge.student {
  background-color: #e8f5e9;
  color: #388e3c;
}

.user-type-badge.tutor {
  background-color: #fff3e0;
  color: #f57c00;
}

/* Badge de statut */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: var(--success-color);
}

.status-badge:not(.active) {
  background-color: #ffebee;
  color: var(--error-color);
}

/* Cellule d'actions */
.actions-cell {
  white-space: nowrap;
}

/* Boutons d'action */
.action-btn {
  background: none;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-btn.edit {
  color: #1976d2;
}

.action-btn.edit:hover {
  background-color: #e3f2fd;
}

.action-btn.delete {
  color: var(--danger-color);
}

.action-btn.delete:hover {
  background-color: #ffebee;
}

.action-text {
  margin-left: 3px;
}

/* Message "Aucun résultat" */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: var(--text-light);
}

.no-results-icon {
  font-size: 24px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.no-results-text {
  font-style: italic;
}

/* Carte d'inscription */
.registration-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 20px;
}

/* Conteneur du formulaire */
.form-container {
  padding: 20px;
}

/* Section du formulaire */
.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: var(--primary-color);
}

/* Ligne de formulaire (pour les champs côte à côte) */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
}

/* Groupe de formulaire */
.form-group {
  margin-bottom: 15px;
}

/* Étiquettes */
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-color);
}

/* Champs de saisie */
.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.input-error {
  border-color: var(--error-color);
}

/* Messages d'erreur */
.error-message {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 5px;
}

/* Sélecteur de type d'utilisateur */
.user-type-selector {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.user-type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-type-option:hover {
  background-color: var(--secondary-color);
}

.user-type-option.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.user-type-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.user-type-label {
  font-size: 14px;
  font-weight: 500;
}

/* Conteneur d'entrée de mot de passe */
.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* Interrupteur de statut */
.status-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-size: 14px;
  color: var(--text-light);
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Boutons d'action */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--secondary-color);
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #c62828;
}

/* Message de succès */
.success-message {
  display: flex;
  align-items: center;
  background-color: #e8f5e9;
  border-left: 4px solid var(--success-color);
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  position: relative;
}

.success-icon {
  background-color: var(--success-color);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.success-content h3 {
  font-size: 16px;
  color: var(--success-color);
  margin-bottom: 5px;
}

.success-content p {
  font-size: 14px;
  color: var(--text-color);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-light);
}

/* Modal de confirmation */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-light);
}

.modal-content {
  padding: 20px;
}

.warning-text {
  color: var(--danger-color);
  font-weight: 500;
  margin-top: 10px;
}

.modal-actions {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .user-type-selector {
    flex-direction: column;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .search-container {
    width: 100%;
  }
  
  .tabs-container {
    overflow-x: auto;
  }
  
  .tab {
    padding: 10px 15px;
    white-space: nowrap;
  }
  
  .action-text {
    display: none;
  }
}
</style>