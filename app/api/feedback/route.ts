import { getDb } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import type { FeedbackPayload } from '@/types/feedback';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as FeedbackPayload;

    const { name, message, rating } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    await getDb().collection('feedback').add({
      name: name?.trim() || 'Anonymous',
      message: message.trim(),
      rating,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save feedback.' }, { status: 500 });
  }
}
