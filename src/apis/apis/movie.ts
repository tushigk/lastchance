import { request } from "@/utils/request";
import { Movie, MovieStreamData, MoviePurchaseResponse, MovieBundle, MovieBulkPurchaseResponse, MovieBundlePurchaseResponse } from "../types/movie";
import { QPayInvoice } from "../types/membership";

export const movieApi = {
  list: (page = 1, limit = 20, genre?: string, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (genre) params.set("genre", genre);
    if (search) params.set("search", search);
    return request<{ data: Movie[]; total: number; page: number; totalPages: number; bundleOwned: boolean }>(
      `/movies?${params}`
    );
  },

  getDetail: (id: string) =>
    request<{ data: Movie }>(`/movies/${id}`),

  getStream: (id: string) =>
    request<{ data: MovieStreamData }>(`/movies/${id}/stream`),

  purchase: (movieId: string) =>
    request<MoviePurchaseResponse>("/movies/purchase", {
      method: "POST",
      body: JSON.stringify({ movieId }),
    }),

  getPurchaseStatus: (purchaseId: string) =>
    request<{ active: boolean }>(`/movies/purchases/${purchaseId}/status`),

  getBundle: () =>
    request<{ data: MovieBundle }>("/movies/bundle"),

  purchaseBundle: () =>
    request<{ purchaseId: string; invoice: QPayInvoice; orderId: string; bundle: MovieBundle; status: string }>(
      "/movies/bundle/purchase",
      { method: "POST" }
    ),

  myPurchases: () =>
    request<{ bundle: { purchasedAt: string; price: number } | null; data: Movie[] }>("/movies/me"),

  bulkPurchase: (movieIds: string[]) =>
    request<MovieBulkPurchaseResponse>("/movies/bulk/purchase", {
      method: "POST",
      body: JSON.stringify({ movieIds }),
    }),

  listBundles: (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return request<{ data: MovieBundle[]; total: number; page: number; totalPages: number }>(
      `/movies/bundles?${params}`
    );
  },

  purchaseMovieBundle: (bundleId: string) =>
    request<MovieBundlePurchaseResponse>(`/movies/bundles/${bundleId}/purchase`, {
      method: "POST",
    }),
};
