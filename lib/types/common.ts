/**
 * ROZX Healthcare Platform - Common/Shared Types
 * API responses, pagination, and utility types
 */

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// List Response Types
// ============================================================================

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Form Types
// ============================================================================

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// ============================================================================
// Action & Event Types
// ============================================================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AsyncState<T = unknown> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Table Types
// ============================================================================

export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// Address Types
// ============================================================================

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

// ============================================================================
// File Upload Types
// ============================================================================

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

export interface UploadedFile {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// ============================================================================
// Time & Date Types
// ============================================================================

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface OperatingHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    breaks?: TimeSlot[];
  };
}

// ============================================================================
// Location Types
// ============================================================================

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface LocationWithRadius extends GeoLocation {
  radius: number; // in kilometers
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};

export type WithId<T> = T & {
  id: string;
};

// ============================================================================
// React Component Types
// ============================================================================

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface BaseComponentProps extends WithClassName {
  id?: string;
  'data-testid'?: string;
}
