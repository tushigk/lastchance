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
