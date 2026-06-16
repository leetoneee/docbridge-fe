export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T | null;
}

export interface PageData<T> {
  content: T[];
  page: PageMeta;
}

export interface PageMeta {
  page: number;        // 0-based, giữ nguyên theo BE
  size: number;
  totalElements: number;
  totalPages: number;
}