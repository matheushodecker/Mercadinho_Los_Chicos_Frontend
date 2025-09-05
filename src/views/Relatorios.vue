<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Relatórios</h1>
      <p class="text-muted-foreground">Visualize estatísticas e relatórios do seu mercado</p>
    </div>

     Filtros de Data 
    <div class="bg-card rounded-lg border p-4 mb-6">
      <h2 class="text-lg font-semibold mb-4">Filtros</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Data Inicial</label>
          <input
            v-model="filtros.dataInicial"
            type="date"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Data Final</label>
          <input
            v-model="filtros.dataFinal"
            type="date"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="carregarRelatorios"
            class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>

     Cards de Estatísticas 
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total de Vendas</p>
            <p class="text-2xl font-bold text-foreground">{{ estatisticas.totalVendas }}</p>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Receita Total</p>
            <p class="text-2xl font-bold text-foreground">R$ {{ formatarMoeda(estatisticas.receitaTotal) }}</p>
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Produtos Vendidos</p>
            <p class="text-2xl font-bold text-foreground">{{ estatisticas.produtosVendidos }}</p>
          </div>
          <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ShoppingBag class="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Ticket Médio</p>
            <p class="text-2xl font-bold text-foreground">R$ {{ formatarMoeda(estatisticas.ticketMedio) }}</p>
          </div>
          <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calculator class="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

     Produtos Mais Vendidos 
    <div class="bg-card rounded-lg border p-6">
      <h2 class="text-lg font-semibold mb-4">Produtos Mais Vendidos</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Produto</th>
              <th class="text-left py-2">Quantidade</th>
              <th class="text-left py-2">Receita</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in produtosMaisVendidos" :key="produto.id" class="border-b">
              <td class="py-2">{{ produto.nome }}</td>
              <td class="py-2">{{ produto.quantidade }}</td>
              <td class="py-2">R$ {{ formatarMoeda(produto.receita) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  DollarSign,
  BarChart3,
  ShoppingBag,
  Calculator
} from 'lucide-vue-next'
import { vendasService } from '@/services/vendas'

const filtros = ref({
  dataInicial: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  dataFinal: new Date().toISOString().split('T')[0]
})

const estatisticas = ref({
  totalVendas: 0,
  receitaTotal: 0,
  produtosVendidos: 0,
  ticketMedio: 0
})

const produtosMaisVendidos = ref([])

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

const carregarRelatorios = async () => {
  try {
    // Simular dados de relatório (implementar com endpoints reais da API)
    estatisticas.value = {
      totalVendas: 150,
      receitaTotal: 15000.50,
      produtosVendidos: 450,
      ticketMedio: 100.00
    }

    produtosMaisVendidos.value = [
      { id: 1, nome: 'Produto A', quantidade: 50, receita: 2500.00 },
      { id: 2, nome: 'Produto B', quantidade: 35, receita: 1750.00 },
      { id: 3, nome: 'Produto C', quantidade: 28, receita: 1400.00 }
    ]
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
  }
}

onMounted(() => {
  carregarRelatorios()
})
</script>
