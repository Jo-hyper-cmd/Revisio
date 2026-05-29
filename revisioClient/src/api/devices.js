import { apiClient } from "./apiClient"

export const devicesApi = {
  create: async (data) => {
    const res = await apiClient.post("/device/create", data)
    return res.data
  },
  get: async (id) => {
    const res = await apiClient.get("/device/get", { params: { id } })
    return res.data
  },
  list: async (filter = {}) => {
    const res = await apiClient.get("/device/list", { params: filter })
    return res.data
  },
  update: async (data) => {
    const res = await apiClient.post("/device/update", data)
    return res.data
  },
  delete: async (id) => {
    const res = await apiClient.post("/device/delete", { id })
    return res.data
  },
}
