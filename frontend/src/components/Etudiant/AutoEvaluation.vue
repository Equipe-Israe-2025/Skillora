<template>
    <div style="display: flex;">
      <Sidebar />
      <div class="main-content">
        <div class="title-header">
          <h1>Auto-évaluation</h1>
        </div>
  
        <div class="evaluation-form">
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
    name: "AutoEvaluation",
    components: {
      Sidebar,
    },
    data() {
      return {
        evaluations: [
          { label: "compétance1", note: "", commentaire: "" },
          { label: "compétance2", note: "", commentaire: "" },
          { label: "compétance3", note: "", commentaire: "" },
          { label: "compétance4", note: "", commentaire: "" },
        ],
      };
    },
    methods: {
      saveEvaluations() {
        console.log("Évaluations enregistrées :", this.evaluations);
        alert("Évaluation enregistrée !");
      },
    },
  };
  </script>
  
  <style scoped>
  .evaluation-form {
    margin: 20px auto;
    padding: 30px;
    background-color: #f3f3f3;
    border-radius: 10px;
    width: 90%;
    max-width: 800px;
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
  }
  
  input[type="number"],
  input[type="text"] {
    width: 100%;
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
  