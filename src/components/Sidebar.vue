<template>
  <div class="bg-white shadow-sm border-r border-gray-200 h-full">
    <div class="p-4">
      <h1 class="text-xl font-bold text-gray-900">Mercadinho</h1>
      <p class="text-sm text-gray-500">Los Chicos</p>
    </div>
    
    <nav class="mt-4">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-r-2 border-transparent hover:border-blue-500"
        :class="{ 'bg-blue-50 text-blue-700 border-blue-500': $route.path === item.path }"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.name }}
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { 
  Home, 
  ShoppingBag, 
  DollarSign, 
  Tag, 
  Truck, 
  Building,
  BarChart3
} from 'lucide-vue-next'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Produtos', path: '/produtos', icon: ShoppingBag },
  { name: 'Vendas', path: '/vendas', icon: DollarSign },
  { name: 'Categorias', path: '/categorias', icon: Tag },
  { name: 'Fornecedores', path: '/fornecedores', icon: Truck },
  { name: 'Fabricantes', path: '/fabricantes', icon: Building },
  { name: 'Relatórios', path: '/relatorios', icon: BarChart3 }
]
</script>
