import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  InboxIcon,
  LogOut,
  Search,
  ChevronDown,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Tag,
  Calendar,
  ArrowUpRight,
  BarChart2,
  Filter,
  UserCheck,
  Shield,
  ChevronRight,
  Send,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "employee" | "staff" | "manager";
type TicketStatus = "Open" | "In Progress" | "Resolved" | "Overdue";
type Priority = "Low" | "Medium" | "High" | "Critical";
type Screen =
  | "login"
  | "my-tickets"
  | "submit"
  | "queue"
  | "detail"
  | "overview";

interface TicketComment {
  id: string;
  author: string;
  role: string;
  body: string;
  timestamp: string;
}

interface TicketItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  submittedBy: string;
  submittedDate: string;
  assignedTo: string | null;
  comments: TicketComment[];
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_TICKETS: TicketItem[] = [
  {
    id: "TKT-1042",
    title: "VPN disconnects every 30 minutes on macOS",
    description:
      "Since the latest IT policy push, my VPN client drops connection approximately every 30 minutes. I have to manually reconnect, which interrupts video calls. Running macOS 14.4, Cisco AnyConnect 4.10.08029.",
    category: "Network",
    priority: "High",
    status: "In Progress",
    submittedBy: "Sarah Chen",
    submittedDate: "2026-07-28",
    assignedTo: "Marcus Webb",
    comments: [
      {
        id: "c1",
        author: "Marcus Webb",
        role: "IT Support",
        body: "Hi Sarah, I can reproduce this on our test machine. It appears to be related to the new certificate policy. Working on a fix — will update by EOD.",
        timestamp: "2026-07-28 14:32",
      },
      {
        id: "c2",
        author: "Sarah Chen",
        role: "Employee",
        body: "Thanks Marcus! Happening more frequently now — about every 15 minutes.",
        timestamp: "2026-07-29 09:05",
      },
    ],
  },
  {
    id: "TKT-1041",
    title: "Request access to Figma Pro workspace",
    description:
      "Our team is onboarding two new designers next week. We need two additional Figma Pro seats added to the company workspace. Managers: Priya Nair and James Oduya.",
    category: "Software Access",
    priority: "Medium",
    status: "Open",
    submittedBy: "Priya Nair",
    submittedDate: "2026-07-29",
    assignedTo: null,
    comments: [],
  },
  {
    id: "TKT-1040",
    title: "Office printer on Floor 3 offline",
    description:
      "The HP LaserJet on the 3rd floor east wing has been showing offline since Monday morning. Print jobs are queuing but not completing. Multiple employees affected.",
    category: "Hardware",
    priority: "Medium",
    status: "Open",
    submittedBy: "Tom Bridger",
    submittedDate: "2026-07-27",
    assignedTo: null,
    comments: [],
  },
  {
    id: "TKT-1039",
    title: "Outlook calendar not syncing with Teams",
    description:
      "My Outlook calendar events are not showing up in Microsoft Teams. Meeting invites I accept in Outlook do not appear in my Teams calendar, causing me to miss reminders.",
    category: "Software",
    priority: "High",
    status: "Overdue",
    submittedBy: "Sarah Chen",
    submittedDate: "2026-07-21",
    assignedTo: "Aisha Patel",
    comments: [
      {
        id: "c3",
        author: "Aisha Patel",
        role: "IT Support",
        body: "Investigating — this is a known Microsoft 365 tenant issue. Escalated to the M365 team.",
        timestamp: "2026-07-22 10:00",
      },
    ],
  },
  {
    id: "TKT-1038",
    title: "New laptop setup — onboarding for Daniel Kim",
    description:
      "Daniel Kim joins the engineering team on Aug 5th. Please provision a MacBook Pro M3 with standard dev tooling: Homebrew, Docker, VS Code, 1Password.",
    category: "Hardware",
    priority: "High",
    status: "Resolved",
    submittedBy: "Jordan Park",
    submittedDate: "2026-07-18",
    assignedTo: "Marcus Webb",
    comments: [
      {
        id: "c4",
        author: "Marcus Webb",
        role: "IT Support",
        body: "Laptop provisioned and ready for pickup at the IT desk (Room 104). All software installed and accounts created.",
        timestamp: "2026-07-25 16:45",
      },
    ],
  },
  {
    id: "TKT-1037",
    title: "Cannot log into Salesforce — account locked",
    description:
      "After too many failed login attempts, my Salesforce account has been locked. I need it unlocked urgently as I have a client demo in 2 hours.",
    category: "Software Access",
    priority: "Critical",
    status: "Resolved",
    submittedBy: "Ryan O'Sullivan",
    submittedDate: "2026-07-25",
    assignedTo: "Aisha Patel",
    comments: [
      {
        id: "c5",
        author: "Aisha Patel",
        role: "IT Support",
        body: "Account unlocked and temporary password sent to your company email. Please reset on first login.",
        timestamp: "2026-07-25 11:15",
      },
    ],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  Open: {
    label: "Open",
    color: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    icon: AlertCircle,
  },
  "In Progress": {
    label: "In Progress",
    color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    icon: Clock,
  },
  Resolved: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    icon: CheckCircle2,
  },
  Overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700 ring-1 ring-red-200",
    icon: AlertCircle,
  },
};

const PRIORITY_CONFIG: Record<Priority, { color: string }> = {
  Low: { color: "text-slate-500" },
  Medium: { color: "text-amber-600" },
  High: { color: "text-orange-600" },
  Critical: { color: "text-red-600" },
};

function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function PriorityLabel({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
      {priority}
    </span>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  screen: Screen;
  role: Role;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
  user: { name: string; email: string };
}

function Sidebar({ screen, role, onNavigate, onLogout, user }: SidebarProps) {
  const navItems = [
    { id: "my-tickets" as Screen, label: "My Tickets", icon: Ticket, roles: ["employee", "staff", "manager"] },
    { id: "submit" as Screen, label: "Submit Ticket", icon: PlusCircle, roles: ["employee", "staff", "manager"] },
    { id: "queue" as Screen, label: "Ticket Queue", icon: InboxIcon, roles: ["staff", "manager"] },
    { id: "overview" as Screen, label: "Manager View", icon: LayoutDashboard, roles: ["manager"] },
  ].filter((item) => item.roles.includes(role));

  return (
    <aside className="w-60 min-h-screen bg-[#0A1F44] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0891B2] rounded-lg flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">HelpDesk Lite</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">
              {role === "employee" ? "Employee" : role === "staff" ? "Support Staff" : "Manager"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                active
                  ? "bg-[#0891B2] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-white text-sm font-medium leading-none">{user.name}</p>
          <p className="text-white/40 text-xs mt-1">{user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-xl font-semibold text-[#0A1F44]">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

interface LoginProps {
  onLogin: (role: Role) => void;
}

function LoginScreen({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const ROLE_MAP: Record<string, Role> = {
    "employee@acme.com": "employee",
    "support@acme.com": "staff",
    "manager@acme.com": "manager",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const role = ROLE_MAP[email.toLowerCase()] ?? "employee";
      onLogin(role);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F1F4F8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#0A1F44] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield size={26} className="text-[#0891B2]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0A1F44]">HelpDesk Lite</h1>
          <p className="text-sm text-slate-500 mt-1">Internal Support Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-8 py-8">
          <h2 className="text-base font-semibold text-[#0A1F44] mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@acme.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#0A1F44] hover:bg-[#112952] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-2">Demo logins:</p>
            <div className="flex flex-col gap-1">
              {[
                ["employee@acme.com", "Employee"],
                ["support@acme.com", "Support Staff"],
                ["manager@acme.com", "Manager"],
              ].map(([addr, label]) => (
                <button
                  key={addr}
                  onClick={() => setEmail(addr)}
                  className="text-left text-xs text-[#0891B2] hover:text-[#0A1F44] transition-colors font-mono"
                >
                  {addr} <span className="font-sans text-slate-400">— {label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Acme Corp · Internal Use Only
        </p>
      </div>
    </div>
  );
}

// ─── Submit Ticket Screen ─────────────────────────────────────────────────────

function SubmitTicketScreen({ onSubmit }: { onSubmit: (t: TicketItem) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [submitted, setSubmitted] = useState(false);

  const categories = ["Software", "Hardware", "Network", "Software Access", "Facilities", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: TicketItem = {
      id: `TKT-${1043 + Math.floor(Math.random() * 100)}`,
      title,
      description,
      category,
      priority,
      status: "Open",
      submittedBy: "Sarah Chen",
      submittedDate: new Date().toISOString().split("T")[0],
      assignedTo: null,
      comments: [],
    };
    onSubmit(newTicket);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-[#0A1F44]">Ticket Submitted</h2>
        <p className="text-sm text-slate-500 text-center max-w-xs">
          Your support request has been received. Our team will respond within 1 business day.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 px-5 py-2 bg-[#0A1F44] text-white rounded-lg text-sm font-medium hover:bg-[#112952] transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Submit a Support Ticket" subtitle="Describe your issue and we'll get back to you shortly." />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Ticket Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your issue"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail. Include any error messages, steps to reproduce, and how it affects your work."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all resize-none"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
                >
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Fields marked <span className="text-red-500">*</span> are required
            </p>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#112952] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Send size={14} />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── My Tickets Screen ────────────────────────────────────────────────────────

function MyTicketsScreen({
  tickets,
  onSelectTicket,
}: {
  tickets: TicketItem[];
  onSelectTicket: (t: TicketItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const myTickets = tickets.filter((t) => t.submittedBy === "Sarah Chen");

  const filtered = useMemo(() => {
    return myTickets.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [myTickets, search, statusFilter]);

  return (
    <div>
      <PageHeader title="My Tickets" subtitle="All support requests you've submitted." />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 appearance-none rounded-lg border border-slate-200 bg-white text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
          >
            {["All", "Open", "In Progress", "Resolved", "Overdue"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">Submitted</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                  No tickets found.
                </td>
              </tr>
            ) : (
              filtered.map((ticket, i) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className={`cursor-pointer hover:bg-slate-50/80 transition-colors ${
                    i < filtered.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-slate-500">{ticket.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-[#0A1F44]">{ticket.title}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                      <Tag size={11} className="text-slate-400" />
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(ticket.submittedDate)}</td>
                  <td className="px-3 py-3.5">
                    <ChevronRight size={15} className="text-slate-300" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3">{filtered.length} ticket{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}

// ─── Ticket Queue Screen ──────────────────────────────────────────────────────

function TicketQueueScreen({
  tickets,
  onSelectTicket,
  onAssign,
}: {
  tickets: TicketItem[];
  onSelectTicket: (t: TicketItem) => void;
  onAssign: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.submittedBy.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tickets, search, statusFilter]);

  return (
    <div>
      <PageHeader title="Ticket Queue" subtitle="All incoming support requests across the company." />

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, ID, or employee…"
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 appearance-none rounded-lg border border-slate-200 bg-white text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
          >
            {["All", "Open", "In Progress", "Resolved", "Overdue"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="ml-auto text-xs text-slate-400 font-medium">
          {filtered.length} tickets
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Submitted by</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">Priority</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">Assigned to</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">Date</th>
              <th className="w-28"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                  No tickets found.
                </td>
              </tr>
            ) : (
              filtered.map((ticket, i) => (
                <tr
                  key={ticket.id}
                  className={`group hover:bg-slate-50/80 transition-colors ${
                    i < filtered.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onSelectTicket(ticket)}
                      className="font-mono text-xs text-[#0891B2] hover:underline"
                    >
                      {ticket.id}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onSelectTicket(ticket)}
                      className="font-medium text-[#0A1F44] hover:text-[#0891B2] text-left transition-colors"
                    >
                      {ticket.title}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                        <User size={10} className="text-slate-500" />
                      </div>
                      <span className="text-xs text-slate-600">{ticket.submittedBy}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <PriorityLabel priority={ticket.priority} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {ticket.assignedTo ? (
                      <span className="text-xs text-slate-600">{ticket.assignedTo}</span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {formatDate(ticket.submittedDate)}
                  </td>
                  <td className="px-3 py-3.5">
                    {!ticket.assignedTo && (
                      <button
                        onClick={() => onAssign(ticket.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0891B2]/10 hover:bg-[#0891B2]/20 text-[#0891B2] text-xs font-semibold transition-colors"
                      >
                        <UserCheck size={12} />
                        Assign me
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Ticket Detail Screen ─────────────────────────────────────────────────────

function TicketDetailScreen({
  ticket,
  onBack,
  onUpdateStatus,
  onAddComment,
}: {
  ticket: TicketItem;
  onBack: () => void;
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  onAddComment: (id: string, body: string) => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus>(ticket.status);

  const handleSaveStatus = () => {
    onUpdateStatus(ticket.id, newStatus);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(ticket.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-[#0891B2] transition-colors font-medium">
          ← Back
        </button>
        <span>/</span>
        <span className="font-mono text-xs">{ticket.id}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={ticket.status} />
              <PriorityLabel priority={ticket.priority} />
            </div>
            <h2 className="text-lg font-semibold text-[#0A1F44] leading-snug">{ticket.title}</h2>
          </div>
          {/* Status updater */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Overdue</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={handleSaveStatus}
              disabled={newStatus === ticket.status}
              className="px-4 py-2 bg-[#0A1F44] hover:bg-[#112952] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Update
            </button>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          {[
            { label: "Ticket ID", value: ticket.id, icon: Tag, mono: true },
            { label: "Submitted by", value: ticket.submittedBy, icon: User },
            { label: "Date submitted", value: formatDate(ticket.submittedDate), icon: Calendar },
            { label: "Assigned to", value: ticket.assignedTo ?? "Unassigned", icon: UserCheck },
          ].map(({ label, value, icon: Icon, mono }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Icon size={11} />
                {label}
              </p>
              <p className={`text-sm font-medium text-[#0A1F44] ${mono ? "font-mono text-xs" : ""}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
        {/* Description + Comments */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Comment thread */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-1.5">
              <MessageSquare size={12} />
              Activity ({ticket.comments.length})
            </h3>

            {ticket.comments.length > 0 ? (
              <div className="flex flex-col gap-5 mb-5">
                {ticket.comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-7 h-7 bg-[#0A1F44]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <User size={13} className="text-[#0A1F44]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#0A1F44]">{c.author}</span>
                        <span className="text-xs text-slate-400">{c.role}</span>
                        <span className="text-xs text-slate-400 ml-auto">{c.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 mb-5 italic">No activity yet.</p>
            )}

            <form onSubmit={handleAddComment} className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder="Add an update or response…"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0891B2] hover:bg-[#0780A0] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={13} />
                  Post Update
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Details</h3>
          <div className="flex flex-col gap-3.5">
            {[
              { label: "Category", value: ticket.category },
              { label: "Priority", value: ticket.priority },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-500 font-medium">{label}</span>
                <span className="text-xs font-semibold text-[#0A1F44]">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs text-slate-500 font-medium">Status</span>
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Manager Overview Screen ──────────────────────────────────────────────────

const CHART_COLORS = ["#0891B2", "#F59E0B", "#10B981", "#DC2626"];

function ManagerOverviewScreen({
  tickets,
  onSelectTicket,
}: {
  tickets: TicketItem[];
  onSelectTicket: (t: TicketItem) => void;
}) {
  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProgress = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const overdue = tickets.filter((t) => t.status === "Overdue").length;
    return { open, inProgress, resolved, overdue };
  }, [tickets]);

  const pieData = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Overdue", value: stats.overdue },
  ].filter((d) => d.value > 0);

  const barData = [
    { category: "Network", open: 1, resolved: 0 },
    { category: "Software", open: 0, resolved: 1 },
    { category: "Hardware", open: 1, resolved: 1 },
    { category: "Access", open: 1, resolved: 1 },
  ];

  const summaryCards = [
    { label: "Open", value: stats.open, color: "bg-blue-50 border-blue-200", textColor: "text-blue-700", icon: AlertCircle },
    { label: "In Progress", value: stats.inProgress, color: "bg-amber-50 border-amber-200", textColor: "text-amber-700", icon: Clock },
    { label: "Resolved", value: stats.resolved, color: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-700", icon: CheckCircle2 },
    { label: "Overdue", value: stats.overdue, color: "bg-red-50 border-red-200", textColor: "text-red-700", icon: AlertCircle },
  ];

  return (
    <div>
      <PageHeader title="Manager Overview" subtitle="Organization-wide support ticket summary." />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryCards.map(({ label, value, color, textColor, icon: Icon }) => (
          <div key={label} className={`bg-white rounded-xl border shadow-sm px-5 py-5 ${color}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={14} className={textColor} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">active tickets</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-[1fr_280px] gap-5 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5">
          <h3 className="text-sm font-semibold text-[#0A1F44] mb-4">Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F8" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              />
              <Bar dataKey="open" name="Open" fill="#0891B2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5">
          <h3 className="text-sm font-semibold text-[#0A1F44] mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "#64748B" }}>{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All tickets table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0A1F44]">All Tickets</h3>
          <span className="text-xs text-slate-400">{tickets.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Submitted by</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">Assigned to</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, i) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                  i < tickets.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-slate-500">{ticket.id}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-medium text-[#0A1F44]">{ticket.title}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600">{ticket.submittedBy}</td>
                <td className="px-5 py-3.5">
                  {ticket.assignedTo ? (
                    <span className="text-xs text-slate-600">{ticket.assignedTo}</span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(ticket.submittedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

const USER_CONFIG: Record<Role, { name: string; email: string }> = {
  employee: { name: "Sarah Chen", email: "employee@acme.com" },
  staff: { name: "Marcus Webb", email: "support@acme.com" },
  manager: { name: "Jordan Park", email: "manager@acme.com" },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("employee");
  const [tickets, setTickets] = useState<TicketItem[]>(SEED_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>("my-tickets");

  const handleLogin = (r: Role) => {
    setRole(r);
    setScreen(r === "manager" ? "overview" : r === "staff" ? "queue" : "my-tickets");
  };

  const handleLogout = () => {
    setScreen("login");
    setSelectedTicket(null);
  };

  const handleSelectTicket = (t: TicketItem, from: Screen) => {
    setSelectedTicket(t);
    setPrevScreen(from);
    setScreen("detail");
  };

  const handleUpdateStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status } : prev));
    }
  };

  const handleAddComment = (id: string, body: string) => {
    const comment: TicketComment = {
      id: `c${Date.now()}`,
      author: USER_CONFIG[role].name,
      role: role === "staff" ? "IT Support" : role === "manager" ? "Manager" : "Employee",
      body,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, comments: [...t.comments, comment] } : t
      )
    );
    setSelectedTicket((prev) =>
      prev?.id === id ? { ...prev, comments: [...prev.comments, comment] } : prev
    );
  };

  const handleAssign = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, assignedTo: USER_CONFIG[role].name, status: "In Progress" } : t
      )
    );
  };

  const handleSubmitTicket = (t: TicketItem) => {
    setTickets((prev) => [t, ...prev]);
  };

  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const user = USER_CONFIG[role];

  return (
    <div className="flex min-h-screen bg-[#F1F4F8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        screen={screen}
        role={role}
        onNavigate={(s) => setScreen(s)}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 px-8 py-8 overflow-auto min-h-screen">
        {screen === "my-tickets" && (
          <MyTicketsScreen
            tickets={tickets}
            onSelectTicket={(t) => handleSelectTicket(t, "my-tickets")}
          />
        )}
        {screen === "submit" && (
          <SubmitTicketScreen onSubmit={handleSubmitTicket} />
        )}
        {screen === "queue" && (
          <TicketQueueScreen
            tickets={tickets}
            onSelectTicket={(t) => handleSelectTicket(t, "queue")}
            onAssign={handleAssign}
          />
        )}
        {screen === "detail" && selectedTicket && (
          <TicketDetailScreen
            ticket={selectedTicket}
            onBack={() => setScreen(prevScreen)}
            onUpdateStatus={handleUpdateStatus}
            onAddComment={handleAddComment}
          />
        )}
        {screen === "overview" && (
          <ManagerOverviewScreen
            tickets={tickets}
            onSelectTicket={(t) => handleSelectTicket(t, "overview")}
          />
        )}
      </main>
    </div>
  );
}
