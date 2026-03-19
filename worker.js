/**
 * Cloudflare Workers Stripe Checkout API
 * 
 * 環境変数:
 * - STRIPE_SECRET_KEY: Stripe シークレットキー
 * 
 * 使用方法:
 * POST /api/checkout
 * Content-Type: application/json
 * Body: { "username": "user123" }
 */

export default {
  async fetch(request, env, ctx) {
    // CORS ヘッダー
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // OPTIONS リクエスト（CORS プリフライト）
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // POST リクエストのみ処理
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    try {
      // リクエストボディをパース
      const { username } = await request.json();

      if (!username) {
        return new Response(
          JSON.stringify({ error: 'Username is required' }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      // Stripe API キーのチェック
      if (!env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY is not configured');
        return new Response(
          JSON.stringify({ error: 'Stripe configuration error' }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      // Stripe Checkout Session を作成
      // origin から URL を構築（スキームを含む）
      const origin = request.headers.get('origin') || 'https://devcard-pro.vercel.app';
      const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}&username=${username}`;
      const cancelUrl = `${origin}/`;

      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          payment_method_types: 'card',
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

      // Stripe API エラーハンドリング
      if (!stripeResponse.ok) {
        const errorText = await stripeResponse.text();
        console.error('[Stripe API Error]:', errorText);

        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: { message: errorText } };
        }

        return new Response(
          JSON.stringify({
            error: error.error?.message || 'Failed to create checkout session',
            details: errorText,
          }),
          {
            status: stripeResponse.status,
            headers: corsHeaders,
          }
        );
      }

      // 成功レスポンス
      const session = await stripeResponse.json();
      console.log('[Stripe] Session created:', session.id);

      return new Response(
        JSON.stringify({
          sessionId: session.id,
          url: session.url,
        }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );

    } catch (err) {
      console.error('[Worker Error]:', err instanceof Error ? err.message : err);

      return new Response(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  },
};
