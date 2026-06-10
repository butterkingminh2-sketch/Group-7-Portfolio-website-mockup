export interface FeedbackEntry {
  id: string;
  name: string;
  message: string;
  rating: number; // 1–5
  createdAt: string; // ISO string
}

export type FeedbackPayload = Omit<FeedbackEntry, 'id' | 'createdAt'>;
