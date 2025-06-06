<template>
  <div class="profile-container">
    <h1 class="page-title">Profil Administrateur</h1>
    
    <div class="profile-card">
      <div class="card-header">
        <h2 class="card-title">Informations personnelles</h2>
      </div>
      
      <div class="profile-content">
        <div class="profile-header">
          <div class="profile-avatar">
            <span class="avatar-text">{{ getInitials(admin.firstName, admin.lastName) }}</span>
          </div>
          <div class="profile-info">
            <h3 class="profile-name">{{ admin.firstName }} {{ admin.lastName }}</h3>
            <p class="profile-role">{{ admin.role }}</p>
            <!-- <p class="profile-status" :class="{ active: admin.isActive }">
              <span class="status-dot"></span>
              {{ admin.isActive ? 'Actif' : 'Inactif' }}
            </p> -->
          </div>
        </div>
        
        <div class="profile-section">
          <h4 class="section-title">Coordonnées</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ admin.email }}</span>
            </div>
            <!-- <div class="info-item">
              <span class="info-label">Téléphone</span>
              <span class="info-value">{{ admin.phone }}</span>
            </div> -->
            <div class="info-item">
              <span class="info-label">Nom d'utilisateur</span>
              <span class="info-value">{{ admin.username }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn-secondary" @click="showPasswordModal = true">Modifier le mot de passe</button>
        <button class="btn-primary" @click="showProfileModal = true">Modifier le profil</button>
      </div>
    </div>
    
    <!-- Modal de modification du mot de passe -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Modifier le mot de passe</h3>
          <button class="modal-close" @click="showPasswordModal = false">×</button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label class="form-label">Mot de passe actuel *</label>
            <div class="password-input-container">
              <input 
                :type="showCurrentPassword ? 'text' : 'password'" 
                v-model="passwordForm.currentPassword" 
                class="form-input"
                :class="{ 'input-error': passwordErrors.currentPassword }"
                placeholder="Entrez votre mot de passe actuel"
              />
              <button 
                type="button" 
                class="password-toggle" 
                @click="showCurrentPassword = !showCurrentPassword"
              >
                {{ showCurrentPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="passwordErrors.currentPassword" class="error-message">{{ passwordErrors.currentPassword }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Nouveau mot de passe *</label>
            <div class="password-input-container">
              <input 
                :type="showNewPassword ? 'text' : 'password'" 
                v-model="passwordForm.newPassword" 
                class="form-input"
                :class="{ 'input-error': passwordErrors.newPassword }"
                placeholder="Entrez votre nouveau mot de passe"
              />
              <button 
                type="button" 
                class="password-toggle" 
                @click="showNewPassword = !showNewPassword"
              >
                {{ showNewPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="passwordErrors.newPassword" class="error-message">{{ passwordErrors.newPassword }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirmer le mot de passe *</label>
            <div class="password-input-container">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="passwordForm.confirmPassword" 
                class="form-input"
                :class="{ 'input-error': passwordErrors.confirmPassword }"
                placeholder="Confirmez votre nouveau mot de passe"
              />
              <button 
                type="button" 
                class="password-toggle" 
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="passwordErrors.confirmPassword" class="error-message">{{ passwordErrors.confirmPassword }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showPasswordModal = false">Annuler</button>
          <button class="btn-primary" @click="updatePassword">Enregistrer</button>
        </div>
      </div>
    </div>
    
    <!-- Modal de modification du profil -->
    <div v-if="showProfileModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Modifier le profil</h3>
          <button class="modal-close" @click="showProfileModal = false">×</button>
        </div>
        <div class="modal-content">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prénom *</label>
              <input 
                type="text" 
                v-model="profileForm.firstName" 
                class="form-input"
                :class="{ 'input-error': profileErrors.firstName }"
                placeholder="Prénom"
              />
              <span v-if="profileErrors.firstName" class="error-message">{{ profileErrors.firstName }}</span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Nom *</label>
              <input 
                type="text" 
                v-model="profileForm.lastName" 
                class="form-input"
                :class="{ 'input-error': profileErrors.lastName }"
                placeholder="Nom"
              />
              <span v-if="profileErrors.lastName" class="error-message">{{ profileErrors.lastName }}</span>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input 
                type="email" 
                v-model="profileForm.email" 
                class="form-input"
                :class="{ 'input-error': profileErrors.email }"
                placeholder="Email"
              />
              <span v-if="profileErrors.email" class="error-message">{{ profileErrors.email }}</span>
            </div>
            
            <!-- <div class="form-group">
              <label class="form-label">Téléphone</label>
              <input 
                type="tel" 
                v-model="profileForm.phone" 
                class="form-input"
                placeholder="Téléphone"
              />
            </div> -->
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showProfileModal = false">Annuler</button>
          <button class="btn-primary" @click="updateProfile">Enregistrer</button>
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
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  
  data() {
    return {
      admin: {
        firstName: 'Assaad',
        lastName: 'El Ayddouni',
        role: 'Administrateur Système',
        email: 'assaad.elayddouni@gg.com',
        // phone: '06 XX XX XX XX',
        username: 'elayddouni_assaad'//,
        // isActive: true
      },
      
      // Modals
      showPasswordModal: false,
      showProfileModal: false,
      
      // Formulaire de mot de passe
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordErrors: {},
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      
      // Formulaire de profil
      profileForm: {
        firstName: '',
        lastName: '',
        email: ''//,
        // phone: ''
      },
      profileErrors: {},
      
      // Message de succès
      showSuccessMessage: false,
      successTitle: '',
      successMessage: ''
    }
  },
  
  watch: {
    showProfileModal(val) {
      if (val) {
        // Initialiser le formulaire avec les données actuelles
        this.profileForm = {
          firstName: this.admin.firstName,
          lastName: this.admin.lastName,
          email: this.admin.email//,
          // phone: this.admin.phone
        };
        this.profileErrors = {};
      }
    },
    
    showPasswordModal(val) {
      if (val) {
        // Réinitialiser le formulaire de mot de passe
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        this.passwordErrors = {};
      }
    }
  },
  methods: {
    getInitials(firstName, lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    },
    
    validatePasswordForm() {
      this.passwordErrors = {};
      let isValid = true;
      
      if (!this.passwordForm.currentPassword) {
        this.passwordErrors.currentPassword = "Le mot de passe actuel est requis";
        isValid = false;
      }
      
      if (!this.passwordForm.newPassword) {
        this.passwordErrors.newPassword = "Le nouveau mot de passe est requis";
        isValid = false;
      } else if (this.passwordForm.newPassword.length < 8) {
        this.passwordErrors.newPassword = "Le mot de passe doit contenir au moins 8 caractères";
        isValid = false;
      }
      
      if (!this.passwordForm.confirmPassword) {
        this.passwordErrors.confirmPassword = "La confirmation du mot de passe est requise";
        isValid = false;
      } else if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        isValid = false;
      }
      
      return isValid;
    },
    
    validateProfileForm() {
      this.profileErrors = {};
      let isValid = true;
      
      if (!this.profileForm.firstName.trim()) {
        this.profileErrors.firstName = "Le prénom est requis";
        isValid = false;
      }
      
      if (!this.profileForm.lastName.trim()) {
        this.profileErrors.lastName = "Le nom est requis";
        isValid = false;
      }
      
      if (!this.profileForm.email.trim()) {
        this.profileErrors.email = "L'email est requis";
        isValid = false;
      } else if (!this.validateEmail(this.profileForm.email)) {
        this.profileErrors.email = "Veuillez entrer une adresse email valide";
        isValid = false;
      }
      
      return isValid;
    },
    
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    
    updatePassword() {
      if (this.validatePasswordForm()) {
        // Simuler une mise à jour du mot de passe
        console.log('Mot de passe mis à jour:', this.passwordForm);
        //await axios.patch('http://localhost:3000/admin/'+this.$route.params.id,{
        //   password:this.passwordForm.newPassword;
        // })
        
        // Fermer la modal
        this.showPasswordModal = false;
        
        // Afficher un message de succès
        this.successTitle = "Mot de passe modifié";
        this.successMessage = "Votre mot de passe a été mis à jour avec succès.";
        this.showSuccessMessage = true;
      }
    },
    
    updateProfile() {
      if (this.validateProfileForm()) {
        // Mettre à jour les informations de l'administrateur
        this.admin.firstName = this.profileForm.firstName;
        this.admin.lastName = this.profileForm.lastName;
        this.admin.email = this.profileForm.email;
        this.admin.phone = this.profileForm.phone;
        // await axios.patch('http://localhost:3000/admin/'+this.$route.params.id,{
        // firstName : this.profileForm.firstName,
        // lastName : this.profileForm.lastName,
        // email : this.profileForm.email,
        // phone : this.profileForm.phone,
        // })
        // Fermer la modal
        this.showProfileModal = false;
        
        // Afficher un message de succès
        this.successTitle = "Profil mis à jour";
        this.successMessage = "Vos informations personnelles ont été mises à jour avec succès.";
        this.showSuccessMessage = true;
      }
    },
    // async getProfile(){
    //   const res=await axios.get('http://localhost:3000/admin/'+this.$route.params.id);
    //   this.admin=res.data;
    // }
  }
  // mounted(){
  //   getProfile();
  // }
  
}
</script>

<style>
/* Variables de couleur */
:root {
  --primary-color: #3a7a70;
  --primary-light: #a8e0d9;
  --primary-dark: #2c5c55;
  --secondary-color: #f5f5f5;
  --text-color: #333;
  --text-light: #777;
  --border-color: #e0e0e0;
  --error-color: #d32f2f;
  --success-color: #4caf50;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Conteneur principal */
.profile-container {
  max-width: 900px;
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

/* Carte de profil */
.profile-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 20px;
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
  margin: 0;
}

/* Contenu du profil */
.profile-content {
  padding: 20px;
}

/* En-tête du profil */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

/* Avatar */
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.avatar-text {
  color: white;
  font-size: 28px;
  font-weight: bold;
}

/* Informations du profil */
.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 22px;
  font-weight: 500;
  margin: 0 0 5px 0;
  color: var(--text-color);
}

.profile-role {
  font-size: 16px;
  color: var(--text-light);
  margin: 0 0 10px 0;
}

.profile-status {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--error-color);
}

.profile-status.active {
  color: var(--success-color);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--error-color);
  margin-right: 6px;
}

.profile-status.active .status-dot {
  background-color: var(--success-color);
}

/* Section du profil */
.profile-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--primary-color);
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

/* Grille d'informations */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.info-value {
  font-size: 14px;
  color: var(--text-color);
}

/* Actions du profil */
.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
}

/* Boutons */
.btn-primary,
.btn-secondary {
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

/* Modal */
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
  width: 500px;
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

.modal-actions {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Formulaire */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-color);
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.input-error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 5px;
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

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>