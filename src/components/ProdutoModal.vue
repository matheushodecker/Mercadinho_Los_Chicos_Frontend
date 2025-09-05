<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ produto ? 'Editar Produto' : 'Novo Produto' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="salvar" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                v-model="form.nome"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Código de Barras *</label>
              <input
                v-model="form.codigo_barras"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                v-model="form.descricao"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select
                v-model="form.categoria"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fornecedor *</label>
              <select
                v-model="form.fornecedor"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um fornecedor</option>
                <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
                  {{ fornecedor.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
              <select
                v-model="form.fabricante"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um fabricante</option>
                <option v-for="fabricante in fabricantes" :key="fabricante.id" :value="fabricante.id">
                  {{ fabricante.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preço de Custo *</label>
              <input
                v-model="form.preco_custo"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preço de Venda *</label>
              <input
                v-model="form.preco_venda"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque *</label>
              <input
                v-model="form.quantidade_estoque"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
              <input
                v-model="form.estoque_minimo"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="md:col-span-2">
              <label class="flex items-center">
                <input
                  v-model="form.ativo"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Produto ativo</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { produtosService } from '../services/produtos.js'
import { categoriasService } from '../services/categorias.js'
import { fornecedoresService } from '../services/fornecedores.js'
import { fabricantesService } from '../services/fabricantes.js'

export default {
  name: 'ProdutoModal',
  props: {
    produto: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const categorias = ref([])
    const fornecedores = ref([])
    const fabricantes = ref([])

    const form = reactive({
      nome: '',
      codigo_barras: '',
      descricao: '',
      categoria: '',
      fornecedor: '',
      fabricante: '',
      preco_custo: '',
      preco_venda: '',
      quantidade_estoque: '',
      estoque_minimo: 0,
      ativo: true
    })

    const carregarDados = async () => {
      try {
        const [categoriasRes, fornecedoresRes, fabricantesRes] = await Promise.all([
          categoriasService.listar(),
          fornecedoresService.listar(),
          fabricantesService.listar()
        ])
        categorias.value = categoriasRes.results || categoriasRes
        fornecedores.value = fornecedoresRes.results || fornecedoresRes
        fabricantes.value = fabricantesRes.results || fabricantesRes
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    const preencherForm = () => {
      if (props.produto) {
        Object.keys(form).forEach(key => {
          if (props.produto[key] !== undefined) {
            form[key] = props.produto[key]
          }
        })
      }
    }

    const salvar = async () => {
      loading.value = true
      try {
        if (props.produto) {
          await produtosService.atualizar(props.produto.id, form)
        } else {
          await produtosService.criar(form)
        }
        emit('saved')
      } catch (error) {
        console.error('Erro ao salvar produto:', error)
        alert('Erro ao salvar produto. Verifique os dados e tente novamente.')
      } finally {
        loading.value = false
      }
    }

    watch(() => props.produto, preencherForm, { immediate: true })

    onMounted(() => {
      carregarDados()
    })

    return {
      loading,
      categorias,
      fornecedores,
      fabricantes,
      form,
      salvar
    }
  }
}
</script>
