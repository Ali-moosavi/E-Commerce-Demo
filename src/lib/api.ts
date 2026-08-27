import axios from 'axios'

export interface Item {
  id: number
  title: string
}

export interface PaginatedResponse {
  data: Item[]
  totalPages: number
  totalItems: number
}

export const getPaginatedItems = async (
  page: number,
  limit: number = 10
): Promise<PaginatedResponse> => {
  const response = await axios.get<PaginatedResponse>('/api/items', {
    params: { page, limit },
  })
  return response.data
}