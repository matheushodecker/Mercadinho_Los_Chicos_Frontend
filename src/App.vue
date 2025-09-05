<template>
  <div id="app">
    <Header v-if="isAuthenticated" @logout="handleLogout" :user="user" />
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useAuthStore from '@/stores/auth'
import Header from '@/components/Header.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Define computed properties and reactive state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const currentRoute = computed(() => route.name?.toLowerCase() || 'dashboard')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (authStore.token) {
    authStore.fetchProfile()
  }
})
</script>
