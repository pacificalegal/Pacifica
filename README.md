# Pacifica Legal Insurance

Production Next.js application for Pacifica Legal Insurance.

## Vercel setup

1. Upload this project to the `pacificalegal/Pacifica` repository.
2. Add every value from `.env.example` in Vercel Project Settings → Environment Variables.
3. In Stripe, create a recurring monthly price of $50 and use its Price ID for `STRIPE_PRICE_ID`.
4. Set `NEXT_PUBLIC_APP_URL` to the final Vercel or custom-domain URL.
5. Redeploy after environment variables are saved.

Never commit secret keys to GitHub.
