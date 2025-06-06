<template>
  <div class="groupe-container">
    <Sidebar />
    <div class="content">
      <h1 class="title">Ajouter un Groupe</h1>

      <!-- Partie Filières -->
      <div class="filieres">
        <h3>Choisir une filière :</h3>
        <ul>
          <li 
            v-for="filiere in filieres" 
            :key="filiere.id"
            :class="{ active: selectedFiliere?.id === filiere.id }"
            @click="selectFiliere(filiere)"
          >
            {{ filiere.nom }}
          </li>
        </ul>
      </div>

      <!-- Partie Étudiants -->
      <div v-if="selectedFiliere" class="etudiants-section">
        <h3>Étudiants de {{ selectedFiliere.nom }}</h3>
        <ul>
          <li v-for="etudiant in selectedFiliere.etudiants" :key="etudiant.id">
            <input type="checkbox" :value="etudiant" v-model="selectedEtudiants" />
            {{ etudiant.nom }}
          </li>
        </ul>

        <div class="form-group">
          <input v-model="nomGroupe" placeholder="Nom du groupe" />
          <button @click="creerOuModifierGroupe">{{ isEditing ? 'Modifier le groupe' : 'Créer le groupe' }}</button>
        </div>
      </div>

      <!-- Tableau des groupes -->
      <div v-if="groupes.length > 0" class="table-groupes">
        <h3>Groupes créés</h3>
        <table>
          <thead>
            <tr>
              <th>Nom du groupe</th>
              <th>Filière</th>
              <th>Étudiants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(groupe, index) in groupes" :key="groupe.nom">
              <td>{{ groupe.nom }}</td>
              <td>{{ groupe.filiere }}</td>
              <td>{{ groupe.etudiants.map(e => e.nom).join(', ') }}</td>
              <td>
                <button @click="modifierGroupe(groupe, index)">Modifier</button>
                <button @click="supprimerGroupe(groupe)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
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
          { id: 102, nom: 'Fatima' },
          { id: 103, nom: 'Youssef' }
        ]},
        { id: 2, nom: 'Génie Civil', etudiants: [
          { id: 201, nom: 'Omar' },
          { id: 202, nom: 'Sara' }
        ]},
        { id: 3, nom: 'Électromécanique', etudiants: [
          { id: 301, nom: 'Imane' },
          { id: 302, nom: 'Hassan' }
        ]}
      ],
      selectedFiliere: null,
      selectedEtudiants: [],
      nomGroupe: '',
      groupes: [],
      isEditing: false,
      editIndex: null
    }
  },
  methods: {
    selectFiliere(filiere) {
      this.selectedFiliere = filiere
      this.selectedEtudiants = []
    },
    creerOuModifierGroupe() {
      if (!this.nomGroupe || this.selectedEtudiants.length === 0) return

      const nouveauGroupe = {
        nom: this.nomGroupe,
        filiere: this.selectedFiliere.nom,
        etudiants: [...this.selectedEtudiants]
      }

      if (this.isEditing) {
        this.groupes.splice(this.editIndex, 1, nouveauGroupe)
        this.isEditing = false
        this.editIndex = null
      } else {
        this.groupes.push(nouveauGroupe)
      }

      this.nomGroupe = ''
      this.selectedEtudiants = []
      this.selectedFiliere = null
    },
    supprimerGroupe(groupe) {
      this.groupes = this.groupes.filter(g => g !== groupe)
    },
    modifierGroupe(groupe, index) {
      const filiereCorrespondante = this.filieres.find(f => f.nom === groupe.filiere)
      if (!filiereCorrespondante) return

      this.selectedFiliere = filiereCorrespondante
      this.nomGroupe = groupe.nom
      this.selectedEtudiants = [...groupe.etudiants]
      this.isEditing = true
      this.editIndex = index
    }
  }
}
</script>

<style scoped>
.groupe-container {
  display: flex;
  min-height: 100vh;
  background-color: white;
}

.content {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

.title {
  background-color: #94d3cc;
  padding: 12px 30px;
  border-radius: 20px;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
}

.filieres ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.filieres ul li {
  padding: 10px 15px;
  border: 1px solid #ccc;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  width: 300px;
}

.filieres ul li.active {
  background-color: #b2ebe6;
  font-weight: bold;
}

.etudiants-section {
  margin-top: 30px;
  width: 100%;
  max-width: 800px;
}

.form-group {
  margin-top: 10px;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.form-group button {
  padding: 8px 12px;
  background-color: #00c8b3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.table-groupes {
  margin-top: 40px;
  width: 100%;
  max-width: 900px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}

th {
  background-color: #f0f0f0;
}
</style>
