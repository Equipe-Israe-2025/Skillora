<template>
  <div style="display: flex;">
    <Sidebar />
    <div class="main-content">
      <div class="title-header">
        <h1>Suivi de l'étudiant</h1>
      </div>

      <div class="competence-list" v-if="!selectedCompetence">
        <h3>Liste des compétences</h3>
        <ul>
          <li
            v-for="(item, index) in competences"
            :key="index"
            @click="selectCompetence(item)"
            class="competence-item"
          >
            {{ item.nom }}
          </li>
        </ul>
      </div>

      <div class="competence-detail" v-else>
        <button class="back-button" @click="selectedCompetence = null">← Retour</button>
        <h3>{{ selectedCompetence.nom }}</h3>
        <p>Note actuelle : <strong>{{ selectedCompetence.note }}/5</strong></p>

        <div>
          <canvas id="competenceChart"></canvas>
        </div>

        <button class="download-button" @click="downloadReport">Télécharger rapport</button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/DynamicSidebar.vue';
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'SuiviEtudiant',
  components: { Sidebar },
  data() {
    return {
      competences: [
        { nom: 'Compétence 1', note: 4, historique: [3, 4, 4, 5] },
        { nom: 'Compétence 2', note: 2, historique: [2, 2, 3, 2] },
        { nom: 'Compétence 3', note: 5, historique: [4, 4, 5, 5] },
        { nom: 'Compétence 4', note: 3, historique: [2, 3, 3, 3] }
      ],
      selectedCompetence: null,
      chart: null,
    };
  },
  methods: {
    selectCompetence(comp) {
      this.selectedCompetence = comp;
      this.$nextTick(() => {
        if (this.chart) {
          this.chart.destroy();
        }
        const ctx = document.getElementById('competenceChart');
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
            datasets: [
              {
                label: 'Évolution',
                data: comp.historique,
                borderWidth: 2,
                fill: false
              }
            ]
          }
        });
      });
    },
    downloadReport() {
      const chartElement = document.querySelector('.competence-detail');
      html2canvas(chartElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 120);
        pdf.save(`rapport-${this.selectedCompetence.nom}.pdf`);
      });
    }
  }
};
</script>

<style scoped>
.competence-item {
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ccc;
  margin: 6px 0;
  border-radius: 10px;
  background: #f7f7f7;
  transition: 0.3s;
}
.competence-item:hover {
  background-color: #aee1da;
  color: #fff;
}
.back-button,
.download-button {
  margin: 15px 0;
  padding: 10px 20px;
  border: none;
  background-color: #7fcfc3;
  color: white;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}
</style>
