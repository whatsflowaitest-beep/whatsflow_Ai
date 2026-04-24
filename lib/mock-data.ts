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

// ─── MOCK LEADS ────────────────────────────────────────────────────────────
export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    phone: "+1 (555) 234-5678",
    service: "Dental Checkup",
    urgency: "Today",
    stage: "Booked",
    source: "WhatsApp Ad",
    lastActivity: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    email: "sarah.m@email.com",
    avatarColor: "bg-green-500",
    notes: "Prefers morning appointments. First-time patient.",
  },
  {
    id: "2",
    name: "James Kowalski",
    phone: "+1 (555) 876-5432",
    service: "Property Buying",
    urgency: "This Week",
    stage: "Qualifying",
    source: "Organic WhatsApp",
    lastActivity: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    email: "jkowalski@email.com",
    avatarColor: "bg-blue-500",
    notes: "Looking for 3-bedroom in north side. Budget $450-500k.",
  },
  {
    id: "3",
    name: "Priya Ramesh",
    phone: "+1 (555) 345-9012",
    service: "Hair & Styling",
    urgency: "Today",
    stage: "New",
    source: "Referral",
    lastActivity: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    avatarColor: "bg-purple-500",
  },
  {
    id: "4",
    name: "Marcus Thompson",
    phone: "+1 (555) 567-8901",
    service: "Property Selling",
    urgency: "Next Week",
    stage: "Qualified",
    source: "WhatsApp Ad",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    email: "marcus.t@email.com",
    avatarColor: "bg-orange-500",
    assignedTo: "Alex Rivera",
  },
  {
    id: "5",
    name: "Dr. Amara Osei",
    phone: "+1 (555) 678-2345",
    service: "Teeth Whitening",
    urgency: "This Week",
    stage: "Booked",
    source: "Organic WhatsApp",
    lastActivity: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    email: "dr.amara@clinic.com",
    avatarColor: "bg-teal-500",
    notes: "VIP patient. Referred by Dr. Chen.",
  },
  {
    id: "6",
    name: "Lena Fischer",
    phone: "+1 (555) 789-3456",
    service: "Physiotherapy",
    urgency: "Flexible",
    stage: "Qualifying",
    source: "Referral",
    lastActivity: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    avatarColor: "bg-indigo-500",
  },
  {
    id: "7",
    name: "Carlos Mendez",
    phone: "+1 (555) 890-4567",
    service: "General Inquiry",
    urgency: "This Week",
    stage: "Lost",
    source: "WhatsApp Ad",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    email: "carlos.m@email.com",
    avatarColor: "bg-rose-500",
    notes: "Went with a competitor. Price sensitive.",
  },
  {
    id: "8",
    name: "Aisha Patel",
    phone: "+1 (555) 901-5678",
    service: "Spa & Massage",
    urgency: "Today",
    stage: "Booked",
    source: "Instagram",
    lastActivity: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    email: "aisha.p@email.com",
    avatarColor: "bg-amber-500",
  },
  {
    id: "9",
    name: "Tyler Brooks",
    phone: "+1 (555) 012-6789",
    service: "Dental Implants",
    urgency: "Next Week",
    stage: "Qualified",
    source: "Website",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    avatarColor: "bg-cyan-500",
    notes: "Needs full implant consultation.",
  },
  {
    id: "10",
    name: "Fatima Al-Rashid",
    phone: "+1 (555) 123-7890",
    service: "Physiotherapy",
    urgency: "This Week",
    stage: "New",
    source: "WhatsApp Ad",
    lastActivity: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    email: "fatima.ar@email.com",
    avatarColor: "bg-emerald-500",
  },
  {
    id: "11",
    name: "Noah Williams",
    phone: "+1 (555) 234-8901",
    service: "Property Rental",
    urgency: "Flexible",
    stage: "Booked",
    source: "Referral",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    email: "noah.w@email.com",
    avatarColor: "bg-blue-500",
    assignedTo: "Sam Park",
  },
  {
    id: "12",
    name: "Sofia Hernandez",
    phone: "+1 (555) 345-9012",
    service: "Hair & Styling",
    urgency: "Today",
    stage: "Qualifying",
    source: "WhatsApp Ad",
    lastActivity: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    avatarColor: "bg-rose-500",
  },
];

// ─── MOCK NOTIFICATIONS ───────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "new_lead",
    title: "New lead received",
    body: "Sarah Mitchell messaged about Dental Checkup",
    time: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
    actionLeadId: "1",
  },
  {
    id: "n2",
    type: "booked",
    title: "Appointment booked",
    body: "Marcus Reid booked for Property Consultation",
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    actionLeadId: "4",
  },
  {
    id: "n3",
    type: "attention",
    title: "Lead needs attention",
    body: "AI couldn't handle Priya's question — manual response needed",
    time: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    read: false,
    actionLeadId: "3",
  },
  {
    id: "n4",
    type: "new_lead",
    title: "New lead received",
    body: "Ethan Nguyen inquired about Physiotherapy sessions",
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    actionLeadId: "10",
  },
  {
    id: "n5",
    type: "summary",
    title: "Daily summary ready",
    body: "Yesterday: 14 leads, 9 converted (64%)",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
  },
  {
    id: "n6",
    type: "ai_paused",
    title: "AI assistant paused",
    body: "You manually took over James K.'s conversation",
    time: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    read: true,
  },
  {
    id: "n7",
    type: "system",
    title: "WhatsApp API connected",
    body: "Your WhatsApp number is live and receiving messages",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
  {
    id: "n8",
    type: "system",
    title: "Google Sheets synced",
    body: "142 leads successfully synced to your spreadsheet",
    time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: true,
  },
];

// ─── MOCK CONVERSATIONS ───────────────────────────────────────────────────────
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

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    leadName: "Sarah Mitchell",
    phone: "+1 (555) 234-5678",
    service: "Dental Checkup",
    stage: "Booked",
    aiActive: true,
    unreadCount: 0,
    lastMessage: "Your appointment is confirmed for tomorrow at 10 AM!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    messages: [
      { id: "m1", sender: "user", content: "Hi, I need a dental appointment", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
      { id: "m2", sender: "ai", content: "Hi Sarah! 😊 I'd love to help. What type of dental service are you looking for?", timestamp: new Date(Date.now() - 1000 * 60 * 89).toISOString() },
      { id: "m3", sender: "user", content: "Teeth cleaning this week", timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString() },
      { id: "m4", sender: "ai", content: "Perfect! Here's our booking link 👉 [Book Now →]", timestamp: new Date(Date.now() - 1000 * 60 * 84).toISOString() },
      { id: "m5", sender: "user", content: "Done! Just booked it", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: "m6", sender: "ai", content: "Your appointment is confirmed for tomorrow at 10 AM! ✅", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    ],
  },
  {
    id: "conv2",
    leadName: "James Kowalski",
    phone: "+1 (555) 876-5432",
    service: "Property Buying",
    stage: "Qualifying",
    aiActive: true,
    unreadCount: 2,
    lastMessage: "Looking for 3-bedroom in the north side",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    messages: [
      { id: "m1", sender: "user", content: "Hello, I saw your ad about buying a home", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: "m2", sender: "ai", content: "Hi James! 👋 Are you looking to buy or rent?", timestamp: new Date(Date.now() - 1000 * 60 * 119).toISOString() },
      { id: "m3", sender: "user", content: "Buy, we're looking for something for our family", timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString() },
      { id: "m4", sender: "ai", content: "Wonderful! How many bedrooms are you looking for?", timestamp: new Date(Date.now() - 1000 * 60 * 114).toISOString() },
      { id: "m5", sender: "user", content: "Looking for 3-bedroom in the north side", timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString() },
      { id: "m6", sender: "ai", content: "Great choice! What's your approximate budget range?", timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString() },
    ],
  },
  {
    id: "conv3",
    leadName: "Priya Ramesh",
    phone: "+1 (555) 345-9012",
    service: "Hair & Styling",
    stage: "New",
    aiActive: false,
    unreadCount: 3,
    lastMessage: "I need something urgent today if possible",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    messages: [
      { id: "m1", sender: "user", content: "Hi, do you do hair coloring?", timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      { id: "m2", sender: "ai", content: "Hi Priya! 💇‍♀️ Yes, we offer a full range of hair coloring services!", timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString() },
      { id: "m3", sender: "user", content: "Highlights and maybe a trim", timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
      { id: "m4", sender: "ai", content: "Great combo! When were you thinking of coming in?", timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString() },
      { id: "m5", sender: "user", content: "I need something urgent today if possible", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: "m6", sender: "ai", content: "Let me check today's availability for you! 🔍", timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
    ],
  },
];

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
export const mockDashboardStats = {
  totalLeads: 1248,
  leadsTrend: 12.5,
  conversionRate: 64.2,
  conversionTrend: 3.1,
  activeConversations: 42,
  conversationsTrend: -5.2,
  appointmentsBooked: 156,
  appointmentsTrend: 8.4,
};

// ─── CHART DATA ──────────────────────────────────────────────────────────────
export const mockChartData = [
  { date: "2024-03-01", leads: 45, conversions: 28 },
  { date: "2024-03-02", leads: 52, conversions: 32 },
  { date: "2024-03-03", leads: 48, conversions: 25 },
  { date: "2024-03-04", leads: 61, conversions: 40 },
  { date: "2024-03-05", leads: 55, conversions: 35 },
  { date: "2024-03-06", leads: 67, conversions: 45 },
  { date: "2024-03-07", leads: 72, conversions: 50 },
  { date: "2024-03-08", leads: 58, conversions: 38 },
  { date: "2024-03-09", leads: 63, conversions: 42 },
  { date: "2024-03-10", leads: 50, conversions: 30 },
  { date: "2024-03-11", leads: 75, conversions: 55 },
  { date: "2024-03-12", leads: 82, conversions: 60 },
  { date: "2024-03-13", leads: 78, conversions: 52 },
  { date: "2024-03-14", leads: 85, conversions: 65 },
];

export const mockPieData = [
  { name: "WhatsApp Ads", value: 400, color: "#16A34A" },
  { name: "Organic", value: 300, color: "#10B981" },
  { name: "Website", value: 200, color: "#34D399" },
  { name: "Other", value: 100, color: "#A7F3D0" },
];

export const mockTopDays = [
  { day: "Monday", leads: 42, converted: 28, rate: "66%", bookings: 12 },
  { day: "Wednesday", leads: 38, converted: 22, rate: "58%", bookings: 9 },
  { day: "Friday", leads: 35, converted: 20, rate: "57%", bookings: 8 },
  { day: "Tuesday", leads: 31, converted: 18, rate: "58%", bookings: 7 },
  { day: "Thursday", leads: 28, converted: 15, rate: "53%", bookings: 6 },
];

export const mockBarData = [
  { day: "Mon", leads: 42, conversions: 28 },
  { day: "Tue", leads: 31, conversions: 18 },
  { day: "Wed", leads: 38, conversions: 22 },
  { day: "Thu", leads: 28, conversions: 15 },
  { day: "Fri", leads: 35, conversions: 20 },
  { day: "Sat", leads: 22, conversions: 12 },
  { day: "Sun", leads: 18, conversions: 10 },
];

export const mockSourceAnalytics = [
  { name: "WhatsApp Ads", leads: 542, conv: 312, rate: "57.5%" },
  { name: "Organic WhatsApp", leads: 412, conv: 245, rate: "59.4%" },
  { name: "Website", leads: 186, conv: 92, rate: "49.4%" },
  { name: "Instagram", leads: 124, conv: 68, rate: "54.8%" },
  { name: "Facebook", leads: 92, conv: 45, rate: "48.9%" },
];
