# AI FitPass - Fitness Class Booking Platform

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE.md) [![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/) [![Sanity](https://img.shields.io/badge/Sanity-v4-F03E2F?logo=sanity)](https://www.sanity.io/) [![Clerk](https://img.shields.io/badge/Clerk-Auth%20%26%20Billing-6C47FF?logo=clerk)](https://clerk.com/) [![Vercel AI](https://img.shields.io/badge/Vercel%20AI-Gateway-000000?logo=vercel)](https://vercel.com/ai) [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## One Membership. Thousands of Classes. Unlimited Possibilities.

> **Stop paying for multiple gym memberships.** AI FitPass gives you access to yoga studios, HIIT classes, cycling centers, and more — all with a single subscription. Discover classes near you, book instantly, and show up ready to sweat.

---

> ⚠️ **DEMO APPLICATION** — This is an educational demo project built for learning purposes. It demonstrates how to build a production-quality fitness booking platform using modern web technologies. The app showcases real-world patterns for authentication, subscription billing, real-time CMS, AI integration, and geographic filtering.

---

### 🎯 Who Is This For?

Fitness enthusiasts who want **variety without the commitment** of multiple gym memberships. Perfect for:

- Gym-hoppers who get bored easily
- Travelers who want to work out anywhere
- Anyone exploring new fitness routines

### ⚡ What Makes It Different?

- **AI-Powered Discovery** — Get personalized class recommendations from an AI fitness assistant
- **Tier-Based Access** — Choose your level: Basic, Performance, or Champion
- **Location-First** — Find classes within your preferred travel radius
- **3-Day Free Trial** — Try before you commit

---

## ✨ Features

### For Fitness Enthusiasts

| Feature | Description |
|---|---|
| 📍 **Location-Based Discovery** | Find classes within your preferred travel radius using geographic filtering |
| 💳 **Flexible Subscriptions** | 3 tiers with a 3-day free trial on all plans |
| 🤖 **AI Fitness Assistant** | Get personalized class recommendations via streaming chat |
| 🗺️ **Interactive Maps** | See venues on a Leaflet map with marker clustering |
| 📅 **Easy Booking** | Book classes instantly, manage from your dashboard |
| ✅ **Attendance Tracking** | Confirm attendance when you arrive at class |

### Technical Features

| Feature | Technology |
|---|---|
| **Framework** | Next.js 16 with React 19 + App Router |
| **CMS & Database** | Sanity v4 with SDK React for real-time updates |
| **Auth & Billing** | Clerk with subscription tier management |
| **AI Assistant** | Vercel AI SDK 6.0 Beta ToolLoopAgent with OpenAI |
| **Geographic Filtering** | Bounding box pre-filter + Haversine distance calculation |
| **Maps** | Leaflet + react-leaflet with marker clustering |
| **Address Autocomplete** | Mapbox geocoding (admin panel) |
| **State Management** | Zustand for client-side chat state |
| **Styling** | Tailwind CSS v4 + shadcn/ui + Radix UI |
| **Validation** | Zod v4 for schema validation |
| **Linting & Formatting** | Biome |
| **Icons** | Lucide React |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.2.6 (App Router) |
| **UI Library** | React 19.2.4 |
| **Language** | TypeScript 5 |
| **CMS** | Sanity v4 (GROQ, Live Content API) |
| **Authentication** | Clerk Next.js 6 |
| **AI** | Vercel AI SDK 6.0 + OpenAI (Qwen 3.7+) |
| **Maps** | Leaflet 1.9, react-leaflet 5, Mapbox GL |
| **Styling** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **State** | Zustand 5 |
| **Validation** | Zod 4 |
| **Date Handling** | date-fns 4, react-day-picker 10 |
| **Linting** | Biome 2, ESLint 9 |
| **Theming** | next-themes (dark/light mode) |

---

## 📊 Database Schema

AI FitPass uses Sanity CMS with the following document types:

```
┌─────────────────┐     ┌─────────────────┐
│   userProfile   │     │    category     │
│─────────────────│     │─────────────────│
│ clerkId         │     │ name            │
│ firstName       │     │ description     │
│ lastName        │     │ icon            │
│ email           │     └─────────────────┘
│ location        │              │
│ searchRadius    │              ▼
└─────────────────┘     ┌─────────────────┐
        │               │    activity     │
        │               │─────────────────│
        ▼               │ name            │
┌─────────────────┐     │ slug            │
│    booking      │     │ category ──────►│
│─────────────────│     │ instructor      │
│ user ──────────►│     │ description     │
│ classSession ──►│     │ duration        │
│ status          │     │ tierLevel       │
│ createdAt       │     │ images          │
│ attendedAt      │     │ aiKeywords      │
└─────────────────┘     └─────────────────┘
        ▲                        │
        │                        ▼
        │               ┌─────────────────┐
        │               │  classSession   │
        └───────────────│─────────────────│
                        │ activity ──────►│
                        │ venue ─────────►│
                        │ startTime       │
                        │ maxCapacity     │
                        │ status          │
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │     venue       │
                        │─────────────────│
                        │ name            │
                        │ address (geo)   │
                        │ description     │
                        │ amenities       │
                        │ images          │
                        └─────────────────┘
```

### Key Relationships

- **Activity** → Category (what type of class)
- **ClassSession** → Activity + Venue (when and where)
- **Booking** → User + ClassSession (who booked what)

---

## 🔄 How It Works

### User Booking Flow

```
Sign Up → Onboarding → Set Location → Choose Radius
→ Browse Classes → Book Class → Attend Class → Confirm Attendance
```

### Geographic Filtering Pipeline

```
User Location + Radius
    → Calculate Bounding Box (database level)
    → GROQ Query with Bounds
    → Database Returns Sessions in Rectangle
    → Haversine Distance Filter (client level)
    → Sessions Within Circle Radius
    → Sort by Distance → Display to User
```

> **Why two-step filtering?** The bounding box query at the database level reduces 100k+ global sessions down to ~100–500 in the user's area. The Haversine formula then accurately filters for the circular radius. This is much faster than calculating distances for every session.

### Subscription Tier Access

| Tier | Monthly Price | Classes/Month | Access Level |
|---|---|---|---|
| **Basic** | $29 | 5 classes | Basic-tier classes only |
| **Performance** | $59 | 12 classes | Basic + Performance classes |
| **Champion** | $99 | Unlimited | All classes (VIP access) |

All plans include a **3-day free trial** — no commitment, cancel anytime.

---

## 🏁 Getting Started

### Prerequisites

Before you begin, make sure you have accounts with:
- [Clerk](https://clerk.com/) (Authentication & Billing)
- [Sanity](https://www.sanity.io/) (Content Management)

### Step-by-Step Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ai-fitpass
```

2. **Install dependencies**

```bash
npm install
```

3. **Copy the environment file**

```bash
cp .env.example .env.local
```

4. **Configure environment variables** (see table below)

5. **Set up Clerk Billing**

In your Clerk Dashboard:
- Go to **Configure** > **Billing**
- Create 3 products: Basic ($29/mo), Performance ($59/mo), Champion ($99/mo)
- Enable 3-day free trial on each plan

6. **Import sample data to Sanity**

```bash
npx sanity dataset import sample-data.ndjson production
```

7. **Generate TypeScript types**

```bash
npm run typegen
```

8. **Start the development server**

```bash
npm run dev
```

9. **Open the app**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)
- Admin Backend: [http://localhost:3000/admin](http://localhost:3000/admin)

### Environment Variables

Create a `.env.local` file with these variables:

| Variable | Description | Where to Get |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Clerk Dashboard > API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard > API Keys |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Sanity Manage |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (e.g., "production") | Sanity Manage |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version (e.g., "2024-01-01") | Use current date |
| `SANITY_API_TOKEN` | Write token for mutations | Sanity > API > Tokens (Editor role) |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox public token | Mapbox Account > Tokens |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key | Vercel Dashboard > AI |

> ⚠️ **Security Note:** Never commit `.env.local` to git. Variables starting with `NEXT_PUBLIC_` are exposed to the browser — only use them for truly public keys.

---

## 🤖 AI Fitness Assistant

The app features an **AI-powered fitness assistant** built with the Vercel AI SDK **ToolLoopAgent**. The assistant has access to 7 tools:

| Tool | Purpose |
|---|---|
| `searchClasses` | Search for classes by keyword or category |
| `getClassSessions` | Get upcoming class sessions with availability |
| `searchVenues` | Find venues by location or name |
| `getCategories` | Browse available class categories |
| `getSubscriptionInfo` | Check subscription tier details and limits |
| `getRecommendations` | Get personalized class recommendations |
| `getUserBookings` | View upcoming and past bookings |

The AI agent uses **Qwen 3.7+** (via OpenAI-compatible provider) and injects user context (location, subscription tier, current datetime) for personalized responses. Responses are streamed in real-time via `createAgentUIStreamResponse`.

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Deploy!

3. **Configure Clerk**

In Clerk Dashboard, add your production URLs:
- Add `https://your-app.vercel.app` to allowed origins
- Update redirect URLs for sign-in/sign-up

4. **Configure Sanity CORS**

```bash
npx sanity cors add https://your-app.vercel.app --credentials
```

---

## 📚 Project Structure

```
ai-fitpass/
├── app/
│   ├── (main)/           # Public authenticated pages
│   │   ├── classes/      # Class browsing & search
│   │   ├── bookings/     # User bookings & calendar
│   │   ├── profile/      # User profile
│   │   ├── onboarding/   # Location & preferences setup
│   │   └── upgrade/      # Subscription plan upgrade
│   ├── (admin)/          # Admin panel
│   │   └── admin/
│   │       ├── activities/  # Activity (class template) management
│   │       └── venues/      # Venue management
│   ├── api/chat/         # AI chat API endpoint
│   └── studio/           # Sanity Studio
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── app/              # Application components
│   │   ├── bookings/
│   │   ├── chat/
│   │   ├── classes/
│   │   ├── layout/
│   │   ├── maps/
│   │   └── onboarding/
│   └── admin/            # Admin panel components
├── lib/
│   ├── actions/          # Server Actions
│   ├── ai/               # AI agent + tools
│   ├── constants/        # Subscription tiers, statuses
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   └── utils/            # Distance, formatting utilities
├── sanity/
│   ├── schemaTypes/      # Sanity document schemas
│   └── lib/queries/      # GROQ queries
└── public/
```

---

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

### You CAN:
- ✅ Use this code for **personal projects**
- ✅ Use this code for **learning and education**
- ✅ Modify and adapt the code
- ✅ Share with attribution

### You CANNOT:
- ❌ Use this code for **commercial purposes** without permission
- ❌ Sell this code or derivatives
- ❌ Remove attribution/credits

---

## 🙏 Acknowledgments

Built with inspiration from modern web development patterns.

- [Next.js](https://nextjs.org/) — The React framework
- [Sanity](https://www.sanity.io/) — Structured content platform
- [Clerk](https://clerk.com/) — Authentication and billing
- [Vercel AI SDK](https://vercel.com/ai) — AI integration
- [Leaflet](https://leafletjs.com/) — Interactive maps
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [Zod](https://zod.dev/) — Schema validation
- [Lucide](https://lucide.dev/) — Icons
