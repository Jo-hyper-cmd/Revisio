import { apiClient } from "./apiClient"

export const revisionsApi = {
  create: async (data) => {
    const res = await apiClient.post("/revision/create", data)
    return res.data
  },
  get: async (id) => {
    const res = await apiClient.get("/revision/get", { params: { id } })
    return res.data
  },
  list: async (filter = {}) => {
    const res = await apiClient.get("/revision/list", { params: filter })
    return res.data
  },
  update: async (data) => {
    const res = await apiClient.post("/revision/update", data)
    return res.data
  },
  delete: async (id) => {
    const res = await apiClient.post("/revision/delete", { id })
    return res.data
  },
}
