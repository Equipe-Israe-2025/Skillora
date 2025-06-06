<template>
  <div class="competence-view">
    <div class="form-container">
      <div class="form-group">
        <label for="competence">Compétence:</label>
        <input type="text" id="competence" v-model="title" class="form-input" required/>
      </div>
      
      <div class="form-group">
        <label for="description">Description:</label>
        <input 
          type="text" 
          id="description" 
          v-model="description" 
          class="form-input"
          required
        />
      </div>
      <div v-if="inputVide">les champs doit être remplis</div>
      <button @click="ajouterCompetence" class="add-button">
        <span v-if="!saveMode">Ajouter</span>
        <span v-if="saveMode">Sauvegarder</span>
      </button>
    </div>
    
    <div class="table-container">
      <table class="competence-table">
        <thead>
          <tr>
            <th>Compétence</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(competence,index) in competences" :key="index">
            <td>{{ competence.nom }}</td>
            <td>{{ competence.description }}</td>
            <td class="action-cell">
              <button @click="supprimerCompetence(competence.Id_C)" class="delete-button">
                supprimer
              </button>
              <button @click="modifierCompetence(competence.Id_C)" class="edit-button">
                modifier
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      title: '',
      description: '',
      indice: '',
      saveMode: false,
      inputVide: false,
      competences: []
    }
  },
  methods: {
    async getCompetences() {
      try {
        const res = await api.get('/competences')
        this.competences = res.data
      } catch (error) {
        console.error("Erreur lors de la récupération des compétences:", error)
      }
    },
    
    async ajouterCompetence() {
  if (!this.title || !this.description) {
    this.inputVide = true
    return
  }

  try {
    const newCompetence = {
      nom: this.title,
      description: this.description
    }
    if (!this.saveMode) {
      const response = await api.post('/competences', newCompetence)
      this.competences.push(response.data)
    } else {
       const response = await api.patch(`/competences/${this.indice}`, payload)
          console.log("Réponse modification:", response.data)
          const index = this.competences.findIndex(c => c.Id_C === this.indice)
          if (index !== -1) {
            this.competences.splice(index, 1, response.data)
          }
          this.saveMode = false

    }
    
    this.title = ''
    this.description = ''
    
  } catch (error) {
    console.error("Erreur:", error)
  }
},
    
    async supprimerCompetence(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
        try {
          await api.delete(`/competences/${id}`)
          await this.getCompetences()
        } catch (error) {
          console.error("Erreur lors de la suppression:", error)
        }
      }
    },
    
    async modifierCompetence(id) {
      try {
        console.log('hey')
        const res = await api.get(`/competences/${id}`)
        console.log('bey')
        const competence = res.data
        this.title = competence.nom
        this.description = competence.description
        this.indice = competence.Id_C
        this.saveMode = true
      } catch (error) {
        console.error("Erreur lors de la récupération de la compétence:", error)
      }
    }
  },
  mounted() {
    this.getCompetences()
  }
}
</script>

<style scoped>
.competence-view {
  padding: 20px;
}

.form-container {
  background-color: #a8e4e0;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: bold;
  color: #333;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  width: 100%;
}

.add-button {
  background-color: #2c7873;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  cursor: pointer;
  align-self: flex-end;
  width: 100px;
}

.add-button:hover {
  background-color: #1e5854;
}

.table-container {
  background-color: #a8e4e0;
  border-radius: 15px;
  overflow: hidden;
}

.competence-table {
  width: 100%;
  border-collapse: collapse;
}

.competence-table th,
.competence-table td {
  padding: 12px 15px;
  text-align: left;
  border-right: 1px solid #8cd3cd;
}

.competence-table th {
  background-color: #8cd3cd;
  color: #333;
  font-weight: bold;
}

.competence-table tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.1);
}

.action-cell {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.delete-button,
.edit-button {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button {
  background-color: #ff3b30;
  color: white;
}

.edit-button {
  background-color: #5eccc3;
  color: white;
}

.button-icon {
  width: 16px;
  height: 16px;
}

.empty-row {
  height: 100px;
  text-align: center;
}

.dots {
  font-size: 24px;
  line-height: 1.2;
  color: #555;
}
</style>