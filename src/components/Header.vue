<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">
            {{ getPageTitle(currentView) }}
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ getUserInitials(user?.username || 'U') }}
              </span>
            </div>
            <span class="text-sm font-medium text-gray-700">
              {{ user?.username || 'Usuário' }}
            </span>
          </div>
          
          <button
            @click="$emit('logout')"
            class="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: null
  },
  currentView: {
    type: String,
    default: 'dashboard'
  }
})

defineEmits(['logout'])

const getPageTitle = (view) => {
  const titles = {
    dashboard: 'Dashboard',
    produtos: 'Produtos',
    vendas: 'Vendas',
    categorias: 'Categorias',
    fornecedores: 'Fornecedores',
    fabricantes: 'Fabricantes',
    relatorios: 'Relatórios'
  }
  return titles[view] || 'Dashboard'
}

const getUserInitials = (username) => {
  return username.charAt(0).toUpperCase()
}
</script>
