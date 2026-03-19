import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 環境変数のチェック（デバッグ用）
console.log('[ENV CHECK]', !!process.env.STRIPE_SECRET_KEY);

// Stripe API キーは環境変数から取得
function getStripeKey(): string {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  
  return stripeKey;
}

// Stripe API を直接呼び出す（Edge Runtime 対応）
async function createCheckoutSession(params: {
  username: string;
  origin: string;
}): Promise<{ url: string; id: string }> {
  const stripeKey = getStripeKey();

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      payment_method_types: 'card',
      line_items: JSON.stringify([{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'DevCard.Pro Premium Report',
            description: `5-page technical analysis report for ${params.username}`,
          },
          unit_amount: '500', // $5.00
        },
        quantity: '1',
      }]),
      mode: 'payment',
      success_url: `${params.origin}/success?session_id={CHECKOUT_SESSION_ID}&username=${params.username}`,
      cancel_url: `${params.origin}/`,
      metadata: JSON.stringify({
        username: params.username,
        product: 'premium_report',
      }),
    }),
  });

  if (!response.ok) {
    // エラーレスポンスをそのままログ出力
    const errorText = await response.text();
    console.error('[Stripe API Error Response]:', errorText);
    
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { error: { message: errorText } };
    }
    
    throw new Error(error.error?.message || 'Failed to create checkout session');
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || '';
    
    console.log('[Stripe] Creating session for:', username);

    // Stripe API を直接呼び出し
    const session = await createCheckoutSession({ username, origin });

    console.log('[Stripe] Session created:', session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('[Stripe Error]:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    
    // 環境変数エラーの場合は分かりやすいメッセージを返す
    if (errorMessage.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { error: 'Stripe configuration error. Please check environment variables.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Stripe error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
