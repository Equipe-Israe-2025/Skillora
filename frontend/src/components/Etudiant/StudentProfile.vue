<template>
    <div style="display: flex;">
      <Sidebar />
      <div class="main-content">
        <div class="title-header">
          <h1>Profil Étudiant</h1>
        </div>
  
        <!-- ✅ Ne s'affiche que si les données sont prêtes -->
        <ProfileCard v-if="isLoaded" :student="student" />
  
        <!-- ✅ Message d’attente (optionnel) -->
        <div v-else class="text-center text-gray-500 mt-10">
          Chargement des informations...
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from "@/components/DynamicSidebar.vue";
  import ProfileCard from "./ProfileCard.vue";
  
  export default {
    name: "StudentProfile",
    components: {
      Sidebar,
      ProfileCard,
    },
    data() {
      return {
        isLoaded: false, // ✅ Affichage conditionnel
        student: {},     // Vide au début
      };
    },
    mounted() {
      // ✅ Simule un appel API (remplace par ton fetch réel)
      setTimeout(() => {
        this.student = {
          username: "Username",
          cin: "G400887",
          phone: "06**75**74",
          address: "Boukhalef, Tanger",
          birthDate: "12/09/1993",
          group: "Ginf1",
        };
        this.isLoaded = true;
      }, 1000); // 1 seconde de délai
    },
  };
  </script>
  