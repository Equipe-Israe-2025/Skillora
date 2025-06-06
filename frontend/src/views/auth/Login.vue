<template>
  <div class="login-container">
    <div class="container">
      <div class="split-layout">
        <!-- Form Section -->
        <div class="form-section">
          <div class="form-wrapper">
            <h1 class="heading">Bienvenue</h1>
            <p class="subheading">Veuillez Entrer vos informations</p>
            
            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>
            
            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="loginForm.email"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Mot de passe</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="loginForm.password"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Rôle</label>
                <select class="form-select" v-model="loginForm.role">
                  <option value="Encadrant">Encadrant</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Etudiant">Etudiant</option>
                  <option value="Tuteur">Tuteur</option>
                </select>
              </div>

              <button 
                class="login-button"
                :class="{ 'loading-button': authStore.isLoading }"
                type="submit"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="spinner"></span>
                {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Logo Section -->
        <div class="logo-section">
          <img src="@/assets/logo.png" class="logo-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
  role: 'Encadrant'
})

const roleMap = {
  Encadrant: 'Encadrant',
  Administrateur: 'Administrateur',
  Etudiant: 'Etudiant',
  Tuteur: 'Tuteur'
}

const handleLogin = async () => {
  // authStore.clearMessages()
  
  if (!loginForm.value.email || !loginForm.value.password) {
    authStore.error = 'Veuillez remplir tous les champs'
    return
  }
  
  const credentials = {
    email: loginForm.value.email,
    password: loginForm.value.password,
    role: roleMap[loginForm.value.role]
  }
  try{
    const success = await authStore.login(credentials)
  if (success) {
    loginForm.value = { email: '', password: '', role: 'Encadrant' }
  }
  }catch( e){
    console.log("pas d'api");
  }
  
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #89CEC5;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.split-layout {
  display: flex;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
}

.form-section {
  flex: 1;
  padding: 3rem;
  max-width: 50%;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.logo-section {
  flex: 1;
  background: #D8E8E8;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 50%;
}

.heading {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subheading {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.login-button {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: white;
  background-color: #2E7C73;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.login-button:hover {
  background-color: #23645d;
}

.loading-button {
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.logo-image {
  max-width: 100%;
  height: auto;
  max-width: 500px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .split-layout {
    flex-direction: column;
  }
  
  .form-section,
  .logo-section {
    max-width: 100%;
    width: 100%;
  }
  
  .logo-section {
    padding: 2rem;
  }
}
</style>