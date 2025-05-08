import { NextResponse } from 'next/server';
import { lineClient, createGameStartMessage } from '@/lib/line/client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const message = event.message.text;
        
        if (message === 'オセロ') {
          const gameId = uuidv4();
          await lineClient.replyMessage(event.replyToken, [createGameStartMessage(gameId)]);
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
} 