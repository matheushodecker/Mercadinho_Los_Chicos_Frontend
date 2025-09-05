<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Vendas</h1>
      <button
        @click="showModal = true"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Nova Venda
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
          <input
            v-model="filters.data_inicial"
            @change="buscarVendas"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
          <input
            v-model="filters.data_final"
            @change="buscarVendas"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            v-model="filters.search"
            @input="buscarVendas"
            type="text"
            placeholder="Buscar por cliente..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Lista de vendas -->
    <div v-else class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Itens
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="venda in vendas" :key="venda.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ venda.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatarDataHora(venda.data_venda) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ venda.nome_cliente || 'Cliente não informado' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                R$ {{ venda.total }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ venda.itens?.length || 0 }} item(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="verDetalhes(venda)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Ver Detalhes
                </button>
                <button
                  @click="excluirVenda(venda.id)"
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

    <!-- Modal de nova venda -->
    <VendaModal
      v-if="showModal"
      @close="fecharModal"
      @saved="vendaSalva"
    />

    <!-- Modal de detalhes -->
    <VendaDetalhesModal
      v-if="showDetalhes"
      :venda="vendaSelecionada"
      @close="fecharDetalhes"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { vendasService } from '../services/vendas.js'
import VendaModal from './VendaModal.vue'
import VendaDetalhesModal from './VendaDetalhesModal.vue'

export default {
  name: 'VendasList',
  components: {
    VendaModal,
    VendaDetalhesModal
  },
  setup() {
    const vendas = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const showDetalhes = ref(false)
    const vendaSelecionada = ref(null)

    const filters = reactive({
      search: '',
      data_inicial: '',
      data_final: ''
    })

    const pagination = reactive({
      current_page: 1,
      page_size: 10,
      total: 0,
      previous: null,
      next: null
    })

    const buscarVendas = async () => {
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

        const response = await vendasService.listar(params)
        vendas.value = response.results
        Object.assign(pagination, {
          current_page: response.current_page,
          page_size: response.page_size,
          total: response.count,
          previous: response.previous,
          next: response.next
        })
      } catch (error) {
        console.error('Erro ao buscar vendas:', error)
      } finally {
        loading.value = false
      }
    }

    const verDetalhes = (venda) => {
      vendaSelecionada.value = venda
      showDetalhes.value = true
    }

    const excluirVenda = async (id) => {
      if (confirm('Tem certeza que deseja excluir esta venda?')) {
        try {
          await vendasService.excluir(id)
          buscarVendas()
        } catch (error) {
          console.error('Erro ao excluir venda:', error)
        }
      }
    }

    const fecharModal = () => {
      showModal.value = false
    }

    const fecharDetalhes = () => {
      showDetalhes.value = false
      vendaSelecionada.value = null
    }

    const vendaSalva = () => {
      fecharModal()
      buscarVendas()
    }

    const formatarDataHora = (dataHora) => {
      return new Date(dataHora).toLocaleString('pt-BR')
    }

    const paginaAnterior = () => {
      if (pagination.previous) {
        pagination.current_page--
        buscarVendas()
      }
    }

    const proximaPagina = () => {
      if (pagination.next) {
        pagination.current_page++
        buscarVendas()
      }
    }

    onMounted(() => {
      buscarVendas()
    })

    return {
      vendas,
      loading,
      showModal,
      showDetalhes,
      vendaSelecionada,
      filters,
      pagination,
      buscarVendas,
      verDetalhes,
      excluirVenda,
      fecharModal,
      fecharDetalhes,
      vendaSalva,
      formatarDataHora,
      paginaAnterior,
      proximaPagina
    }
  }
}
</script>
