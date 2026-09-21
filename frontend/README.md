# Pathward Frontend

Modern, high-performance web frontend for **Pathward** — an all-in-one placement preparation platform offering structured learning roadmaps, interactive coding practice, technical resources, company rubrics, and AI-assisted career tracking.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Core Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens (CSS Variables)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Authentication & Backend Integration:** [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)

---

## 📁 Project Structure

```text
frontend/
├── app/                      # Next.js App Router routes
│   ├── (auth)/               # Authentication pages (/login, /forgot-password, /reset-password)
│   ├── companies/            # Company preparation patterns & interview rubrics
│   ├── dashboard/            # Student preparation hub, progress metrics & daily plans
│   ├── learn/                # Structured topic modules (DSA, Core CS, SQL, OOP, Aptitude)
│   ├── onboarding/           # 4-step student onboarding wizard
│   ├── practice/             # Code & query practice sprint runner and review
│   ├── profile/              # User profile, learning paths, targets & preferences
│   ├── resources/            # Placement notes, cheat-sheets & downloadable guides
│   ├── roadmaps/             # Visual career tracks & milestone pathways
│   ├── settings/             # Account & system preferences
│   ├── templates/            # Resume & cold-email templates
│   ├── tools/                # Career preparation utilities & calculators
│   ├── layout.tsx            # Root layout wrapped with AuthProvider
│   └── page.tsx              # Landing page
├── components/               # Modular, reusable UI components
│   ├── auth/                 # Brand panel, text fields, password fields, Google OAuth button
│   ├── dashboard/            # Metrics cards, progress rings, upcoming milestones
│   ├── landing/              # Hero, features, topic strips, proof points
│   ├── layout/               # Header, sidebar, navigation, user menu
│   ├── onboarding/           # Step components (Identity, Career, Baseline, Targets)
│   ├── practice/             # Code sandboxes, sprint runners, test feedback
│   ├── providers/            # Context providers (AuthProvider)
│   └── shared/               # Universal cards, badges, buttons, modals
├── lib/                      # Business logic, API clients & services
│   ├── api/                  # Typed REST API clients for backend communication
│   ├── data/                 # Static datasets, question banks, module content
│   ├── services/             # Client-side services (onboarding, session persistence)
│   └── supabase/             # Supabase browser client configuration
├── middleware.ts             # Route guard middleware for protected vs. auth routes
└── types/                    # Shared TypeScript models and interfaces
```

---

## ⚙️ Environment Variables

Create a `.env.local` file inside the `frontend/` directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Supabase Credentials (from Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

---

## 🛠️ Getting Started & Commands

Ensure you have **Node.js 18+** and **npm** installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

### 5. Run Linter
```bash
npm run lint
```
