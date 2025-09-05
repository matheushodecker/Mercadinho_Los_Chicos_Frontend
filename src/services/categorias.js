import api from "@/services/api"

export const categoriasService = {
  // Listar categorias
  async listar(params = {}) {
    const response = await api.get("/categorias/", { params })
    return response.data
  },

  // Buscar categoria por ID
  async buscarPorId(id) {
    const response = await api.get(`/categorias/${id}/`)
    return response.data
  },

  // Criar nova categoria
  async criar(categoria) {
    const response = await api.post("/categorias/", categoria)
    return response.data
  },

  // Atualizar categoria
  async atualizar(id, categoria) {
    const response = await api.put(`/categorias/${id}/`, categoria)
    return response.data
  },

  // Deletar categoria
  async deletar(id) {
    const response = await api.delete(`/categorias/${id}/`)
    return response.data
  },

  // Listar apenas categorias ativas
  async listarAtivas() {
    const response = await api.get("/categorias/?ativo=true")
    return response.data
  },
}
