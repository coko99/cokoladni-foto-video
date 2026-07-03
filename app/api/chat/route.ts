import { NextResponse } from "next/server";
import {
  buildCokoladniAgentSystemPrompt,
  type ApiChatMessage,
} from "@/lib/cokoladni-agent";
import { getBotResponse } from "@/lib/chatbot";

export const runtime = "nodejs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function GET() {
  return NextResponse.json({
    configured: Boolean(OPENAI_API_KEY),
    assistantMode: Boolean(OPENAI_ASSISTANT_ID),
    agent: "cokoladni-agent",
  });
}

async function runAssistantChat(
  threadId: string | undefined,
  userMessage: string
): Promise<{ message: string; threadId: string }> {
  const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
    "OpenAI-Beta": "assistants=v2",
  };

  let activeThreadId = threadId;

  if (!activeThreadId) {
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });
    if (!threadRes.ok) throw new Error("Ne mogu da kreiram thread");
    const thread = (await threadRes.json()) as { id: string };
    activeThreadId = thread.id;
  }

  const msgRes = await fetch(
    `https://api.openai.com/v1/threads/${activeThreadId}/messages`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ role: "user", content: userMessage }),
    }
  );
  if (!msgRes.ok) throw new Error("Ne mogu da pošaljem poruku");

  const runRes = await fetch(
    `https://api.openai.com/v1/threads/${activeThreadId}/runs`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    }
  );
  if (!runRes.ok) throw new Error("Ne mogu da pokrenem asistenta");
  const run = (await runRes.json()) as { id: string };

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 800));
    const statusRes = await fetch(
      `https://api.openai.com/v1/threads/${activeThreadId}/runs/${run.id}`,
      { headers }
    );
    const status = (await statusRes.json()) as {
      status: string;
    };
    if (status.status === "completed") break;
    if (status.status === "failed" || status.status === "cancelled") {
      throw new Error("Asistent nije uspeo da odgovori");
    }
  }

  const listRes = await fetch(
    `https://api.openai.com/v1/threads/${activeThreadId}/messages?limit=1&order=desc`,
    { headers }
  );
  const list = (await listRes.json()) as {
    data: { role: string; content: { type: string; text?: { value: string } }[] }[];
  };
  const assistantMsg = list.data.find((m) => m.role === "assistant");
  const text =
    assistantMsg?.content.find((c) => c.type === "text")?.text?.value ??
    "Izvinite, nisam uspeo da generišem odgovor.";

  return { message: text, threadId: activeThreadId };
}

async function runCompletionChat(
  messages: ApiChatMessage[]
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        { role: "system", content: buildCokoladniAgentSystemPrompt() },
        ...messages.slice(-12),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "OpenAI greška");
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return (
    data.choices[0]?.message?.content?.trim() ??
    "Izvinite, nisam uspeo da generišem odgovor."
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: ApiChatMessage[];
      message?: string;
      threadId?: string;
    };

    const lastUserMessage =
      body.message ??
      [...(body.messages ?? [])].reverse().find((m) => m.role === "user")
        ?.content;

    if (!lastUserMessage?.trim()) {
      return NextResponse.json(
        { error: "Poruka je prazna" },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      const fallback = getBotResponse(lastUserMessage);
      return NextResponse.json({
        message: fallback.text,
        links: fallback.links,
        fallback: true,
      });
    }

    if (OPENAI_ASSISTANT_ID) {
      const result = await runAssistantChat(body.threadId, lastUserMessage);
      return NextResponse.json({
        message: result.message,
        threadId: result.threadId,
        agent: "cokoladni-agent",
      });
    }

    const history = body.messages ?? [{ role: "user", content: lastUserMessage }];
    const message = await runCompletionChat(history);

    return NextResponse.json({
      message,
      agent: "cokoladni-agent",
    });
  } catch (error) {
    console.error("[chat]", error);
    const fallback = getBotResponse("fallback");
    return NextResponse.json({
      message:
        "Trenutno ne mogu da se povežem sa AI agentom. " + fallback.text,
      links: fallback.links,
      fallback: true,
    });
  }
}
