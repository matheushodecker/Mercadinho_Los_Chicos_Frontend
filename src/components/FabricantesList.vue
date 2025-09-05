<template>
  <div class="space-y-6">
     Header 
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Fabricantes</h2>
      <button
        @click="openModal()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Fabricante
      </button>
    </div>

     Filtros 
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            @input="debouncedSearch"
            type="text"
            placeholder="Buscar fabricantes..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="loadFabricantes"
          class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
        >
          Atualizar
        </button>
      </div>
    </div>

     Loading 
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

     Lista de Fabricantes 
    <div v-else class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CNPJ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="fabricante in fabricantes" :key="fabricante.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ fabricante.nome }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ fabricante.cnpj || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ fabricante.telefone || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ fabricante.email || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openModal(fabricante)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteFabricante(fabricante)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

       Paginação 
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando {{ (currentPage - 1) * 10 + 1 }} a {{ Math.min(currentPage * 10, totalItems) }} de {{ totalItems }} resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

     Modal 
    <FabricanteModal
      v-if="showModal"
      :fabricante="selectedFabricante"
      @close="closeModal"
      @saved="onFabricanteSaved"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { fabricantesService } from '@/services/fabricantes'
import FabricanteModal from './FabricanteModal.vue'

export default {
  name: 'FabricantesList',
  components: {
    FabricanteModal
  },
  setup() {
    const fabricantes = ref([])
    const loading = ref(false)
    const searchTerm = ref('')
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalItems = ref(0)
    const showModal = ref(false)
    const selectedFabricante = ref(null)

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const loadFabricantes = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          search: searchTerm.value
        }
        const response = await fabricantesService.list(params)
        fabricantes.value = response.results
        totalPages.value = Math.ceil(response.count / 10)
        totalItems.value = response.count
      } catch (error) {
        console.error('Erro ao carregar fabricantes:', error)
      } finally {
        loading.value = false
      }
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        loadFabricantes()
      }
    }

    const debouncedSearch = (() => {
      let timeout
      return () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          currentPage.value = 1
          loadFabricantes()
        }, 500)
      }
    })()

    const openModal = (fabricante = null) => {
      selectedFabricante.value = fabricante
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedFabricante.value = null
    }

    const onFabricanteSaved = () => {
      closeModal()
      loadFabricantes()
    }

    const deleteFabricante = async (fabricante) => {
      if (confirm(`Tem certeza que deseja excluir o fabricante "${fabricante.nome}"?`)) {
        try {
          await fabricantesService.delete(fabricante.id)
          loadFabricantes()
        } catch (error) {
          console.error('Erro ao excluir fabricante:', error)
          alert('Erro ao excluir fabricante')
        }
      }
    }

    onMounted(() => {
      loadFabricantes()
    })

    return {
      fabricantes,
      loading,
      searchTerm,
      currentPage,
      totalPages,
      totalItems,
      visiblePages,
      showModal,
      selectedFabricante,
      loadFabricantes,
      changePage,
      debouncedSearch,
      openModal,
      closeModal,
      onFabricanteSaved,
      deleteFabricante
    }
  }
}
</script>
