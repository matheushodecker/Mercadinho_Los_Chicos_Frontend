<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
      <p class="text-muted-foreground">Visão geral do seu mercado</p>
    </div>

     Cards de estatísticas principais 
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Produtos</p>
            <p class="text-2xl font-bold text-foreground">{{ stats.totalProdutos }}</p>
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingBagIcon class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Vendas Hoje</p>
            <p class="text-2xl font-bold text-foreground">{{ stats.vendasHoje }}</p>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Receita Hoje</p>
            <p class="text-2xl font-bold text-foreground">R$ {{ formatarMoeda(stats.receitaHoje) }}</p>
          </div>
          <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Fornecedores</p>
            <p class="text-2xl font-bold text-foreground">{{ stats.totalFornecedores }}</p>
          </div>
          <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <BuildingStorefrontIcon class="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

     Produtos com baixo estoque 
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-card rounded-lg border p-6">
        <h2 class="text-lg font-semibold mb-4">Produtos com Baixo Estoque</h2>
        <div class="space-y-3">
          <div v-for="produto in produtosBaixoEstoque" :key="produto.id" class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div>
              <p class="font-medium text-foreground">{{ produto.nome }}</p>
              <p class="text-sm text-muted-foreground">{{ produto.categoria }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-yellow-600">{{ produto.estoque }} unidades</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <h2 class="text-lg font-semibold mb-4">Últimas Vendas</h2>
        <div class="space-y-3">
          <div v-for="venda in ultimasVendas" :key="venda.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-foreground">Venda #{{ venda.id }}</p>
              <p class="text-sm text-muted-foreground">{{ formatarData(venda.data) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600">R$ {{ formatarMoeda(venda.total) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'

const stats = ref({
  totalProdutos: 0,
  vendasHoje: 0,
  receitaHoje: 0,
  totalFornecedores: 0
})

const produtosBaixoEstoque = ref([])
const ultimasVendas = ref([])

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const carregarDashboard = async () => {
  try {
    stats.value = {
      totalProdutos: 150,
      vendasHoje: 25,
      receitaHoje: 2500.75,
      totalFornecedores: 12
    }

    produtosBaixoEstoque.value = [
      { id: 1, nome: 'Produto A', categoria: 'Categoria 1', estoque: 5 },
      { id: 2, nome: 'Produto B', categoria: 'Categoria 2', estoque: 3 },
      { id: 3, nome: 'Produto C', categoria: 'Categoria 1', estoque: 8 }
    ]

    ultimasVendas.value = [
      { id: 1001, data: new Date(), total: 125.50 },
      { id: 1002, data: new Date(), total: 89.25 },
      { id: 1003, data: new Date(), total: 234.75 }
    ]
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
}

onMounted(() => {
  carregarDashboard()
})
</script>
