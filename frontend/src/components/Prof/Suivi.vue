<template>
  <div class="suivi-container">
    <Sidebar />
    <div class="content">
      <h1 class="title">Suivi des Étudiants</h1>

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
        <h3>Étudiants de {{ selectedFiliere.nom }}</h3>
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
        <h3>Compétences de {{ selectedEtudiant.nom }}</h3>
        <ul class="selection-list">
          <li v-for="competence in competences" :key="competence.id"
              :class="{ active: selectedCompetence?.id === competence.id }"
              @click="selectCompetence(competence)">
            {{ competence.nom }}
          </li>
        </ul>
      </div>

      <!-- Détail compétence -->
      <div v-if="selectedCompetence" class="section">
        <h3>Note pour {{ selectedCompetence.nom }} : {{ selectedCompetence.note }}/5</h3>
        <canvas id="graphCompetence"></canvas>
        <button @click="telechargerRapport">Télécharger le rapport PDF</button>
      </div>

    </div>
  </div>
</template>

<script>
import DynamicSidebar from '@/components/DynamicSidebar.vue'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'

export default {
  components: { Sidebar },
  data() {
    return {
      filieres: [
        { id: 1, nom: 'Informatique', etudiants: [ { id: 101, nom: 'Ali' }, { id: 102, nom: 'Fatima' } ] },
        { id: 2, nom: 'Génie Civil', etudiants: [ { id: 201, nom: 'Sara' }, { id: 202, nom: 'Omar' } ] }
      ],
      competences: [
        { id: 1, nom: 'Travail en équipe', note: 4 },
        { id: 2, nom: 'Communication', note: 3.5 },
        { id: 3, nom: 'Autonomie', note: 4.5 }
      ],
      selectedFiliere: null,
      selectedEtudiant: null,
      selectedCompetence: null,
      chart: null
    }
  },
  methods: {
    selectFiliere(filiere) {
      this.selectedFiliere = filiere
      this.selectedEtudiant = null
      this.selectedCompetence = null
      this.chart?.destroy()
    },
    selectEtudiant(etudiant) {
      this.selectedEtudiant = etudiant
      this.selectedCompetence = null
      this.chart?.destroy()
    },
    selectCompetence(competence) {
      this.selectedCompetence = competence
      this.$nextTick(() => this.renderChart())
    },
    renderChart() {
      const ctx = document.getElementById('graphCompetence')
      if (!ctx) return
      this.chart?.destroy()
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Début', 'Milieu', 'Actuel'],
          datasets: [{
            label: 'Note',
            data: [2, 3, this.selectedCompetence.note],
            borderColor: '#00c8b3',
            fill: false,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { min: 0, max: 5 } }
        }
      })
    },
    telechargerRapport() {
      const doc = new jsPDF()
      const etudiant = this.selectedEtudiant
      const competence = this.selectedCompetence
      doc.setFontSize(16)
      doc.text('Rapport de Suivi de Compétence', 20, 20)
      doc.setFontSize(12)
      doc.text(`Nom de l'étudiant : ${etudiant.nom}`, 20, 40)
      doc.text(`Filière : ${this.selectedFiliere.nom}`, 20, 50)
      doc.text(`Compétence : ${competence.nom}`, 20, 60)
      doc.text(`Note actuelle : ${competence.note}/5`, 20, 70)
      doc.save(`rapport-${etudiant.nom}-${competence.nom}.pdf`)
    }
  }
}
</script>

<style scoped>
.suivi-container {
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

canvas {
  margin: 30px 0;
  max-width: 600px;
  width: 100%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 10px;
}

button {
  background-color: #00c8b3;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 16px;
}
</style>