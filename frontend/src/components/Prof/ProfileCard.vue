<template>
  <div class="card">
    <h2>Informations personnelles</h2>
    <div class="info">
      <div class="labels">
        <p>Nom et Prénom :</p>
        <p>CIN :</p>
        <p>N° de téléphone :</p>
        <p>Adresse :</p>
        <p>Date de naissance :</p>
      </div>
      <div class="values">
        <p>Username</p>
        <p>G400887</p>
        <p>06**75**74</p>
        <p>Boukhalef, Tanger</p>
        <p>12/09/1970</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #f5f5f5; /* ✅ Fond gris clair */
  padding: 30px 50px;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.info {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

.labels p {
  font-weight: bold;
  margin: 8px 0;
}

.values p {
  margin: 8px 0;
  text-align: right;
}
</style>
