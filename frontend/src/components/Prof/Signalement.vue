<template>
  <div class="signalement-container">
    <Sidebar />
    <div class="content">
      <h1 class="title">Liste des Étudiants</h1>

      <ul class="etudiant-list">
        <li v-for="etudiant in etudiants" :key="etudiant.id" class="etudiant-item">
          <span>{{ etudiant.nom }}</span>
          <button @click="ouvrirFormulaire(etudiant)">Faire un signalement</button>
        </li>
      </ul>

      <div v-if="etudiantSelectionne" class="formulaire">
        <h2>Signalement pour {{ etudiantSelectionne.nom }}</h2>
        <input v-model="titre" placeholder="Titre du signalement" />
        <textarea v-model="description" placeholder="Description..." />
        <button @click="envoyerSignalement">Envoyer</button>
        <button @click="fermerFormulaire" class="cancel">Annuler</button>
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
      etudiants: [
        { id: 1, nom: 'Ali' },
        { id: 2, nom: 'Fatima' },
        { id: 3, nom: 'Youssef' },
        { id: 4, nom: 'Sara' }
      ],
      etudiantSelectionne: null,
      titre: '',
      description: ''
    }
  },
  methods: {
    ouvrirFormulaire(etudiant) {
      this.etudiantSelectionne = etudiant
      this.titre = ''
      this.description = ''
    },
    fermerFormulaire() {
      this.etudiantSelectionne = null
    },
    envoyerSignalement() {
      if (!this.titre || !this.description) return alert("Veuillez remplir tous les champs")

      console.log(`Signalement pour ${this.etudiantSelectionne.nom} :`, {
        titre: this.titre,
        description: this.description
      })

      alert('Signalement envoyé ✅')
      this.fermerFormulaire()
    }
  }
}
</script>

<style scoped>
.signalement-container {
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
  margin-bottom: 30px;
  background-color: #94d3cc;
  padding: 10px 20px;
  border-radius: 20px;
}

.etudiant-list {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
}

.etudiant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 12px 20px;
  margin: 10px 0;
  border-radius: 12px;
}

.etudiant-item button {
  background-color: #00c8b3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: bold;
}

.formulaire {
  margin-top: 40px;
  background-color: #f0f0f0;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.formulaire input,
.formulaire textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.formulaire button {
  background-color: #00c8b3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.formulaire button.cancel {
  background-color: #aaa;
}
</style>
