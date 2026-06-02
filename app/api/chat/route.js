import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "./knowledge";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 800,
      temperature: 0.4,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return Response.json({ error: "No response from AI" }, { status: 500 });
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    return Response.json(
      { error: "AI service unavailable. Please try again." },
      { status: 500 }
    );
  }
}
