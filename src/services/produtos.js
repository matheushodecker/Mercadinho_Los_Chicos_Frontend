import api from "@/services/api"

export const produtosService = {
  // Listar produtos com filtros e paginação
  async listar(params = {}) {
    const response = await api.get("/produtos/", { params })
    return response.data
  },

  // Buscar produto por ID
  async buscarPorId(id) {
    const response = await api.get(`/produtos/${id}/`)
    return response.data
  },

  // Buscar produto por código de barras
  async buscarPorCodigo(codigo) {
    const response = await api.get(`/produtos/buscar_por_codigo/?codigo=${codigo}`)
    return response.data
  },

  // Criar novo produto
  async criar(produto) {
    const response = await api.post("/produtos/", produto)
    return response.data
  },

  // Atualizar produto
  async atualizar(id, produto) {
    const response = await api.put(`/produtos/${id}/`, produto)
    return response.data
  },

  // Deletar produto
  async deletar(id) {
    const response = await api.delete(`/produtos/${id}/`)
    return response.data
  },

  // Listar produtos com estoque baixo
  async estoqueBaixo() {
    const response = await api.get("/produtos/estoque_baixo/")
    return response.data
  },
}
