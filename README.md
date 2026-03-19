This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production Setup

- Switched to production Stripe keys

## Deploy on Cloudflare Pages

This project is configured for Cloudflare Pages deployment using `@cloudflare/next-on-pages`.

### Option 1: GitHub Actions (Recommended)

This project includes a GitHub Actions workflow for automatic deployment.

1. **Set up Cloudflare secrets in GitHub:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. **Set up environment variables in Cloudflare Pages:**
   - Go to Cloudflare Dashboard → Pages → devcard-pro → Settings → Environment variables
   - Add the following variables:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
     - `NEXT_PUBLIC_GITHUB_TOKEN`

3. **Push to master branch:**
   - Every push to `master` will automatically deploy to Cloudflare Pages

### Option 2: Manual Deploy (Requires Linux/WSL)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Set environment variables
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-api-token"

# Build and deploy
npm run deploy
```

### Option 3: Vercel (Alternative)

For simpler deployment, you can use Vercel:

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel deploy`
3. Set environment variables in Vercel dashboard

## Production Setup

## Migrated from Vercel to Cloudflare Pages (3/19)

- Switched to production Stripe keys
- 3/16 Add a Tokushoho page.
- GitHub Actions configured for Cloudflare Pages auto-deploy
