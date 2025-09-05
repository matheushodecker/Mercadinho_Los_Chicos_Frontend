<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Produtos</h1>
      <p class="text-muted-foreground">Gerencie o catálogo de produtos do seu mercado</p>
    </div>

     Componente de listagem de produtos 
    <ProdutosList />
  </div>
</template>

<script setup>
import ProdutosList from '../components/ProdutosList.vue'
</script>
