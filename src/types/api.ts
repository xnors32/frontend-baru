/**
 * API Response Types
 * Type definitions untuk responses dari Spring Boot backend
 */

/**
 * WebResponse wrapper dari backend
 * Format: { code, status, message, data, paging }
 */
export interface ApiResponse<T> {
  code: number; // HTTP status code (200, 400, 401, 404, 500, etc)
  status: string; // Status string (e.g., "OK", "BAD_REQUEST", "INTERNAL_SERVER_ERROR")
  message: string; // Response message
  data: T; // Actual response data
  paging?: PagingInfo; // Pagination info (jika applicable)
  success?: boolean; // Optional success flag
  timestamp?: string; // Optional timestamp
}

/**
 * Pagination Info untuk list responses
 */
export interface PagingInfo {
  currentPage: number;
  totalPages: number;
  size: number;
  totalElements: number;
}

/**
 * User related types
 */
export type Role = "ADMIN" | "PETUGAS" | "MAHASISWA";

export interface User {
  idUser: number;
  nama: string;
  email: string;
  role: Role;
  createdAt?: string;
}

/**
 * Kategori (Category)
 */
export interface Kategori {
  idKategori: number;
  namaKategori: string;
  deskripsi?: string;
}

/**
 * Kondisi Barang (Item Condition)
 */
export type Kondisi = "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";

/**
 * Barang (Item/Equipment)
 * Barang dalam inventaris laboratorium
 */
export interface Barang {
  idBarang: number;
  kategori?: Kategori | null;
  idKategori?: number;
  namaKategori?: string;
  namaBarang: string;
  kodeBarang: string;
  jumlahTotal: number;
  jumlahTersedia: number;
  kondisi: Kondisi | string;
  lokasi: string;
  harga?: number;
}

/**
 * Barang Payload untuk create/update
 */
export interface BarangPayload {
  namaBarang: string;
  kodeBarang: string;
  jumlahTotal: number;
  idKategori: number;
  kondisi: Kondisi;
  lokasi?: string;
  harga?: number;
}

/**
 * Peminjaman (Loan Request)
 * Request untuk meminjam barang
 */
export type StatusPeminjaman =
  | "MENUNGGU"
  | "DISETUJUI"
  | "DIPINJAM"
  | "DIKEMBALIKAN"
  | "DITOLAK";

export interface DetailPeminjaman {
  idDetail: number;
  barang: Barang;
  jumlah: number;
  kondisiKembali?: Kondisi | null;
}

export interface Peminjaman {
  idPeminjaman: number;
  peminjam: User;
  petugas?: User | null;
  tglPinjam: string;
  tglKembali: string;
  status: StatusPeminjaman;
  catatan?: string | null;
  details: DetailPeminjaman[];
}

/**
 * Detail Peminjaman Payload
 */
export interface DetailPeminjamanPayload {
  idBarang: number;
  jumlah: number;
}

/**
 * Peminjaman Payload untuk create
 */
export interface PeminjamanPayload {
  tglPinjam: string;
  tglKembali: string;
  details: DetailPeminjamanPayload[];
  catatan?: string;
}

/**
 * Return Detail Payload untuk pengembalian
 */
export interface ReturnDetailPayload {
  idDetail: number;
  kondisiKembali: Kondisi;
}

/**
 * Authentication related types
 */
export interface AuthData {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nama: string;
  email: string;
  password: string;
  role?: Role;
}

/**
 * Shop Product (toko bahan lab)
 * Terpisah dari barang inventaris
 */
export interface ShopProduct {
  id: number;
  namaProduk: string;
  deskripsi?: string;
  harga: number;
  stok: number;
  gambarUrl?: string;
  kategori?: string;
  tags?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProductPayload {
  namaProduk: string;
  deskripsi?: string;
  harga: number;
  stok: number;
  gambarUrl?: string;
  kategori?: string;
  tags?: string;
}

/**
 * Shop Order
 */
export interface ShopOrder {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  totalHarga: number;
  status: string;
  orderBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopOrderPayload {
  productId: number;
  quantity: number;
}

/**
 * Error Response
 * Standard error response dari backend
 */
export interface ErrorResponse {
  code: number;
  status: string;
  message: string;
  timestamp?: string;
  path?: string;
}
