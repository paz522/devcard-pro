import { NextRequest } from 'next/server';

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

// エラー型ガード関数
function isError(err: unknown): err is Error {
  return err instanceof Error;
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
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': 'DevCard.Pro Premium Report',
      'line_items[0][price_data][product_data][description]': `5-page technical analysis report for ${params.username}`,
      'line_items[0][price_data][unit_amount]': '500',
      'line_items[0][quantity]': '1',
      mode: 'payment',
      success_url: `${params.origin}/success?session_id={CHECKOUT_SESSION_ID}&username=${params.username}`,
      cancel_url: `${params.origin}/`,
      'metadata[username]': params.username,
      'metadata[product]': 'premium_report',
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

  // 成功レスポンスの処理
  const responseText = await response.text();

  // レスポンスが空の場合
  if (!responseText || responseText.trim() === '') {
    console.error('[Stripe API Error]: Empty response received');
    throw new Error('Stripe API returned empty response');
  }

  // JSON パースの試行
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    console.error('[Stripe API Error]: Invalid JSON response');
    console.error('[Stripe API Raw Response]:', responseText);
    throw new Error(`Invalid JSON from Stripe API: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }

  return data;
}

export async function POST(request: NextRequest) {
  // テストレスポンス（一時的）
  return new Response(
    JSON.stringify({ test: true }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const origin = request.headers.get('origin') || '';

    console.log('[Stripe] Creating session for:', username);

    // Stripe API を直接呼び出し
    const session = await createCheckoutSession({ username, origin });

    console.log('[Stripe] Session created:', session.id);
    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    // 詳細なエラーログを出力
    const errorMessage = isError(err) ? (err as Error).message : String(err);
    const errorStack = isError(err) ? (err as Error).stack ?? 'No stack trace' : 'No stack trace';

    console.error('[Stripe Error]: %s', errorMessage);
    console.error('[Stack]: %s', errorStack);
    console.log('[ENV CHECK] STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);

    // エラー情報を構築
    const errorInfo = {
      error: errorMessage,
      stack: errorStack,
      env: {
        STRIPE_SECRET_KEY_exists: !!process.env.STRIPE_SECRET_KEY,
      },
      timestamp: new Date().toISOString(),
    };

    // 環境変数エラーの場合は分かりやすいメッセージを追加
    if (errorInfo.error.includes('STRIPE_SECRET_KEY')) {
      errorInfo.error = 'Stripe configuration error. Please check environment variables.';
    }

    // 詳細な JSON レスポンスを返す
    return new Response(
      JSON.stringify(errorInfo),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
