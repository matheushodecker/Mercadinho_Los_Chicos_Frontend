import api from "@/services/api"

export const vendasService = {
  // Listar vendas com filtros
  async listar(params = {}) {
    const response = await api.get("/vendas/", { params })
    return response.data
  },

  // Buscar venda por ID
  async buscarPorId(id) {
    const response = await api.get(`/vendas/${id}/`)
    return response.data
  },

  // Criar nova venda
  async criar(venda) {
    const response = await api.post("/vendas/", venda)
    return response.data
  },

  // Atualizar venda
  async atualizar(id, venda) {
    const response = await api.put(`/vendas/${id}/`, venda)
    return response.data
  },

  // Cancelar venda
  async cancelar(id) {
    const response = await api.patch(`/vendas/${id}/`, { status: "cancelada" })
    return response.data
  },

  // Finalizar venda
  async finalizar(id) {
    const response = await api.patch(`/vendas/${id}/`, { status: "finalizada" })
    return response.data
  },

  // Estatísticas de vendas
  async estatisticas(params = {}) {
    const response = await api.get("/vendas/estatisticas/", { params })
    return response.data
  },
}
