# HelpDesk Lite

A feature-rich internal support ticketing tool built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Zod, and Zustand.

---

## 🌟 Key Features

### 👤 Role-Based Access Control (RBAC)
* **Employee View**: Submit tickets, track personal submission status, view self-service knowledge base, and rate resolved ticket support.
* **Support Staff Queue**: Triage company-wide tickets, bulk-assign tickets, add internal notes, and use canned response templates.
* **Manager Overview**: Executive analytics dashboard with category bar charts, status pie distribution, SLA breach metrics, and average CSAT scores.

### 📚 Knowledge Base & Self-Service Deflection
* **Knowledge Base Portal (`/kb`)**: Searchable help library filtered by topic (`Network`, `Software Access`, `Hardware`, `MFA`).
* **Smart Ticket Deflection**: Automatically suggests relevant self-service articles to employees *as they type* their ticket title and description to reduce ticket volume.

### ⏱️ SLA Management & Timers
* **Priority SLA Targets**: Automated response targets (`Critical`: 4h, `High`: 12h, `Medium`: 24h, `Low`: 48h).
* **Countdown & Breach Alerts**: Visual timers showing remaining time or `SLA Breached` indicators.

### 💬 Discussion & Internal Staff Notes
* **Public vs Internal Comments**: Support staff and managers can toggle between **Public Reply** and **Internal Staff Note** (visible only to staff).
* **Canned Templates**: Quick insertion of standardized responses (e.g., VPN troubleshooting steps, log request templates).

### ⭐ Customer Satisfaction (CSAT) Surveys
* **Star Rating Widget**: 5-star evaluation and feedback prompt displayed to employees upon ticket resolution.
* **Analytics Tracking**: Aggregated average CSAT score displayed on the Manager Overview.

### ⚡ Bulk Queue Operations & CSV Export
* **Bulk Actions**: Select multiple tickets in `/queue` to **Bulk Assign to Me**, **Bulk Mark In Progress / Resolved**, or **Bulk Delete**.
* **CSV Export**: One-click export for both filtered queue views and manager analytics reports.

### 🔔 In-App Notification Center
* Real-time notification bell dropdown alerting users of status changes, agent assignments, and comments.

### 📎 Attachments & Ticket Editing
* **File Attachments**: Upload screenshots and diagnostic logs during ticket creation or within discussion threads.
* **Ticket Metadata Editing**: Edit title, description, category, priority, and department inline via modal dialog.

### 🌓 Dark / Light Mode
* Complete dark and light mode theme support with system preference detection via `next-themes`.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4
* **State Management**: Zustand (with `localStorage` persistence)
* **Form & Validation**: React Hook Form + Zod
* **Charts**: Recharts
* **Icons**: Lucide React
* **Theme**: `next-themes`

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run the development server**:
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

| Email | Role | Department | Default Landing Page |
| font-mono | font-mono | font-mono | font-mono |
| `employee@acme.com` | Employee | Software Engineering | `/tickets` (My Tickets) |
| `support@acme.com` | Support Staff | IT Support | `/queue` (Ticket Queue) |
| `manager@acme.com` | Manager | Network & Security | `/overview` (Manager Overview) |

*Note: Any password string works for demo sign in.*

---

## 🗺️ Application Routes

| Route | Description | Access Control |
|-------|-------------|----------------|
| `/login` | Public Sign In page | Public |
| `/tickets` | My Tickets (filtered by submitter) | All Roles |
| `/tickets/new` | Submit Ticket with KB Deflection & Attachments | All Roles |
| `/tickets/[id]` | Ticket Detail, Discussion, Internal Notes, & Audit Log | Role-based / Ticket Owner |
| `/kb` | Knowledge Base & Self-Service Portal | All Roles |
| `/kb/[id]` | Knowledge Base Article Detail | All Roles |
| `/queue` | Ticket Queue, Bulk Actions, & CSV Export | Support Staff, Manager |
| `/overview` | Executive Manager Dashboard & CSAT Analytics | Manager |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (dashboard)/        # Main application layout & pages
│   │   ├── kb/             # Knowledge base & article pages
│   │   ├── overview/       # Manager overview dashboard
│   │   ├── queue/          # Support staff queue
│   │   └── tickets/        # Ticket listing, detail, & creation
│   └── login/              # Demo login page
├── components/             # Reusable UI components
│   ├── auth/               # Route guards & RBAC wrappers
│   ├── kb/                 # KB cards & deflection suggestions
│   ├── layout/             # Sidebar, Header, Page Header
│   ├── notifications/      # Notification bell & dropdown
│   ├── theme/              # Theme provider & mode toggle
│   └── tickets/            # Status badges, SLA timers, audit timeline, CSAT
├── data/                   # Seed tickets & knowledge base articles
├── lib/                    # Constants, validations, utility helpers
├── store/                  # Zustand stores (auth, tickets, kb, notifications)
└── types/                  # TypeScript interfaces & types
```

---

## 🎨 Design System & Prototype

The original Figma export and standalone Vite prototype workspace is preserved in [`HelpDesk Lite UI_UX Design/`](./HelpDesk%20Lite%20UI_UX%20Design) for reference.
