# Before I Buy

A cooling-off ledger for impulse purchases. Log the urge, let the community
weigh in, and let time do the deciding — before your money does.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and
**lucide-react**. No backend, no external API, no auth — everything runs on
in-memory React state, pre-populated with realistic mock data so the app is
alive the moment it loads.

## Features

- **Global ledger header** — animated, tabular-numeral stat strip showing
  Total Delayed Spent, Total Money Saved, and Active Cooling-Off Items.
- **Delay a Purchase** — expandable form to log a product name, URL, price,
  category, cooling-off period (24h–30 days), and a required "rationalization
  note."
- **Intent-to-Buy Registry** — responsive card grid with a live countdown
  ring, remaining-time label, and a community sentiment bar (Buy vs. Don't
  Buy) per item.
- **Detail drawer** — click any card to open a full breakdown:
  - Vote **Buy** / **Don't Buy**, optionally tagging objections (Hype Train,
    Overpriced, You already own this, Hidden Fees, etc.)
  - Browse and submit **crowdsourced alternatives** (cheaper links, DIY
    options, or "I'll lend you mine" offers)
  - Resolve the item: **"I Grew"** (triggers a confetti burst, moves the item
    to the Saved Archive, and updates the global ledger) or **"I Blew It"**
    (requires selecting a reason, moves the item to the archive as a
    recorded loss). Resolving before the timer completes is still possible,
    but shows an explicit friction warning first.
- **Archive tab** — permanent ledger of every resolved item, saved or bought,
  with the reason and dollar impact.

## Getting started locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

This is a stock Next.js App Router project — Vercel detects it automatically.

1. Push this folder to a new GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repo, and click
   **Deploy**. No environment variables or extra configuration are required.
3. Every push to your default branch redeploys automatically.

Or deploy straight from your machine:

```bash
npm install -g vercel
vercel
```

## Project structure

```
app/
  layout.tsx        Root layout, font loading (Fraunces / Inter / IBM Plex Mono)
  page.tsx           Top-level state + wiring for every interactive feature
  globals.css         Tailwind layers, ledger/receipt styling, focus states
components/
  StatsLedger.tsx      Animated global stats strip
  AddPurchaseForm.tsx  "Delay a purchase" intent form
  Registry.tsx         Grid of active cooling-off items
  ItemCard.tsx          Single registry card (countdown ring + sentiment bar)
  ProgressRing.tsx      Reusable SVG countdown ring
  SentimentBar.tsx     Reusable Buy vs. Don't Buy split bar
  DetailDrawer.tsx     Voting, alternatives, and resolution flows
  Archive.tsx           Resolved-items ledger list
  Confetti.tsx           CSS-only confetti burst
  Toast.tsx               Lightweight notification
lib/
  types.ts             Shared TypeScript types
  utils.ts              Formatting, countdown math, sentiment math, constants
  categoryMeta.ts    Category → icon/color mapping
  mockData.ts          Seed data (4 active items + 2 archived)
```

## Notes

- All data lives in React state for the session only; refreshing the page
  resets it to the seeded mock data. Swapping in `localStorage` or a real
  backend only requires changing the `useState` calls in `app/page.tsx`.
- Colors, type, and motion follow a "financial ledger" design language:
  sage green for money saved, coral for financial friction/risk, and
  monospaced tabular numerals for every dollar figure and countdown.
