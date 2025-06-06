<template>
  <div class="evaluation-container">
    <Sidebar />
    <div class="content">
      <h1 class="title">Évaluation des Étudiants</h1>

      <!-- Filières -->
      <div class="section">
        <h3>Choisir une filière :</h3>
        <ul class="selection-list">
          <li v-for="filiere in filieres" :key="filiere.id"
              :class="{ active: selectedFiliere?.id === filiere.id }"
              @click="selectFiliere(filiere)">
            {{ filiere.nom }}
          </li>
        </ul>
      </div>

      <!-- Étudiants -->
      <div v-if="selectedFiliere" class="section">
        <h3>Étudiants de {{ selectedFiliere.nom }} :</h3>
        <ul class="selection-list">
          <li v-for="etudiant in selectedFiliere.etudiants" :key="etudiant.id"
              :class="{ active: selectedEtudiant?.id === etudiant.id }"
              @click="selectEtudiant(etudiant)">
            {{ etudiant.nom }}
          </li>
        </ul>
      </div>

      <!-- Compétences -->
      <div v-if="selectedEtudiant" class="section">
        <h3>Compétences à évaluer :</h3>
        <ul class="selection-list">
          <li v-for="competence in competences" :key="competence.id"
              :class="{ active: selectedCompetence?.id === competence.id }"
              @click="selectCompetence(competence)">
            {{ competence.nom }}
          </li>
        </ul>
      </div>

      <!-- Évaluation -->
      <div v-if="selectedCompetence" class="evaluation-form">
        <h3>Évaluer : {{ selectedCompetence.nom }}</h3>
        <input v-model="note" placeholder="Note sur 20" type="number" min="0" max="20" />
        <textarea v-model="commentaire" placeholder="Commentaire..." />
        <button @click="validerEvaluation">Valider</button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/DynamicSidebar.vue'

export default {
  components: { Sidebar },
  data() {
    return {
      filieres: [
        { id: 1, nom: 'Informatique', etudiants: [
          { id: 101, nom: 'Ali' },
          { id: 102, nom: 'Fatima' }
        ]},
        { id: 2, nom: 'Génie Civil', etudiants: [
          { id: 201, nom: 'Sara' },
          { id: 202, nom: 'Omar' }
        ]}
      ],
      competences: [
        { id: 1, nom: 'Travail en équipe' },
        { id: 2, nom: 'Communication' },
        { id: 3, nom: 'Autonomie' }
      ],
      selectedFiliere: null,
      selectedEtudiant: null,
      selectedCompetence: null,
      note: '',
      commentaire: ''
    }
  },
  methods: {
    selectFiliere(filiere) {
      this.selectedFiliere = filiere
      this.selectedEtudiant = null
      this.selectedCompetence = null
    },
    selectEtudiant(etudiant) {
      this.selectedEtudiant = etudiant
      this.selectedCompetence = null
    },
    selectCompetence(competence) {
      this.selectedCompetence = competence
      this.note = ''
      this.commentaire = ''
    },
    validerEvaluation() {
      if (!this.note || !this.commentaire) {
        alert('Veuillez remplir tous les champs')
        return
      }
      alert(`Évaluation enregistrée : ${this.note}/20 - ${this.commentaire}`)
      this.selectedCompetence = null
      this.note = ''
      this.commentaire = ''
    }
  }
}
</script>

<style scoped>
.evaluation-container {
  display: flex;
  min-height: 100vh;
  background-color: white;
  font-family: 'Segoe UI', sans-serif;
}

.content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 28px;
  background-color: #94d3cc;
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 30px;
}

.section {
  width: 100%;
  max-width: 700px;
  margin-bottom: 30px;
}

.selection-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.selection-list li {
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.selection-list li.active {
  background-color: #00c8b3;
  color: white;
  font-weight: bold;
}

.evaluation-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  width: 100%;
}

.evaluation-form input,
.evaluation-form textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.evaluation-form button {
  background-color: #00c8b3;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
