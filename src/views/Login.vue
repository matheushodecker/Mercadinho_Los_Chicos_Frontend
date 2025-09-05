<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <section class="w-full max-w-md">
      <article class="bg-white py-8 px-6 shadow rounded-lg">
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Mercadinho Los Chicos
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Faça login seguro com biometria
          </p>
        </header>
        
        <section class="passage-auth-wrapper">
          <passage-login 
            :app-id="passageAppId"
            @auth-success="onAuthSuccess"
            @auth-error="onAuthError"
          ></passage-login>
        </section>

        <section v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center">
          {{ errorMessage }}
        </section>

        <section v-if="isLoading" class="mt-4 text-center">
          <span class="inline-flex items-center">
            <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
            <span class="text-sm text-gray-600">Verificando autenticação...</span>
          </span>
        </section>
      </article>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import '@passageidentity/passage-elements/passage-login'

const router = useRouter()
const authStore = useAuthStore()

const passageAppId = import.meta.env.VITE_PASSAGE_APP_ID || '6MkkqUmQs4zNMPbhfyIqSfRu'
const isLoading = ref(false)
const errorMessage = ref('')

const onAuthSuccess = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.login()
    await router.push('/dashboard')
  } catch (err) {
    errorMessage.value = 'Erro na autenticação. Tente novamente.'
    console.error('Passage auth error:', err)
  } finally {
    isLoading.value = false
  }
}

const onAuthError = (event) => {
  errorMessage.value = 'Falha na autenticação. Verifique sua biometria ou passkey.'
  console.error('Passage auth error:', event.detail)
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await router.push('/dashboard')
  }
})
</script>

<style scoped>
.passage-auth-wrapper {
  width: 100%;
}

:deep(passage-login) {
  --passage-color-primary: #2563eb;
  --passage-color-primary-hover: #1d4ed8;
  --passage-border-radius: 0.375rem;
  --passage-font-family: inherit;
}
</style>
