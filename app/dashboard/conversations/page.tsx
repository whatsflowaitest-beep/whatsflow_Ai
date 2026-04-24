import { ConversationViewer } from "@/components/dashboard/ConversationViewer";

export default function ConversationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0F1F0F]">Conversations</h1>
        <p className="text-sm text-[#6B7B6B] mt-0.5">
          Monitor and manage your AI-powered WhatsApp conversations.
        </p>
      </div>
      <ConversationViewer />
    </div>
  );
}
