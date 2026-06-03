import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './knowledge';

let groq;

function getGroq() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ message: 'Invalid request.' }, { status: 400 });
    }

    const cleaned = messages
      .filter((m) => m && typeof m === 'object')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: typeof m.content === 'string' ? m.content : String(m.content ?? ''),
      }))
      .filter((m) => m.content.trim().length > 0);

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...cleaned],
      temperature: 0.4,
      max_tokens: 800,
    });

    const message =
      completion.choices?.[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a response. Please try again.';

    return Response.json({ message });
  } catch (error) {
    console.error('Chat API error:', error?.message ?? error);

    if (error?.status === 401) {
      return Response.json({ message: 'API key error. Please contact support.' }, { status: 500 });
    }
    if (error?.status === 429) {
      return Response.json({ message: 'Too many requests. Please wait a moment and try again.' }, { status: 429 });
    }

    return Response.json(
      { message: 'Something went wrong. Try again or contact KNDI: 📞 +254 0112 514 865' },
      { status: 500 }
    );
  }
}
