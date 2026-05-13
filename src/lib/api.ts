const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message ?? "Алдаа гарлаа");
  }

  return data as T;
}

export interface AuthUser {
  _id: string;
  name?: string;
  phone?: string;
  gender?: string;
  role?: string;
  city?: string;
  birthYear?: number;
  bio?: string;
  interests?: string[];
  avatar?: string;
  membershipExpiresAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface MembershipPlan {
  _id: string;
  title: string;
  description?: string;
  months: number;
  price: number;
  tier: string;
  swipeDailyLimit: number;
  aiHumanDailyMessageLimit: number;
  sortOrder: number;
}

export interface QPayUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPayInvoice {
  invoice_id: string;
  qr_image: string;
  qr_text: string;
  urls: QPayUrl[];
  shortlink?: string;
}

export interface PurchaseResponse {
  membershipId: string;
  invoice: QPayInvoice;
  orderId: string;
  plan: MembershipPlan;
  status: string;
}

export interface MembershipStatus {
  active: boolean;
  membership?: {
    _id: string;
    status: string;
    planTitle?: string;
    expiresAt?: string;
  };
}

export const membershipApi = {
  getPlans: () =>
    request<{ plans: MembershipPlan[] }>("/membership/plans"),

  purchase: (planId: string) =>
    request<PurchaseResponse>("/membership/purchase", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),

  getStatus: (membershipId?: string) =>
    request<MembershipStatus>(
      membershipId ? `/membership/status?membershipId=${membershipId}` : "/membership/status"
    ),
};

export const profileApi = {
  updateAvatar: async (file: File): Promise<{ data: { user: AuthUser; image: { url: string } } }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE_URL}/users/me/avatar`, {
      method: "PUT",
      credentials: "include",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "Алдаа гарлаа");
    return data;
  },

  updateMyProfile: (body: { city?: string; birthYear?: number; bio?: string; interests?: string[]; images?: string[] }) =>
    request<AuthUser>("/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE_URL}/users/me/avatar`, {
      method: "PUT",
      credentials: "include",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "Алдаа гарлаа");
    return { url: data?.data?.image?.url ?? data?.data?.user?.avatar ?? "" };
  },
};

export interface SwipeUser {
  _id: string;
  name?: string;
  username?: string;
  avatar?: string;
  gender?: string;
  age?: number;
  isOnline?: boolean;
}

export interface SwipeQuota {
  used: number;
  limit: number;
  remaining: number;
}

export interface MatchResult {
  _id: string;
  matchedAt: string;
  target: SwipeUser;
}

export interface SwipeResult {
  swipe: unknown;
  match: MatchResult | null;
  isNewMatch: boolean;
  quota: SwipeQuota;
}

export const swipeApi = {
  getFeed: (page = 1, limit = 10) =>
    request<{ data: SwipeUser[]; total: number; page: number; totalPages: number; quota: SwipeQuota }>(
      `/swipes/feed?page=${page}&limit=${limit}`
    ),

  getFeedSingle: () =>
    request<{ data: SwipeUser[]; total: number; quota: SwipeQuota }>("/swipes/feed?limit=1"),

  performSwipe: (targetId: string, action: "like" | "pass") =>
    request<SwipeResult>(`/swipes/${targetId}`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  getQuota: () =>
    request<{ quota: SwipeQuota }>("/swipes/quota"),

  getMatches: () =>
    request<{ data: { _id: string; matchedAt: string; target: SwipeUser }[]; total: number }>("/swipes/matches?limit=5"),

  getLikes: () =>
    request<{ data: { _id: string; likedAt: string; user: SwipeUser }[]; total: number }>("/swipes/likes?limit=6"),

  getLikesFull: (page = 1, limit = 20) =>
    request<{ data: { _id: string; likedAt: string; user: SwipeUser }[]; total: number; page: number; totalPages: number }>(
      `/swipes/likes?page=${page}&limit=${limit}`
    ),
};

export interface NetworkPostAuthor {
  _id: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export interface NetworkPost {
  _id: string;
  title: string;
  description: string;
  image?: { url: string; blurHash?: string };
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  createdBy: NetworkPostAuthor;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  isEdited: boolean;
  category?: "breakup" | "friends";
  likedByMe: boolean;
}

export interface NetworkComment {
  _id: string;
  post: string;
  user: NetworkPostAuthor;
  message: string;
  source: "user" | "ai";
  isAiGenerated: boolean;
  createdAt: string;
}

export interface PublicProfile {
  _id: string;
  username?: string;
  name?: string;
  avatar?: string;
  gender?: string;
  age?: number;
  exp?: number;
  level?: { level: number; title: string } | null;
  nextLevel?: { level: number; title: string; requiredExp: number } | null;
  createdAt?: string;
}

export interface PublicNetworkPost {
  _id: string;
  title: string;
  description: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isEdited: boolean;
}

export const userApi = {
  getPublicProfile: (id: string) =>
    request<{
      profile: PublicProfile;
      posts: PublicNetworkPost[];
      postsTotal: number;
      postsPage: number;
      postsTotalPages: number;
    }>(`/users/${id}/public`),
};

export const networkApi = {
  listPosts: (page = 1, limit = 20, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    return request<{ data: NetworkPost[]; total: number; page: number; totalPages: number }>(
      `/network/posts?${params}`
    );
  },

  createPost: (body: { title: string; description: string; category?: "breakup" | "friends" }) =>
    request<{ data: NetworkPost }>("/network/posts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  likePost: (id: string) =>
    request<{ success: boolean }>(`/network/posts/${id}/like`, { method: "POST" }),

  unlikePost: (id: string) =>
    request<{ success: boolean }>(`/network/posts/${id}/like`, { method: "DELETE" }),

  listComments: (postId: string, page = 1) =>
    request<{ data: NetworkComment[]; total: number; totalPages: number }>(
      `/network/posts/${postId}/comments?page=${page}&limit=20`
    ),

  createComment: (postId: string, message: string) =>
    request<{ data: NetworkComment }>(`/network/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  deletePost: (id: string) =>
    request<{ success: boolean }>(`/network/posts/${id}`, { method: "DELETE" }),

  deleteComment: (id: string) =>
    request<{ success: boolean }>(`/network/comments/${id}`, { method: "DELETE" }),
};

export interface ChatRoom {
  _id: string;
  type: "direct" | "group";
  title?: string;
  memberCount: number;
  lastMessage?: { _id: string; body: string; sender: any; createdAt: string } | null;
  unread: boolean;
  counterpart?: { _id: string; username?: string; name?: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  room: string;
  sender: { _id: string; username?: string; name?: string; avatar?: string };
  type: string;
  body: string;
  createdAt: string;
}

export const chatApi = {
  listChats: () =>
    request<{ data: ChatRoom[]; total: number }>("/chats?limit=50"),

  getMessages: (roomId: string, page = 1) =>
    request<{ data: ChatMessage[]; total: number; totalPages: number }>(
      `/chats/${roomId}/messages?page=${page}&limit=30`
    ),

  createDirect: (userId: string) =>
    request<{ data: ChatRoom }>("/chats/direct", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  sendMessage: (roomId: string, body: string) =>
    request<{ data: ChatMessage }>(`/chats/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  markRead: (roomId: string) =>
    request<{ success: boolean }>(`/chats/${roomId}/read`, { method: "POST" }),

  deleteChat: (roomId: string) =>
    request<{ success: boolean }>(`/chats/${roomId}`, { method: "DELETE" }),
};

export interface AppNotification {
  _id: string;
  type: "chat_invite" | "chat_message" | "membership_activated" | "article_published" | "advisor_published" | "system_announcement" | string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  list: (page = 1, limit = 30) =>
    request<{ data: AppNotification[]; total: number; page: number; totalPages: number }>(
      `/notifications?page=${page}&limit=${limit}`
    ),

  markRead: (id: string) =>
    request<{ data: AppNotification }>(`/notifications/${id}/read`, { method: "POST" }),

  markAllRead: () =>
    request<{ success: boolean }>("/notifications/read", { method: "POST" }),
};

export interface GameZone {
  _id: string;
  image: { _id: string; url: string; blurHash?: string | null } | null;
  title: string;
  description?: string | null;
  type: string;
  level: string;
  responseMode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameZonePlayResult {
  game: GameZone;
  playerName: string;
  selectedLevel: string;
  response: string;
  model: string;
}

export const gameZoneApi = {
  list: (page = 1, limit = 50, type?: string, level?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set("type", type);
    if (level) params.set("level", level);
    return request<{ data: GameZone[]; total: number; page: number; totalPages: number }>(
      `/game-zones?${params}`
    );
  },

  play: (id: string, body: { playerName: string; level: string }) =>
    request<{ data: GameZonePlayResult }>(`/game-zones/${id}/play`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

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
  title: string;
  description?: string | null;
  image: MovieImage | null;
  price: number;
  discountedPrice?: number | null;
  effectivePrice: number;
  isActive: boolean;
  owned: boolean;
  totalMovies?: number;
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
};

export interface AIHumanImage {
  _id: string;
  url: string;
  blurHash?: string | null;
}

export interface AIHumanConversation {
  _id: string;
  persona: string;
  user: string;
  behaviorPrompt?: string | null;
  lastMessageAt?: string | null;
  lastMessagePreview?: string | null;
  lastMessageRole?: "user" | "assistant" | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIHuman {
  _id: string;
  image: AIHumanImage | null;
  name: string;
  age?: number | null;
  gender: string;
  badge: string[];
  shortBio: string;
  prompt: string;
  greeting?: string | null;
  model: string;
  isActive: boolean;
  canChat?: boolean;
  conversation: AIHumanConversation | null;
}

export interface AIHumanMessage {
  _id: string;
  conversation: string;
  persona: string;
  role: "user" | "assistant";
  content: string;
  model?: string | null;
  createdAt: string;
}

export interface AIHumanQuota {
  tier: string;
  limit: number;
  used: number;
  remaining: number | null;
  unlimited: boolean;
  resetAt: string;
}

export const aiHumanApi = {
  list: (page = 1, limit = 20) =>
    request<{ data: AIHuman[]; total: number; page: number; totalPages: number; canChat: boolean; quota: AIHumanQuota | null }>(
      `/ai-humans?page=${page}&limit=${limit}`
    ),

  getDetail: (id: string) =>
    request<{ data: AIHuman; quota: AIHumanQuota | null }>(`/ai-humans/${id}`),

  getHistory: (id: string, page = 1, limit = 50) =>
    request<{ persona: AIHuman; conversation: AIHumanConversation | null; data: AIHumanMessage[]; total: number; totalPages: number; quota: AIHumanQuota | null }>(
      `/ai-humans/${id}/history?page=${page}&limit=${limit}`
    ),

  chat: (id: string, body: { message: string; behaviorPrompt?: string }) =>
    request<{ persona: AIHuman; conversation: AIHumanConversation; userMessage: AIHumanMessage; assistantMessage: AIHumanMessage; quota: AIHumanQuota | null }>(
      `/ai-humans/${id}/chat`,
      { method: "POST", body: JSON.stringify(body) }
    ),

  deleteChat: (id: string) =>
    request<{ success: boolean; deleted: boolean }>(`/ai-humans/${id}/chat`, { method: "DELETE" }),
};

export const authApi = {
  register: (body: { phone: string; name: string; gender: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { phone: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),

  me: () =>
    request<AuthUser>("/auth/me"),
};
