import { apiClient } from './apiClient'
import type {
  AdminActivity,
  AdminActivityPayload,
  AdminDashboardData,
  AdminDonation,
  AdminDonationPayload,
  AdminEcoProduct,
  AdminEcoProductPayload,
  AdminFinancialProduct,
  AdminFinancialProductPayload,
  AdminFinancialProductSubscription,
  AdminItem,
  AdminItemPayload,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminPageResponse,
  AdminUserDetail,
  AdminUserListItem,
  AdminVolunteer,
  AdminVolunteerPayload,
} from '../types/admin'

export const adminLogin = async (
  data: AdminLoginRequest,
): Promise<AdminLoginResponse> => {
  const response = await apiClient.post<AdminLoginResponse>('/v1/admin/auth/login', data)
  return response.data
}

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await apiClient.get<AdminDashboardData>('/v1/admin/dashboard')
  return response.data
}

export const getAdminUsers = async (params: {
  page: number
  size: number
  keyword?: string
}): Promise<AdminPageResponse<AdminUserListItem>> => {
  const response = await apiClient.get<AdminPageResponse<AdminUserListItem>>('/v1/admin/users', {
    params,
  })

  return response.data
}

export const getAdminUser = async (userId: number): Promise<AdminUserDetail> => {
  const response = await apiClient.get<AdminUserDetail>(`/v1/admin/users/${userId}`)
  return response.data
}

export const updateUserStatus = async (
  userId: number,
  isActive: boolean,
): Promise<AdminUserDetail> => {
  const response = await apiClient.patch<AdminUserDetail>(`/v1/admin/users/${userId}/status`, {
    isActive,
  })

  return response.data
}

export const applyUserPenalty = async (
  userId: number,
  reason: string,
): Promise<AdminUserDetail> => {
  const response = await apiClient.post<AdminUserDetail>(`/v1/admin/users/${userId}/penalty`, {
    reason,
  })

  return response.data
}

export const getAdminActivities = async (): Promise<AdminActivity[]> => {
  const response = await apiClient.get<AdminActivity[]>('/v1/admin/activities')
  return response.data
}

export const createActivity = async (data: AdminActivityPayload): Promise<AdminActivity> => {
  const response = await apiClient.post<AdminActivity>('/v1/admin/activities', data)
  return response.data
}

export const updateActivity = async (
  id: number,
  data: AdminActivityPayload,
): Promise<AdminActivity> => {
  const response = await apiClient.put<AdminActivity>(`/v1/admin/activities/${id}`, data)
  return response.data
}

export const toggleActivityStatus = async (
  id: number,
  isActive: boolean,
): Promise<AdminActivity> => {
  const response = await apiClient.patch<AdminActivity>(`/v1/admin/activities/${id}/status`, {
    isActive,
  })

  return response.data
}

export const getAdminDonations = async (): Promise<AdminDonation[]> => {
  const response = await apiClient.get<AdminDonation[]>('/v1/admin/donations')
  return response.data
}

export const getAdminDonation = async (id: number): Promise<AdminDonation> => {
  const response = await apiClient.get<AdminDonation>(`/v1/admin/donations/${id}`)
  return response.data
}

export const createDonation = async (
  data: AdminDonationPayload,
): Promise<AdminDonation> => {
  const response = await apiClient.post<AdminDonation>('/v1/admin/donations', data)
  return response.data
}

export const updateDonation = async (
  id: number,
  data: AdminDonationPayload,
): Promise<AdminDonation> => {
  const response = await apiClient.put<AdminDonation>(`/v1/admin/donations/${id}`, data)
  return response.data
}

export const toggleDonationStatus = async (
  id: number,
  isActive: boolean,
): Promise<AdminDonation> => {
  const response = await apiClient.patch<AdminDonation>(`/v1/admin/donations/${id}/status`, {
    isActive,
  })

  return response.data
}

export const deleteDonation = async (id: number) => {
  await apiClient.delete(`/v1/admin/donations/${id}`)
}

export const getAdminVolunteers = async (): Promise<AdminVolunteer[]> => {
  const response = await apiClient.get<AdminVolunteer[]>('/v1/admin/volunteers')
  return response.data
}

export const getAdminVolunteer = async (id: number): Promise<AdminVolunteer> => {
  const response = await apiClient.get<AdminVolunteer>(`/v1/admin/volunteers/${id}`)
  return response.data
}

export const createVolunteer = async (
  data: AdminVolunteerPayload,
): Promise<AdminVolunteer> => {
  const response = await apiClient.post<AdminVolunteer>('/v1/admin/volunteers', data)
  return response.data
}

export const updateVolunteer = async (
  id: number,
  data: AdminVolunteerPayload,
): Promise<AdminVolunteer> => {
  const response = await apiClient.put<AdminVolunteer>(`/v1/admin/volunteers/${id}`, data)
  return response.data
}

export const toggleVolunteerStatus = async (
  id: number,
  isActive: boolean,
): Promise<AdminVolunteer> => {
  const response = await apiClient.patch<AdminVolunteer>(`/v1/admin/volunteers/${id}/status`, {
    isActive,
  })

  return response.data
}

export const deleteVolunteer = async (id: number) => {
  await apiClient.delete(`/v1/admin/volunteers/${id}`)
}

export const getAdminEcoProducts = async (): Promise<AdminEcoProduct[]> => {
  const response = await apiClient.get<AdminEcoProduct[]>('/v1/admin/eco-products')
  return response.data
}

export const createEcoProduct = async (
  data: AdminEcoProductPayload,
): Promise<AdminEcoProduct> => {
  const response = await apiClient.post<AdminEcoProduct>('/v1/admin/eco-products', data)
  return response.data
}

export const updateEcoProduct = async (
  id: number,
  data: AdminEcoProductPayload,
): Promise<AdminEcoProduct> => {
  const response = await apiClient.put<AdminEcoProduct>(`/v1/admin/eco-products/${id}`, data)
  return response.data
}

export const toggleEcoProductStatus = async (
  id: number,
  isActive: boolean,
): Promise<AdminEcoProduct> => {
  const response = await apiClient.patch<AdminEcoProduct>(`/v1/admin/eco-products/${id}/status`, {
    isActive,
  })

  return response.data
}

export const deleteEcoProduct = async (id: number) => {
  await apiClient.delete(`/v1/admin/eco-products/${id}`)
}

export const getAdminItems = async (): Promise<AdminItem[]> => {
  const response = await apiClient.get<AdminItem[]>('/v1/admin/items')
  return response.data
}

export const createItem = async (data: AdminItemPayload): Promise<AdminItem> => {
  const response = await apiClient.post<AdminItem>('/v1/admin/items', data)
  return response.data
}

export const updateItem = async (
  id: number,
  data: AdminItemPayload,
): Promise<AdminItem> => {
  const response = await apiClient.put<AdminItem>(`/v1/admin/items/${id}`, data)
  return response.data
}

export const toggleItemStatus = async (
  id: number,
  isActive: boolean,
): Promise<AdminItem> => {
  const response = await apiClient.patch<AdminItem>(`/v1/admin/items/${id}/status`, {
    isActive,
  })

  return response.data
}

export const deleteItem = async (id: number) => {
  await apiClient.delete(`/v1/admin/items/${id}`)
}

export const getAdminFinancialProducts = async (): Promise<AdminFinancialProduct[]> => {
  const response = await apiClient.get<AdminFinancialProduct[]>('/v1/admin/financial-products')
  return response.data
}

export const getAdminFinancialProductSubscriptions = async (
  productId: number,
): Promise<AdminFinancialProductSubscription[]> => {
  const response = await apiClient.get<AdminFinancialProductSubscription[]>(
    `/v1/admin/financial-products/${productId}/subscriptions`,
  )

  return response.data
}

export const createFinancialProduct = async (
  data: AdminFinancialProductPayload,
): Promise<AdminFinancialProduct> => {
  const response = await apiClient.post<AdminFinancialProduct>('/v1/admin/financial-products', data)
  return response.data
}

export const updateFinancialProduct = async (
  id: number,
  data: AdminFinancialProductPayload,
): Promise<AdminFinancialProduct> => {
  const response = await apiClient.put<AdminFinancialProduct>(`/v1/admin/financial-products/${id}`, data)
  return response.data
}

export const toggleFinancialProductStatus = async (
  id: number,
  isActive: boolean,
): Promise<AdminFinancialProduct> => {
  const response = await apiClient.patch<AdminFinancialProduct>(
    `/v1/admin/financial-products/${id}/status`,
    {
      isActive,
    },
  )

  return response.data
}
