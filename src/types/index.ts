// src/types/index.ts

export type PoemCategory =
  | 'Love'
  | 'Longing'
  | 'Happiness'
  | 'Missing You'
  | 'Dreams'
  | 'Forever'

export interface IPoem {
  _id: string
  title: string
  category: PoemCategory
  lines: string[]
  excerpt: string
  isFeatured: boolean
  isPrivate: boolean
  readingTime: number
  views: number
  favourites: number
  createdAt: string
  updatedAt: string
}

export interface INote {
  _id: string
  text: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface IPhoto {
  _id: string
  url: string
  publicId: string
  caption?: string
  width: number
  height: number
  createdAt: string
}

export interface IMilestone {
  _id: string
  date: string
  memory: string
  note: string
  photo?: string
  order: number
}

export interface IAdmin {
  _id: string
  email: string
  passwordHash: string
  createdAt: string
}

export interface DashboardStats {
  totalPoems: number
  totalNotes: number
  pendingNotes: number
  totalPhotos: number
  totalViews: number
  totalFavourites: number
  recentPoems: IPoem[]
  viewsByCategory: { category: string; views: number }[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
