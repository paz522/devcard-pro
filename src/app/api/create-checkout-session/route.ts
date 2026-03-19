import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }

    // origin から URL を構築
    let origin = request.nextUrl.origin;
    
    // Cloudflare/OpenNext 環境で origin が localhost や IP の場合に http:// が付いているか確認
    if (origin && !origin.startsWith('http')) {
      origin = `http://${origin}`;
    }
    
    // フォールバック
    if (!origin || origin === 'null') {
      origin = 'http://localhost:3000';
    }

    const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}&username=${username}`;
    const cancelUrl = `${origin}/`;

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': 'DevCard.Pro Premium Report',
        'line_items[0][price_data][product_data][description]': `5-page technical analysis report for ${username}`,
        'line_items[0][price_data][unit_amount]': '500',
        'line_items[0][quantity]': '1',
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        'metadata[username]': username,
        'metadata[product]': 'premium_report',
      }),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('[Stripe API Error]:', errorText);
      return NextResponse.json({ 
        error: 'Failed to create checkout session',
        details: errorText 
      }, { status: stripeResponse.status });
    }

    const session = await stripeResponse.json();
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (err) {
    console.error('[API Error]:', err instanceof Error ? err.message : err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 });
  }
}
