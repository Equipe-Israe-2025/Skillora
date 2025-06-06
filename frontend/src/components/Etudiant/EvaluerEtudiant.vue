<template>
    <div style="display: flex;">
      <Sidebar />
      <div class="main-content">
        <div class="title-header">
          <h1>Evaluation-pairs</h1>
        </div>
  
        <div class="evaluation-table">
          <table>
            <thead>
              <tr>
                <th>Nom et prénom</th>
                <th>Skill1</th>
                <th>Skill2</th>
                <th>Skill3</th>
                <th>Skill4</th>
                <th>Skill5</th>
                <th>Commentaires</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ etudiant.nom }} {{ etudiant.prenom }}</td>
                <td><input type="number" v-model="skills.skill1" min="0" max="10" /></td>
                <td><input type="number" v-model="skills.skill2" min="0" max="10" /></td>
                <td><input type="number" v-model="skills.skill3" min="0" max="10" /></td>
                <td><input type="number" v-model="skills.skill4" min="0" max="10" /></td>
                <td><input type="number" v-model="skills.skill5" min="0" max="10" /></td>
                <td><input type="text" v-model="commentaire" /></td>
              </tr>
            </tbody>
          </table>
  
          <button class="save-button" @click="submitEvaluation">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from "@/components/DynamicSidebar.vue";
  
  export default {
    name: "EvaluerEtudiant",
    components: {
      Sidebar,
    },
    data() {
      return {
        etudiant: {
          nom: "",
          prenom: "",
        },
        skills: {
          skill1: "",
          skill2: "",
          skill3: "",
          skill4: "",
          skill5: "",
        },
        commentaire: "",
      };
    },
    mounted() {
      const id = this.$route.params.id;
  
      // ✅ Simulation : récupère les données selon l'ID
      const allEtudiants = [
        { id: "1", nom: "Dupont", prenom: "Alice" },
        { id: "2", nom: "Bili", prenom: "Mohammed Ali" },
        { id: "3", nom: "Aboussouf", prenom: "Ilyas" },
        { id: "4", nom: "Karrouk", prenom: "Houssam" },
      ];
  
      this.etudiant = allEtudiants.find((e) => e.id === id) || {
        nom: "Inconnu",
        prenom: "",
      };
    },
    methods: {
      submitEvaluation() {
        console.log("Évaluation envoyée pour :", this.etudiant);
        console.log("Notes :", this.skills);
        console.log("Commentaire :", this.commentaire);
        alert("Évaluation enregistrée !");
      },
    },
  };
  </script>
  
  <style scoped>
  .evaluation-table {
    margin: 30px auto;
    padding: 30px;
    background-color: #f3f3f3;
    border-radius: 10px;
    max-width: 1000px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    margin-bottom: 20px;
  }
  
  th,
  td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
  }
  
  input[type="number"],
  input[type="text"] {
    width: 90%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .save-button {
    background-color: #7fcfc3;
    color: white;
    font-weight: bold;
    border: none;
    padding: 10px 25px;
    border-radius: 30px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .save-button:hover {
    background-color: #5abfb1;
  }
  </style>
  