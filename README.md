# PickProof

A Next.js affiliate recommendation website for Amazon Product Advertising API powered buying guides, comparison pages, and deep-dive reviews.

## Pages

- `/` - homepage with hero search, category cards, top recommendations, and trust signals
- `/categories/best-laptops` - hub page with filters, top 3 picks, product feed, score bars, and buying guide
- `/compare/aster-pro-14-vs-nova-lite-13` - side-by-side product comparison with verdict and affiliate CTAs
- `/reviews/aster-pro-14` - deep-dive review with score, pros/cons, testing notes, alternatives, and CTA
- `/search?q=laptop` - Amazon search results page
- `/api/amazon/search?q=laptop` - JSON API route for Amazon search

## Amazon PA-API Setup

Copy `.env.example` to `.env.local` and fill in your Amazon Product Advertising API credentials:

```bash
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=yourtag-20
AMAZON_PARTNER_TYPE=Associates
AMAZON_MARKETPLACE=www.amazon.com
AMAZON_PAAPI_HOST=webservices.amazon.com
AMAZON_PAAPI_REGION=us-east-1
```

When credentials are missing, `/search` and `/api/amazon/search` return mock products so the site can be developed locally.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
