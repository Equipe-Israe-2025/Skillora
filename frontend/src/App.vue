<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

onMounted(() => {
  console.log('App mounted') // Verify mounting
  const authStore = useAuthStore()
  authStore.checkAuth()
})
</script>