<template>
  <div style="display: flex;">
    <Sidebar />
    <div class="main-content">
      <div class="title-header">
        <h1>Evaluation-pairs</h1>
      </div>

      <!-- Étape 1 : Liste des groupes -->
      <div class="group-list" v-if="!selectedGroup">
        <table>
          <thead>
            <tr>
              <th>Liste des groupes</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="groupe in groupes"
              :key="groupe.id"
              @click="selectGroup(groupe.id)"
              class="clickable-row"
            >
              <td>{{ groupe.nom }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Étape 2 : Liste des étudiants du groupe -->
      <div class="student-list" v-else-if="!selectedEtudiant">
        <button @click="selectedGroup = null" class="back-button">← Retour aux groupes</button>
        <table>
          <thead>
            <tr>
              <th>Étudiants du {{ selectedGroupName }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="etudiant in etudiants"
              :key="etudiant.id"
              @click="selectedEtudiant = etudiant"
              class="clickable-row"
            >
              <td>{{ etudiant.nom }} {{ etudiant.prenom }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Étape 3 : Évaluation de l'étudiant sélectionné -->
      <div class="evaluation-form" v-else>
        <button @click="selectedEtudiant = null" class="back-button">← Retour aux étudiants</button>
        <h3>Évaluation de {{ selectedEtudiant.nom }} {{ selectedEtudiant.prenom }}</h3>

        <table>
          <thead>
            <tr>
              <th>Compétences</th>
              <th>Notes</th>
              <th>Commentaires</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in evaluations" :key="index">
              <td>{{ item.label }}</td>
              <td><input type="number" min="0" max="20" v-model="item.note" /></td>
              <td><input type="text" v-model="item.commentaire" /></td>
            </tr>
          </tbody>
        </table>

        <button class="save-button" @click="saveEvaluations">
          Sauvegarder
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/DynamicSidebar.vue";

export default {
  name: "EvaluationPairs",
  components: {
    Sidebar,
  },
  data() {
    return {
      groupes: [
        { id: 1, nom: "Groupe A" },
        { id: 2, nom: "Groupe B" },
        { id: 3, nom: "Groupe C" },
        { id: 4, nom: "Groupe D" },
        { id: 5, nom: "Groupe E" },
      ],
      etudiants: [],
      selectedGroup: null,
      selectedEtudiant: null,
      evaluations: [
        { label: "compétance1", note: "", commentaire: "" },
        { label: "compétance2", note: "", commentaire: "" },
        { label: "compétance3", note: "", commentaire: "" },
        { label: "compétance4", note: "", commentaire: "" },
      ]
    };
  },
  computed: {
    selectedGroupName() {
      const g = this.groupes.find((g) => g.id === this.selectedGroup);
      return g ? g.nom : "";
    },
  },
  methods: {
    selectGroup(groupId) {
      this.selectedGroup = groupId;
      const allEtudiants = {
        1: [
          { id: 1, nom: "Dupont", prenom: "Alice" },
          { id: 2, nom: "Bili", prenom: "Mohammed Ali" },
          { id: 3, nom: "Aboussouf", prenom: "Ilyas" },
          { id: 4, nom: "Karrouk", prenom: "Houssam" },
          { id: 5, nom: "Smith", prenom: "John" },
        ],
        2: [
          { id: 6, nom: "Tanaka", prenom: "Aiko" },
          { id: 7, nom: "Mendoza", prenom: "Carlos" },
          { id: 8, nom: "Ivanov", prenom: "Mikhail" },
          { id: 9, nom: "El-Amin", prenom: "Zara" },
          { id: 10, nom: "Nguyen", prenom: "Linh" },
        ],
        3: [
          { id: 11, nom: "Martinez", prenom: "Sofia" },
          { id: 12, nom: "Kumar", prenom: "Raj" },
          { id: 13, nom: "Haddad", prenom: "Amine" },
          { id: 14, nom: "Zhou", prenom: "Wei" },
          { id: 15, nom: "Petrov", prenom: "Anastasia" },
        ],
        4: [
          { id: 16, nom: "Aliyev", prenom: "Farid" },
          { id: 17, nom: "Lemaire", prenom: "Clara" },
          { id: 18, nom: "Ahmed", prenom: "Youssef" },
          { id: 19, nom: "Chen", prenom: "Liang" },
          { id: 20, nom: "Moreira", prenom: "Joana" },
        ],
        5: [
          { id: 21, nom: "Khan", prenom: "Aisha" },
          { id: 22, nom: "Rossi", prenom: "Marco" },
          { id: 23, nom: "Singh", prenom: "Dev" },
          { id: 24, nom: "Garcia", prenom: "Lucia" },
          { id: 25, nom: "Ba", prenom: "Moussa" },
        ],
      };
      this.etudiants = allEtudiants[groupId] || [];
    },
    saveEvaluations() {
      console.log("Évaluation de", this.selectedEtudiant);
      console.log("Détails:", this.evaluations);
      alert("Évaluation enregistrée pour " + this.selectedEtudiant.nom);
      this.selectedEtudiant = null;
    },
  },
};
</script>

<style scoped>
.group-list table,
.student-list table,
.evaluation-form table {
  width: 100%;
  max-width: 600px;
  border-collapse: collapse;
  background-color: white;
  margin: 30px auto;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-row:hover {
  background-color: #7fcfc3;
  color: white;
}

input[type="number"],
input[type="text"] {
  width: 90%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button,
.back-button {
  margin: 10px auto;
  display: block;
  padding: 10px 20px;
  border: none;
  background-color: #7fcfc3;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
}

.save-button:hover,
.back-button:hover {
  background-color: #5abfb1;
}
</style>