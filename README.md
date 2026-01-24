# Portfolio

A modern, high-performance portfolio website built with Next.js 15 and React 19.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form + Zod
- **Theming:** next-themes

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── common/             # Shared components
│   │   └── preloader.tsx   # Site preloader animation
│   ├── layout/             # Layout components
│   │   ├── navbar.tsx      # Navigation bar
│   │   └── footer.tsx      # Footer
│   ├── providers/          # Context providers
│   │   └── theme-provider.tsx
│   ├── sections/           # Page sections
│   │   ├── hero.tsx
│   │   ├── projects.tsx
│   │   ├── experience.tsx
│   │   ├── tech-stack.tsx
│   │   └── contact.tsx
│   └── ui/                 # UI primitives (Radix-based)
├── config/                 # Site configuration
│   ├── site.ts             # Site metadata & settings
│   └── navigation.ts       # Navigation links
├── data/                   # Static data
│   ├── projects.ts
│   ├── experiences.ts
│   └── tech-stack.ts
├── lib/                    # Utilities & helpers
│   ├── utils.ts            # General utilities
│   ├── validations.ts      # Zod schemas
│   └── animations.ts       # Framer Motion variants
└── types/                  # TypeScript definitions
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Configuration

### Site Settings

Edit `src/config/site.ts` to update:
- Name and title
- Contact information
- Social links
- Author statistics

### Content

Update data files in `src/data/` to modify:
- Projects (`projects.ts`)
- Work experience (`experiences.ts`)
- Tech stack (`tech-stack.ts`)

### Styling

- Global styles: `src/app/globals.css`
- Theme colors: CSS variables in globals.css

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Deploy

### Other Platforms

Build the project and deploy the `.next` folder:

```bash
pnpm build
```

## Backend Integration

This project is structured for easy backend integration:

### API Routes

Add API routes in `src/app/api/`:

```
src/app/api/
├── contact/
│   └── route.ts    # Contact form submission
└── projects/
    └── route.ts    # Projects API
```

### Database

1. Install your preferred ORM (Prisma, Drizzle)
2. Add database schemas in `src/db/`
3. Create server actions in `src/actions/`

### Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL=

# Email (for contact form)
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=
```

## License

MIT
