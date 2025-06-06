<template>
  <div class="app-container">
    <div class="sidebar">
      <div class="logo-container">
        <div class="logo">
          <img src="@/assets/logo_sidebar.png" >
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link 
          v-for="item in filteredNavItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
          exact-active-class="exact-active"
        >
          <div class="nav-icon">
            <img :src="require(`@/assets/${item.icon}`)">
          </div>
          <span class="nav-text">{{ item.text }}</span>
        </router-link>
      </nav>
    </div>
    
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { getNavItems } from '@/config/navItems'

const authStore = useAuthStore()

const filteredNavItems = computed(() => {
  const items = getNavItems(authStore.userId).filter(item => 
    item.roles.includes(authStore.userRole) &&
    (item.showInSidebar !== false)
  )
  return items
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #a8e4e0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;
}

.logo-container {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #a8e4e0;
}

.logo {
  width: 120px;
  height: 120px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #D9D9D9;
  color: #333;
  box-shadow: rgba(0, 0, 0, 0.372) 3px 3px;
  text-decoration: none;
  margin-bottom: 5px;
  transition: background-color 0.3s;
  position: relative;
}

.nav-item:hover {
  background-color: rgba(94, 204, 195, 0.3);
}

.nav-item.active {
  background-color: #5eccc3;
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 15px;
}

.nav-text {
  font-size: 16px;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  margin-left: 250px;
  min-height: 100vh;
}
</style>