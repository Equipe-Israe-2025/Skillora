<template>
    <div class="profile-card">
      <h2>Informations personnelles</h2>
      <div class="row">
        <div class="col-left">
          <p>Nom et Prénom :</p>
          <p>CIN :</p>
          <p>N° de téléphone :</p>
          <p>Adresse :</p>
          <p>Date de naissance :</p>
          <p>Groupe :</p>
        </div>
        <div class="col-right">
          <!-- ✅ Vérifie que les données sont chargées + non vides -->
          <p v-if="isLoaded && student.username">{{ student.username }}</p>
          <p v-if="isLoaded && student.cin">{{ student.cin }}</p>
          <p v-if="isLoaded && student.phone">{{ student.phone }}</p>
          <p v-if="isLoaded && student.address">{{ student.address }}</p>
          <p v-if="isLoaded && student.birthDate">{{ student.birthDate }}</p>
          <p v-if="isLoaded && student.group">{{ student.group }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProfileCard",
    props: {
      student: {
        type: Object,
        required: true,
      },
      isLoaded: {
        type: Boolean,
        required: true,
      },
    },
  };
  </script>
  