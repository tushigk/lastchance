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

  updateMyProfile: (body: { city?: string; birthYear?: number; bio?: string; interests?: string[] }) =>
    request<AuthUser>("/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
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
