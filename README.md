# HelpDesk Lite

A lightweight internal support ticketing tool built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Role-based access** — Employee, Support Staff, and Manager views
- **Submit tickets** — Validated forms with React Hook Form + Zod
- **My Tickets** — Employees see only their own submissions
- **Ticket Queue** — Support staff manage and assign tickets
- **Ticket Detail** — Status updates and follow-up comments
- **Manager Overview** — Dashboard with status counts and charts
- **Local persistence** — Auth and ticket data stored in localStorage via Zustand

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React Hook Form + Zod
- Zustand (state management)
- Recharts (manager dashboard)
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

| Email | Role | Landing Page |
|-------|------|--------------|
| `employee@acme.com` | Employee | My Tickets |
| `support@acme.com` | Support Staff | Ticket Queue |
| `manager@acme.com` | Manager | Manager Overview |

Any password works for demo login.

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Sign in | Public |
| `/tickets` | My Tickets | All roles |
| `/tickets/new` | Submit Ticket | All roles |
| `/tickets/[id]` | Ticket Detail | Role-based |
| `/queue` | Ticket Queue | Staff, Manager |
| `/overview` | Manager Dashboard | Manager |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── data/                   # Seed/mock data
├── lib/                    # Constants, utils, validations
├── store/                  # Zustand stores (auth, tickets)
└── types/                  # TypeScript types
```

The original Figma design export is preserved in `HelpDesk Lite UI_UX Design/` for reference.
