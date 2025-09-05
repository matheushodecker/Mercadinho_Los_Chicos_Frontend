<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Categorias</h1>
      <p class="text-muted-foreground">Organize os produtos por categorias</p>
    </div>

     Componente de listagem de categorias 
    <CategoriasList />
  </div>
</template>

<script setup>
import CategoriasList from '../components/CategoriasList.vue'
</script>
