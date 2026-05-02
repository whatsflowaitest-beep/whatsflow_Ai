import type {
  Lead,
  LeadStage,
  LeadUrgency,
  Notification,
} from "@/types/index";

// ─── RE-EXPORTS FOR BACKWARD COMPAT ─────────────────────────────────────────
export type { Lead, LeadStage, LeadUrgency };

// ─── AVATAR COLORS ────────────────────────────────────────────────────────────
export const AVATAR_COLORS = [
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-cyan-500",
];

// ─── MOCK LEADS (CLEARED) ───────────────────────────────────────────────────
export const mockLeads: Lead[] = [];

// ─── MOCK NOTIFICATIONS (CLEARED) ──────────────────────────────────────────────
export const mockNotifications: Notification[] = [];

// ─── MOCK CONVERSATIONS (CLEARED) ──────────────────────────────────────────────
export interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  leadName: string;
  phone: string;
  service: string;
  stage: LeadStage;
  aiActive: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

export const mockConversations: Conversation[] = [];

// ─── DASHBOARD STATS (RESET) ──────────────────────────────────────────────────
export const mockDashboardStats = {
  totalLeads: 0,
  leadsTrend: 0,
  conversionRate: 0,
  conversionTrend: 0,
  activeConversations: 0,
  conversationsTrend: 0,
  appointmentsBooked: 0,
  appointmentsTrend: 0,
};

// ─── CHART DATA (CLEARED) ──────────────────────────────────────────────────────
export const mockChartData: any[] = [];
export const mockPieData: any[] = [];
export const mockTopDays: any[] = [];
export const mockBarData: any[] = [];
export const mockSourceAnalytics: any[] = [];
