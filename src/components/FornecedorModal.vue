<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">
          {{ fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveFornecedor" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              v-model="form.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
            <input
              v-model="form.cnpj"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              v-model="form.telefone"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <textarea
              v-model="form.endereco"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { fornecedoresService } from '../services/fornecedores.js'

export default {
  name: 'FornecedorModal',
  props: {
    fornecedor: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const form = reactive({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: ''
    })

    watch(() => props.fornecedor, (newFornecedor) => {
      if (newFornecedor) {
        Object.assign(form, {
          nome: newFornecedor.nome,
          cnpj: newFornecedor.cnpj || '',
          telefone: newFornecedor.telefone || '',
          email: newFornecedor.email || '',
          endereco: newFornecedor.endereco || ''
        })
      } else {
        Object.assign(form, {
          nome: '',
          cnpj: '',
          telefone: '',
          email: '',
          endereco: ''
        })
      }
    }, { immediate: true })

    const saveFornecedor = async () => {
      loading.value = true
      try {
        if (props.fornecedor) {
          await fornecedoresService.update(props.fornecedor.id, form)
        } else {
          await fornecedoresService.create(form)
        }
        emit('saved')
      } catch (error) {
        console.error('Erro ao salvar fornecedor:', error)
        alert('Erro ao salvar fornecedor')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      form,
      saveFornecedor
    }
  }
}
</script>
