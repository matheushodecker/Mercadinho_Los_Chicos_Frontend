<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
      </div>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Página não encontrada
        </h2>
        <p class="text-gray-600">
          A página que você está procurando não existe.
        </p>
      </div>
      <div>
        <router-link
          to="/dashboard"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Home class="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Home } from 'lucide-vue-next'
</script>
