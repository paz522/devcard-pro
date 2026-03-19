import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return new Response(
    JSON.stringify({ test: true }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
