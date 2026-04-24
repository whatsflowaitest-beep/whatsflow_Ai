"use client";

import { useState } from "react";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  LifeBuoy
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type TicketStatus = "open" | "in-progress" | "resolved";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TIC-1024",
    subject: "Automation not triggering on weekend",
    description: "The automation workflow for 'Weekend Greeting' didn't trigger last Sunday.",
    status: "in-progress",
    priority: "high",
    createdAt: "2026-04-18T10:00:00Z"
  },
  {
    id: "TIC-1025",
    subject: "Knowledge base sync error",
    description: "Getting a 403 error when trying to sync a large PDF file.",
    status: "open",
    priority: "medium",
    createdAt: "2026-04-19T14:30:00Z"
  }
];

export default function SupportPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium" as const
  });

  const handleRaiseTicket = () => {
    if (!newTicket.subject || !newTicket.description) {
      toast("Please fill in all fields", "error");
      return;
    }

    const ticket: Ticket = {
      id: `TIC-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newTicket,
      status: "open",
      createdAt: new Date().toISOString()
    };

    setTickets([ticket, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ subject: "", description: "", priority: "medium" });
    toast("Support ticket raised successfully. Our team will contact you soon.", "success");
  };

  return (
    <div className="space-y-8">
      <PageHeading 
        title="Help & Support"
        description="Raise a ticket or search our help center for common issues."
        rightContent={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl shadow-lg shadow-green-500/10 font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Raise a Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[24px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#0F1F0F]">Describe Your Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-bold">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief summary of the issue" 
                    className="rounded-xl"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="font-bold">Priority</Label>
                  <select 
                    id="priority"
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Something's broken</option>
                    <option value="high">High - Urgent / Production issue</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please provide as much detail as possible..." 
                    className="rounded-xl min-h-[120px] resize-none"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold text-[#6B7B6B]">Cancel</Button>
                <Button onClick={handleRaiseTicket} className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold px-8">Submit Ticket</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F8FAF8] border border-[#E2EDE2] rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#16A34A] shadow-sm mb-4">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#0F1F0F]">Knowledge Base</h3>
          <p className="text-xs text-[#6B7B6B] mt-2 mb-4">Search documentation for instant answers.</p>
          <Button variant="outline" className="w-full rounded-xl border-[#16A34A] text-[#16A34A] hover:bg-green-50 font-bold text-xs h-9">View Docs</Button>
        </div>
        <div className="bg-[#F8FAF8] border border-[#E2EDE2] rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#0F1F0F]">Live Chat</h3>
          <p className="text-xs text-[#6B7B6B] mt-2 mb-4">Chat with our experts on WhatsApp.</p>
          <Button variant="outline" className="w-full rounded-xl border-blue-500 text-blue-500 hover:bg-blue-50 font-bold text-xs h-9">Start WhatsApp Chat</Button>
        </div>
        <div className="bg-[#F8FAF8] border border-[#E2EDE2] rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#0F1F0F]">System Status</h3>
          <p className="text-xs text-[#6B7B6B] mt-2 mb-4">All clusters are currently operational.</p>
          <div className="w-full py-2 bg-white rounded-lg text-green-600 text-[10px] font-bold uppercase tracking-wider">All Systems Operational</div>
        </div>
      </div>

      <div className="bg-white border border-[#E2EDE2] rounded-[32px] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-[#E2EDE2] flex items-center justify-between bg-[#FCFDFC]">
          <h2 className="font-bold text-[#0F1F0F]">My Support Tickets</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B6B]" />
            <Input placeholder="Search tickets..." className="pl-9 h-10 w-64 rounded-xl border-[#E2EDE2] bg-white text-xs" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF8] text-[#6B7B6B] text-[10px] font-bold uppercase tracking-widest border-b border-[#E2EDE2]">
                <th className="px-8 py-4">Ticket ID</th>
                <th className="px-8 py-4">Subject</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Priority</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EDE2]">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-[#F8FAF8] transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-[#0F1F0F] text-sm">{ticket.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div>
                      <p className="font-bold text-[#0F1F0F] text-sm group-hover:text-[#16A34A] transition-colors">{ticket.subject}</p>
                      <p className="text-xs text-[#6B7B6B] mt-0.5 line-clamp-1">{ticket.description}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'resolved' ? 'bg-green-50 text-green-600' :
                      ticket.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {ticket.status === 'resolved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {ticket.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[11px] font-bold ${
                      ticket.priority === 'high' ? 'text-red-500' :
                      ticket.priority === 'medium' ? 'text-amber-500' :
                      'text-[#6B7B6B]'
                    }`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-[#6B7B6B]">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
