import api from "@/services/api"

export const fabricantesService = {
  // Listar fabricantes
  async listar(params = {}) {
    const response = await api.get("/fabricantes/", { params })
    return response.data
  },

  // Buscar fabricante por ID
  async buscarPorId(id) {
    const response = await api.get(`/fabricantes/${id}/`)
    return response.data
  },

  // Criar novo fabricante
  async criar(fabricante) {
    const response = await api.post("/fabricantes/", fabricante)
    return response.data
  },

  // Atualizar fabricante
  async atualizar(id, fabricante) {
    const response = await api.put(`/fabricantes/${id}/`, fabricante)
    return response.data
  },

  // Deletar fabricante
  async deletar(id) {
    const response = await api.delete(`/fabricantes/${id}/`)
    return response.data
  },

  // Listar apenas fabricantes ativos
  async listarAtivos() {
    const response = await api.get("/fabricantes/?ativo=true")
    return response.data
  },
}
