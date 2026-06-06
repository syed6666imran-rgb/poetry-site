# Letters to My Love 💌

A premium romantic poetry website built with Next.js 15, MongoDB, and Cloudinary.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your values:

```bash
# MongoDB — local or Atlas
MONGODB_URI=mongodb://localhost:27017/letters-to-my-love

# JWT secret (generate a long random string)
JWT_SECRET=your-super-secret-key-at-least-32-chars

# Admin credentials (used by the seed script)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password

# Cloudinary (free tier is fine)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Private letter unlock key
PRIVATE_LETTER_KEY=mylove

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed the database

Creates the admin user and 5 sample poems:

```bash
npm run seed
```

### 4. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Public homepage
│   ├── layout.tsx                # Root layout + fonts
│   ├── globals.css               # Design tokens + base styles
│   ├── admin/
│   │   ├── login/page.tsx        # Admin login
│   │   ├── dashboard/page.tsx    # Stats dashboard
│   │   ├── poems/page.tsx        # CRUD poems
│   │   ├── notes/page.tsx        # Moderate visitor notes
│   │   └── gallery/page.tsx      # Upload & manage photos
│   └── api/
│       ├── auth/login/           # POST — login, sets JWT cookie
│       ├── auth/logout/          # POST — clears cookie
│       ├── poems/                # GET list, POST create
│       ├── poems/[id]/           # GET, PATCH, DELETE
│       ├── poems/[id]/favourite/ # POST — increment count
│       ├── notes/                # GET list, POST create
│       ├── notes/[id]/           # PATCH status, DELETE
│       ├── photos/               # GET list, POST upload
│       ├── photos/[id]/          # PATCH caption, DELETE
│       └── stats/                # GET dashboard stats
├── components/
│   ├── admin/
│   │   └── AdminShell.tsx        # Sidebar layout for all admin pages
│   ├── effects/
│   │   ├── EnvelopeIntro.tsx     # Opening envelope animation
│   │   └── FloatingEffects.tsx   # Petals + cursor sparkle
│   ├── poems/
│   │   ├── HeroSection.tsx       # Full-screen hero with stars/moon
│   │   ├── QuoteSection.tsx      # Daily rotating love quote
│   │   ├── FeaturedPoem.tsx      # Glassmorphism featured poem card
│   │   ├── PoemModal.tsx         # Reading mode modal + progress bar
│   │   ├── PoetryLibrary.tsx     # Searchable, filterable poem grid
│   │   ├── StoryTimeline.tsx     # Our Story timeline
│   │   ├── LoveNotes.tsx         # Anonymous note wall
│   │   ├── PhotoGallery.tsx      # Masonry gallery + lightbox
│   │   └── PrivateLetter.tsx     # Secret key unlock modal
│   └── ui/
│       ├── SiteNav.tsx           # Sticky navigation
│       ├── MusicPlayer.tsx       # Fixed music player (add your audio)
│       └── SiteFooter.tsx
├── lib/
│   ├── mongodb.ts                # Mongoose connection
│   ├── auth.ts                   # JWT sign/verify
│   ├── cloudinary.ts             # Image upload/delete
│   ├── utils.ts                  # Helpers, categories, quotes
│   └── models/
│       ├── Poem.ts
│       ├── Note.ts
│       ├── Photo.ts
│       └── Admin.ts
├── middleware.ts                 # Protects /admin/* routes
└── types/index.ts                # Shared TypeScript types
```

---

## Admin Panel

Log in at `/admin/login` then:

| Page | What you can do |
|---|---|
| **Dashboard** | View total poems, views, favourites, photos, pending notes; category bar chart |
| **Poems** | Add, edit, delete poems; set featured poem; toggle private/public |
| **Notes** | Approve, reject, or delete visitor notes |
| **Gallery** | Upload photos to Cloudinary, add captions, delete images |

---

## Private Letter Mode

Visitors can click **Private ♥** in the navigation to enter a secret key. Valid keys are configured in `.env.local` as `PRIVATE_LETTER_KEY`, and poems marked `isPrivate: true` in the database are only returned to authenticated admins.

Client-side default keys (for demo): `mylove`, `foryou`, `always`

---

## Adding Background Music

In `src/components/ui/MusicPlayer.tsx`, uncomment and configure:

```typescript
const audio = new Audio('/music/reverie.mp3')
// Place your file in the /public/music/ directory
```

---

## Deployment (Vercel)

```bash
npm run build
# Then deploy to Vercel — connect your GitHub repo in the dashboard
# Add all .env.local variables to Vercel → Settings → Environment Variables
```

MongoDB Atlas free tier + Cloudinary free tier work perfectly for this project.

---

## Customising Poems & Story

- **Poems**: Add via the Admin panel or `npm run seed`
- **Timeline milestones**: Edit `src/components/poems/StoryTimeline.tsx` (hardcoded array, easy to move to DB)
- **Daily quotes**: Edit `DAILY_QUOTES` in `src/lib/utils.ts`
- **Private poem text**: Edit `SECRET_POEM` in `src/components/poems/PrivateLetter.tsx`

---

*Made with love. 💌*
