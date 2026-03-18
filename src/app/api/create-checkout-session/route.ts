import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'edge';

const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log('[Stripe] Key exists:', !!stripeKey);
console.log('[Stripe] Key length:', stripeKey?.length);

const stripe = new Stripe(stripeKey!, {
  apiVersion: '2026-02-25.clover' as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    console.log('[Stripe] Creating session for:', username);

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DevCard.Pro Premium Report',
              description: '5-page technical analysis report for ' + username,
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&username=${username}`,
      cancel_url: `${request.headers.get('origin')}/`,
      metadata: {
        username: username,
        product: 'premium_report',
      },
    });

    console.log('[Stripe] Session created:', session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('[Stripe Error]:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Stripe error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
