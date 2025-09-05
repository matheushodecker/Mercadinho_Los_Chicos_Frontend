<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ fabricante ? 'Editar Fabricante' : 'Novo Fabricante' }}
        </h3>
        
        <form @submit.prevent="saveFabricante" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              v-model="form.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do fabricante"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              v-model="form.cnpj"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              v-model="form.telefone"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <textarea
              v-model="form.endereco"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Endereço completo"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { fabricantesService } from '@/services/fabricantes'

export default {
  name: 'FabricanteModal',
  props: {
    fabricante: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const saving = ref(false)
    const form = reactive({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: ''
    })

    const resetForm = () => {
      form.nome = ''
      form.cnpj = ''
      form.telefone = ''
      form.email = ''
      form.endereco = ''
    }

    const loadFabricante = () => {
      if (props.fabricante) {
        form.nome = props.fabricante.nome || ''
        form.cnpj = props.fabricante.cnpj || ''
        form.telefone = props.fabricante.telefone || ''
        form.email = props.fabricante.email || ''
        form.endereco = props.fabricante.endereco || ''
      } else {
        resetForm()
      }
    }

    const saveFabricante = async () => {
      saving.value = true
      try {
        const data = { ...form }
        
        if (props.fabricante) {
          await fabricantesService.update(props.fabricante.id, data)
        } else {
          await fabricantesService.create(data)
        }
        
        emit('saved')
      } catch (error) {
        console.error('Erro ao salvar fabricante:', error)
        alert('Erro ao salvar fabricante')
      } finally {
        saving.value = false
      }
    }

    watch(() => props.fabricante, loadFabricante, { immediate: true })

    return {
      saving,
      form,
      saveFabricante
    }
  }
}
</script>
