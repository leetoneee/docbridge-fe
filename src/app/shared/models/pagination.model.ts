export interface PaginationParams {
  page: number;        // 0-based
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}