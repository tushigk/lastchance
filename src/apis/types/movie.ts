import { QPayInvoice } from "./membership";

export interface MovieImage {
  _id: string;
  url: string;
  blurHash?: string | null;
}

export interface Movie {
  _id: string;
  title: string;
  description?: string | null;
  image: MovieImage | null;
  price: number;
  discountedPrice?: number | null;
  effectivePrice: number;
  releaseYear?: number | null;
  genres: string[];
  duration: number;
  thumbnailUrl?: string | null;
  qualities: string[];
  status: string;
  isActive: boolean;
  owned: boolean;
  ownership: "single" | "bundle" | null;
  streamUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MovieBundle {
  _id: string;
  kind: "all" | "custom";
  title: string;
  description?: string | null;
  image: MovieImage | null;
  movies: Movie[];
  movieIds: string[];
  price: number;
  discountedPrice?: number | null;
  effectivePrice: number;
  isActive: boolean;
  owned: boolean;
  totalMovies?: number;
  movieCount?: number;
  sortOrder?: number;
}

export interface MovieBundlePurchaseResponse {
  purchaseIds: string[];
  orderId: string;
  invoice: QPayInvoice;
  totalPrice: number;
  bundle: MovieBundle;
  movies: Movie[];
  status: string;
}

export interface MoviePurchaseResponse {
  purchaseId: string;
  invoice: QPayInvoice;
  orderId: string;
  movie: Movie;
  status: string;
}

export interface MovieStreamData {
  _id: string;
  title: string;
  streamUrl: string;
  duration: number;
  qualities: string[];
  thumbnailUrl?: string | null;
  ownership: "single" | "bundle";
}
export interface MovieBulkPurchaseResponse {
  purchaseIds: string[];
  orderId: string;
  invoice: QPayInvoice;
  totalPrice: number;
  movies: Movie[];
  status: string;
}
