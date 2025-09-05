<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm font-medium">P</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Produtos
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalProdutos }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm font-medium">V</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Vendas Hoje
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.vendasHoje }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm font-medium">E</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Estoque Baixo
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.estoqueBaixo }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm font-medium">R$</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Receita Hoje
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  R$ {{ stats.receitaHoje }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Produtos com Estoque Baixo
          </h3>
          <div class="space-y-3">
            <div v-for="produto in produtosBaixoEstoque" :key="produto.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ produto.nome }}</p>
                <p class="text-sm text-gray-500">Código: {{ produto.codigo_barras }}</p>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {{ produto.quantidade_estoque }} unidades
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Últimas Vendas
          </h3>
          <div class="space-y-3">
            <div v-for="venda in ultimasVendas" :key="venda.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <p class="text-sm font-medium text-gray-900">Venda #{{ venda.id }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(venda.data_venda) }}</p>
              </div>
              <span class="text-sm font-medium text-green-600">
                R$ {{ venda.total.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { produtosService } from '@/services/produtos'
import { vendasService } from '@/services/vendas'

const stats = ref({
  totalProdutos: 0,
  vendasHoje: 0,
  estoqueBaixo: 0,
  receitaHoje: 0
})

const produtosBaixoEstoque = ref([])
const ultimasVendas = ref([])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const loadDashboardData = async () => {
  try {
    // Carregar estatísticas
    const [produtosResponse, vendasResponse] = await Promise.all([
      produtosService.listar(),
      vendasService.listar({ limit: 10 })
    ])

    stats.value.totalProdutos = produtosResponse.data.count || 0
    
    // Produtos com estoque baixo (menos de 10 unidades)
    const produtosBaixo = produtosResponse.data.results?.filter(p => p.quantidade_estoque < 10) || []
    produtosBaixoEstoque.value = produtosBaixo.slice(0, 5)
    stats.value.estoqueBaixo = produtosBaixo.length

    // Últimas vendas
    ultimasVendas.value = vendasResponse.data.results?.slice(0, 5) || []
    
    // Vendas de hoje
    const hoje = new Date().toISOString().split('T')[0]
    const vendasHoje = ultimasVendas.value.filter(v => 
      v.data_venda.startsWith(hoje)
    )
    stats.value.vendasHoje = vendasHoje.length
    stats.value.receitaHoje = vendasHoje.reduce((total, venda) => total + venda.total, 0).toFixed(2)

  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
