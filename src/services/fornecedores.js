import api from "@/services/api"

export const fornecedoresService = {
  // Listar fornecedores
  async listar(params = {}) {
    const response = await api.get("/fornecedores/", { params })
    return response.data
  },

  // Buscar fornecedor por ID
  async buscarPorId(id) {
    const response = await api.get(`/fornecedores/${id}/`)
    return response.data
  },

  // Criar novo fornecedor
  async criar(fornecedor) {
    const response = await api.post("/fornecedores/", fornecedor)
    return response.data
  },

  // Atualizar fornecedor
  async atualizar(id, fornecedor) {
    const response = await api.put(`/fornecedores/${id}/`, fornecedor)
    return response.data
  },

  // Deletar fornecedor
  async deletar(id) {
    const response = await api.delete(`/fornecedores/${id}/`)
    return response.data
  },

  // Listar apenas fornecedores ativos
  async listarAtivos() {
    const response = await api.get("/fornecedores/?ativo=true")
    return response.data
  },
}
