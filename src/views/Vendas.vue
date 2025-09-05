<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Vendas</h1>
      <p class="text-muted-foreground">Gerencie as vendas e histórico de transações</p>
    </div>

     Componente de listagem de vendas 
    <VendasList />
  </div>
</template>

<script setup>
import VendasList from '../components/VendasList.vue'
</script>
