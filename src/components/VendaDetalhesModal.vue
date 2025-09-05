<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Detalhes da Venda #{{ venda.id }}</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Informações da venda -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Data/Hora</label>
                <p class="text-sm text-gray-900">{{ formatarDataHora(venda.data_venda) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Cliente</label>
                <p class="text-sm text-gray-900">{{ venda.nome_cliente || 'Cliente não informado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Total</label>
                <p class="text-lg font-bold text-gray-900">R$ {{ venda.total }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Itens</label>
                <p class="text-sm text-gray-900">{{ venda.itens?.length || 0 }} item(s)</p>
              </div>
            </div>
          </div>

          <!-- Itens da venda -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Itens da Venda</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit.
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in venda.itens" :key="item.id">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {{ item.produto_nome }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {{ item.quantidade }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      R$ {{ item.preco_unitario }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {{ item.subtotal }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 mt-4 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VendaDetalhesModal',
  props: {
    venda: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup() {
    const formatarDataHora = (dataHora) => {
      return new Date(dataHora).toLocaleString('pt-BR')
    }

    return {
      formatarDataHora
    }
  }
}
</script>
