<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Fornecedores</h1>
      <p class="text-muted-foreground">Gerencie os fornecedores do seu mercado</p>
    </div>

     Componente de listagem de fornecedores 
    <FornecedoresList />
  </div>
</template>

<script setup>
import FornecedoresList from '../components/FornecedoresList.vue'
</script>
