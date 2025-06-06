<template>
  <div class="profile-container">
    <Sidebar />
    <div class="content">
      <h1 class="title">Profile Professeur</h1>
      <ProfileCard />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/DynamicSidebar.vue'
import ProfileCard from './ProfileCard.vue'

export default {
  components: { Sidebar, ProfileCard }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: 100vh;
  background-color: white; /* ✅ Retire le fond gris */
}

.sidebar {
  width: 180px;
  background-color: #91d2c7;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ Centre horizontalement */
  background-color: white; /* ✅ Fond blanc propre */
}

.title {
  background-color: #94d3cc;
  padding: 12px 30px;
  border-radius: 20px;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
}
</style>
