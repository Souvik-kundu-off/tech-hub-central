# 🌌 Tech Hub Central

**Tech Hub Central** (formerly TechClub) is a high-performance, student-driven community platform designed to empower builders, creators, and innovators. It serves as a central "Nexus" for managing projects, events, and member contributions with a gamified credit system.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Features

### 🚀 For Members (Builders)
- **Onboarding & Profile**: Seamless entry into the hub with student verification.
- **Project Showcase**: Submit and showcase your builds to the community.
- **Hub Credits**: Earn points for project approvals, profile completion, and community wins.
- **Real-time Leaderboard**: Track your standing in the global "Nexus" rankings.
- **Resource Library**: Unified access to tutorials, tools, and developer templates.

### 🛡️ For Admins (Overseers)
- **Command Center**: Manage the entire community ecosystem from a unified dashboard.
- **Moderation Engine**: Approve/Reject projects with feedback loops.
- **Broadcast System**: Send global announcements and "Active Buffs" to the hub.
- **Credit Management**: Manually adjust member points and promote status.
- **Maintenance Panel**: Toggle site modules and monitor system health.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Vanilla CSS, Lucide Icons, Framer Motion |
| **Backend/Auth** | Supabase (PostgreSQL, Auth, RLS) |
| **State/Data** | TanStack Query (React Query) |
| **UI Components** | Radix UI (via shadcn/ui patterns) |

---

## 🏗️ Getting Started

### 1. Prerequisite Setup
- Node.js (v18+)
- A Supabase Project ([Create one here](https://supabase.com/))

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd tech-hub-central

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
> [!IMPORTANT]
> You must run the SQL schema to initialize tables, RLS policies, and critical triggers.

1.  Open your Supabase **SQL Editor**.
2.  Copy and paste the entire contents of [supabase_schema.sql](file:///Users/apple/Desktop/tech-hub-central/supabase_schema.sql) into a new query.
3.  Run the query. This installs the `handle_new_user` trigger which handles member profile creation and the "Welcome Bonus".

### 5. Start Development
```bash
npm run dev
```

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI & Layout components
│   ├── admin/      # Specialized Overseer tools
│   ├── auth/       # Onboarding & Permission checks
│   ├── home/       # Landing & Dashboard modules
│   └── ui/         # Base design system components
├── contexts/       # Global Shared state (Auth, etc.)
├── hooks/          # Custom React logic
├── lib/            # External service configs (Supabase)
├── pages/          # Full-page route components
└── App.tsx         # Root routing & Providers
```

---

## 🎮 Gamification Logic

Members earn "Hub Credits" through various actions:
- **Welcome Bonus**: +5 Credits (Initial joining)
- **Profile Completion**: +10 Credits (Verifying details)
- **Project Approved**: +50 Credits (Submission success)
- **Admin Awards**: Variable (Community contributions)

---

## 📄 License
Designed and Developed for the **TechHub Community**.
