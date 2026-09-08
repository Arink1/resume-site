# arinkarabulut.com

Personal portfolio for Arin Karabulut, full-stack web developer. Live at
[arinkarabulut.com](https://www.arinkarabulut.com).

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS 4
- Resend for the contact form
- Claude API for the Brand Forge demo (`/demos/brand-forge`)
- Vercel for hosting and analytics

## How content works

There is no CMS. Everything on the page is typed data in
[`src/lib/content.ts`](src/lib/content.ts): profile, projects, skills, and
experience. Identity and links (name, email, GitHub, LinkedIn, resume path)
live in [`src/lib/site.ts`](src/lib/site.ts). Edit, commit, deploy.

Each project can carry:

- `live_url` and `github_url` for the action buttons
- `iframe_url` for the scroll-linked live preview on the home page and the
  detail page (falls back to `image_url` when a site blocks embedding)
- `image_url` plus `images[]` for the gallery
- `features`, `compliance`, and `security_features` lists
- `code_snippet` and `code_language` to render source on the detail page

Project screenshots live in `public/projects/<slug>/`. The resume PDF is served
from `public/Arin_Karabulut_Resume.pdf`.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, about, projects, skills, experience, contact |
| `/projects/[id]` | Project detail with live preview, gallery, and features |
| `/demos/brand-forge` | Interactive Brand Forge demo backed by the Claude API |
| `/api/contact` | Contact form handler (validates, escapes, sends via Resend) |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Generated |

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY and ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Name | Used by |
| --- | --- |
| `RESEND_API_KEY` | `/api/contact` |
| `CONTACT_TO_EMAIL` | Where contact messages are delivered (optional, has a default) |
| `CONTACT_FROM_EMAIL` | Sender shown on contact emails (optional, has a default) |
| `ANTHROPIC_API_KEY` | Brand Forge demo |

## Deploy

The project is linked to Vercel. `vercel --prod` from the repo root deploys
production.
