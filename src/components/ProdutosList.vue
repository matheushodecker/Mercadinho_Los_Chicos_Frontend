<template>
  <div class="space-y-6">
    <!-- Header com busca e filtros -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Produtos</h1>
      <button
        @click="showModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Novo Produto
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            v-model="filters.search"
            @input="buscarProdutos"
            type="text"
            placeholder="Buscar produtos..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            v-model="filters.categoria"
            @change="buscarProdutos"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.nome }}
            </option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.fornecedor"
            @change="buscarProdutos"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os fornecedores</option>
            <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
              {{ fornecedor.nome }}
            </option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.ativo"
            @change="buscarProdutos"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Lista de produtos -->
    <div v-else class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="produto in produtos" :key="produto.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ produto.nome }}</div>
                    <div class="text-sm text-gray-500">{{ produto.descricao }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ produto.codigo_barras }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ produto.categoria_nome }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R$ {{ produto.preco_venda }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="produto.quantidade_estoque <= produto.estoque_minimo ? 'text-red-600' : 'text-gray-900'" class="text-sm font-medium">
                  {{ produto.quantidade_estoque }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="produto.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ produto.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarProduto(produto)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="excluirProduto(produto.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="pagination.total > pagination.page_size" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="paginaAnterior"
              :disabled="!pagination.previous"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="proximaPagina"
              :disabled="!pagination.next"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando {{ (pagination.current_page - 1) * pagination.page_size + 1 }} a 
                {{ Math.min(pagination.current_page * pagination.page_size, pagination.total) }} de 
                {{ pagination.total }} resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="paginaAnterior"
                  :disabled="!pagination.previous"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  @click="proximaPagina"
                  :disabled="!pagination.next"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Próxima
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de produto -->
    <ProdutoModal
      v-if="showModal"
      :produto="produtoSelecionado"
      @close="fecharModal"
      @saved="produtoSalvo"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { produtosService } from '../services/produtos.js'
import { categoriasService } from '../services/categorias.js'
import { fornecedoresService } from '../services/fornecedores.js'
import ProdutoModal from './ProdutoModal.vue'

export default {
  name: 'ProdutosList',
  components: {
    ProdutoModal
  },
  setup() {
    const produtos = ref([])
    const categorias = ref([])
    const fornecedores = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const produtoSelecionado = ref(null)

    const filters = reactive({
      search: '',
      categoria: '',
      fornecedor: '',
      ativo: ''
    })

    const pagination = reactive({
      current_page: 1,
      page_size: 10,
      total: 0,
      previous: null,
      next: null
    })

    const buscarProdutos = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.current_page,
          ...filters
        }
        
        // Remove filtros vazios
        Object.keys(params).forEach(key => {
          if (params[key] === '') delete params[key]
        })

        const response = await produtosService.listar(params)
        produtos.value = response.results
        Object.assign(pagination, {
          current_page: response.current_page,
          page_size: response.page_size,
          total: response.count,
          previous: response.previous,
          next: response.next
        })
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      } finally {
        loading.value = false
      }
    }

    const carregarDados = async () => {
      try {
        const [categoriasRes, fornecedoresRes] = await Promise.all([
          categoriasService.listar(),
          fornecedoresService.listar()
        ])
        categorias.value = categoriasRes.results || categoriasRes
        fornecedores.value = fornecedoresRes.results || fornecedoresRes
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    const editarProduto = (produto) => {
      produtoSelecionado.value = produto
      showModal.value = true
    }

    const excluirProduto = async (id) => {
      if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
          await produtosService.excluir(id)
          buscarProdutos()
        } catch (error) {
          console.error('Erro ao excluir produto:', error)
        }
      }
    }

    const fecharModal = () => {
      showModal.value = false
      produtoSelecionado.value = null
    }

    const produtoSalvo = () => {
      fecharModal()
      buscarProdutos()
    }

    const paginaAnterior = () => {
      if (pagination.previous) {
        pagination.current_page--
        buscarProdutos()
      }
    }

    const proximaPagina = () => {
      if (pagination.next) {
        pagination.current_page++
        buscarProdutos()
      }
    }

    onMounted(() => {
      carregarDados()
      buscarProdutos()
    })

    return {
      produtos,
      categorias,
      fornecedores,
      loading,
      showModal,
      produtoSelecionado,
      filters,
      pagination,
      buscarProdutos,
      editarProduto,
      excluirProduto,
      fecharModal,
      produtoSalvo,
      paginaAnterior,
      proximaPagina
    }
  }
}
</script>
