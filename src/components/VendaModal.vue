<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Nova Venda</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Informações da venda -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
              <input
                v-model="form.nome_cliente"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do cliente (opcional)"
              />
            </div>

            <!-- Busca de produto -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adicionar Produto</label>
              <div class="flex gap-2">
                <input
                  v-model="buscaProduto"
                  @keyup.enter="buscarProduto"
                  type="text"
                  placeholder="Digite o código de barras ou nome do produto"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  @click="buscarProduto"
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>

            <!-- Produto encontrado -->
            <div v-if="produtoEncontrado" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-green-900">{{ produtoEncontrado.nome }}</h4>
                  <p class="text-sm text-green-700">Código: {{ produtoEncontrado.codigo_barras }}</p>
                  <p class="text-sm text-green-700">Preço: R$ {{ produtoEncontrado.preco_venda }}</p>
                  <p class="text-sm text-green-700">Estoque: {{ produtoEncontrado.quantidade_estoque }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="quantidadeProduto"
                    type="number"
                    min="1"
                    :max="produtoEncontrado.quantidade_estoque"
                    class="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <button
                    @click="adicionarProduto"
                    class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            <!-- Mensagem de produto não encontrado -->
            <div v-if="produtoNaoEncontrado" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-700">Produto não encontrado ou inativo.</p>
            </div>
          </div>

          <!-- Lista de itens da venda -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Itens da Venda</h4>
            
            <div v-if="form.itens.length === 0" class="text-center py-8 text-gray-500">
              Nenhum item adicionado
            </div>

            <div v-else class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="(item, index) in form.itens"
                :key="index"
                class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900">{{ item.produto_nome }}</h5>
                  <p class="text-sm text-gray-600">
                    {{ item.quantidade }}x R$ {{ item.preco_unitario }} = R$ {{ item.subtotal }}
                  </p>
                </div>
                <button
                  @click="removerItem(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>R$ {{ calcularTotal() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="finalizarVenda"
            :disabled="loading || form.itens.length === 0"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ loading ? 'Finalizando...' : 'Finalizar Venda' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { vendasService } from '../services/vendas.js'
import { produtosService } from '../services/produtos.js'

export default {
  name: 'VendaModal',
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const buscaProduto = ref('')
    const produtoEncontrado = ref(null)
    const produtoNaoEncontrado = ref(false)
    const quantidadeProduto = ref(1)

    const form = reactive({
      nome_cliente: '',
      itens: []
    })

    const buscarProduto = async () => {
      if (!buscaProduto.value.trim()) return

      try {
        produtoNaoEncontrado.value = false
        produtoEncontrado.value = null

        // Busca por código de barras ou nome
        const response = await produtosService.listar({
          search: buscaProduto.value.trim(),
          ativo: 'true'
        })

        if (response.results && response.results.length > 0) {
          produtoEncontrado.value = response.results[0]
          quantidadeProduto.value = 1
        } else {
          produtoNaoEncontrado.value = true
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error)
        produtoNaoEncontrado.value = true
      }
    }

    const adicionarProduto = () => {
      if (!produtoEncontrado.value || quantidadeProduto.value <= 0) return

      if (quantidadeProduto.value > produtoEncontrado.value.quantidade_estoque) {
        alert('Quantidade solicitada maior que o estoque disponível')
        return
      }

      // Verifica se o produto já está na lista
      const itemExistente = form.itens.find(item => item.produto === produtoEncontrado.value.id)
      
      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidadeProduto.value
        if (novaQuantidade > produtoEncontrado.value.quantidade_estoque) {
          alert('Quantidade total maior que o estoque disponível')
          return
        }
        itemExistente.quantidade = novaQuantidade
        itemExistente.subtotal = (itemExistente.quantidade * itemExistente.preco_unitario).toFixed(2)
      } else {
        const item = {
          produto: produtoEncontrado.value.id,
          produto_nome: produtoEncontrado.value.nome,
          quantidade: quantidadeProduto.value,
          preco_unitario: produtoEncontrado.value.preco_venda,
          subtotal: (quantidadeProduto.value * produtoEncontrado.value.preco_venda).toFixed(2)
        }
        form.itens.push(item)
      }

      // Limpa a busca
      buscaProduto.value = ''
      produtoEncontrado.value = null
      produtoNaoEncontrado.value = false
      quantidadeProduto.value = 1
    }

    const removerItem = (index) => {
      form.itens.splice(index, 1)
    }

    const calcularTotal = () => {
      return form.itens.reduce((total, item) => total + parseFloat(item.subtotal), 0).toFixed(2)
    }

    const finalizarVenda = async () => {
      if (form.itens.length === 0) {
        alert('Adicione pelo menos um item à venda')
        return
      }

      loading.value = true
      try {
        const vendaData = {
          nome_cliente: form.nome_cliente || null,
          total: calcularTotal(),
          itens: form.itens.map(item => ({
            produto: item.produto,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
            subtotal: item.subtotal
          }))
        }

        await vendasService.criar(vendaData)
        emit('saved')
      } catch (error) {
        console.error('Erro ao finalizar venda:', error)
        alert('Erro ao finalizar venda. Tente novamente.')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      buscaProduto,
      produtoEncontrado,
      produtoNaoEncontrado,
      quantidadeProduto,
      form,
      buscarProduto,
      adicionarProduto,
      removerItem,
      calcularTotal,
      finalizarVenda
    }
  }
}
</script>
