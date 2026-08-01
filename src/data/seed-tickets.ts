import type { TicketItem } from "@/types"

export const SEED_TICKETS: TicketItem[] = [
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
]
