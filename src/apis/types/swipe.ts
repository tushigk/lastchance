export interface SwipeUser {
  _id: string;
  name?: string;
  username?: string;
  avatar?: string;
  photos?: string[];
  gender?: string;
  birthYear?: number;
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
