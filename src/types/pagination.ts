export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

export interface PaginationLinks {
  first?: string
  last?: string
  prev?: string | null
  next?: string | null
}

export interface Pagination {
  meta: PaginationMeta
  links?: PaginationLinks
}

export interface BackendPagination {
  meta: PaginationMeta
  links?: PaginationLinks
}
