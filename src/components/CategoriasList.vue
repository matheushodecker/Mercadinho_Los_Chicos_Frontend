<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Categorias</h2>
      <button
        @click="openModal()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Nova Categoria
      </button>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <div class="flex gap-4">
          <input
            v-model="searchTerm"
            @input="searchCategorias"
            type="text"
            placeholder="Buscar categorias..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="categoria in categorias" :key="categoria.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ categoria.nome }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ categoria.descricao || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ categoria.produtos_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openModal(categoria)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteCategoria(categoria.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.total > pagination.page_size" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (pagination.current_page - 1) * pagination.page_size + 1 }} a 
            {{ Math.min(pagination.current_page * pagination.page_size, pagination.total) }} de 
            {{ pagination.total }} resultados
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="!pagination.previous"
              class="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="!pagination.next"
              class="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <CategoriaModal
      v-if="showModal"
      :categoria="selectedCategoria"
      @close="closeModal"
      @saved="onCategoriaSaved"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { categoriasService } from '../services/categorias.js'
import CategoriaModal from './CategoriaModal.vue'

export default {
  name: 'CategoriasList',
  components: {
    CategoriaModal
  },
  setup() {
    const categorias = ref([])
    const searchTerm = ref('')
    const showModal = ref(false)
    const selectedCategoria = ref(null)
    const pagination = ref({
      current_page: 1,
      page_size: 10,
      total: 0,
      next: null,
      previous: null
    })

    const loadCategorias = async (page = 1, search = '') => {
      try {
        const response = await categoriasService.list({ page, search })
        categorias.value = response.results
        pagination.value = {
          current_page: page,
          page_size: response.page_size,
          total: response.count,
          next: response.next,
          previous: response.previous
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    }

    const searchCategorias = () => {
      loadCategorias(1, searchTerm.value)
    }

    const changePage = (page) => {
      loadCategorias(page, searchTerm.value)
    }

    const openModal = (categoria = null) => {
      selectedCategoria.value = categoria
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedCategoria.value = null
    }

    const onCategoriaSaved = () => {
      closeModal()
      loadCategorias(pagination.value.current_page, searchTerm.value)
    }

    const deleteCategoria = async (id) => {
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
          await categoriasService.delete(id)
          loadCategorias(pagination.value.current_page, searchTerm.value)
        } catch (error) {
          console.error('Erro ao excluir categoria:', error)
          alert('Erro ao excluir categoria')
        }
      }
    }

    onMounted(() => {
      loadCategorias()
    })

    return {
      categorias,
      searchTerm,
      showModal,
      selectedCategoria,
      pagination,
      loadCategorias,
      searchCategorias,
      changePage,
      openModal,
      closeModal,
      onCategoriaSaved,
      deleteCategoria
    }
  }
}
</script>
