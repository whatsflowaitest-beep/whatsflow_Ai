import { ConversationViewer } from "@/components/dashboard/ConversationViewer";
import { PageHeading } from "@/components/dashboard/PageHeading";

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Conversations"
        description="Monitor and manage your AI-powered WhatsApp conversations in real-time."
      />
      <ConversationViewer />
    </div>
  );
}
