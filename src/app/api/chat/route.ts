import { google } from '@ai-sdk/google';
import { streamText, stepCountIs, convertToModelMessages } from 'ai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Load blog content at module level so it's cached between requests
function loadBlogContext(): string {
  const contentDir = path.join(process.cwd(), 'content');
  const sections: string[] = [];

  try {
    const profile = JSON.parse(fs.readFileSync(path.join(contentDir, 'profile.json'), 'utf8'));
    sections.push(`## About Manu
- Full name: ${profile.name}
- Tagline: "${profile.tagline}"
- About: ${profile.about}
- Birthday: ${profile.birthday} (born March 25, 2019)
- Blog created by: ${profile.createdBy}
- Favorite things: ${profile.favorites.map((f: { emoji: string; label: string }) => `${f.emoji} ${f.label}`).join(', ')}`);
  } catch { /* skip if missing */ }

  try {
    const timeline = JSON.parse(fs.readFileSync(path.join(contentDir, 'timeline.json'), 'utf8'));
    const events = timeline.map((e: { date: string; title: string; description: string }) =>
      `- ${e.date}: ${e.title} — ${e.description}`
    ).join('\n');
    sections.push(`## Life Timeline\n${events}`);
  } catch { /* skip */ }

  try {
    const askManu = JSON.parse(fs.readFileSync(path.join(contentDir, 'ask-nanu.json'), 'utf8'));
    const qaParts: string[] = [];
    for (const [year, data] of Object.entries(askManu.answers)) {
      const yearData = data as { age: number; responses: string[] };
      const qa = askManu.questions.map((q: string, i: number) =>
        `  Q: ${q}\n  A: ${yearData.responses[i]}`
      ).join('\n');
      qaParts.push(`### Age ${yearData.age} (${year}):\n${qa}`);
    }
    sections.push(`## Manu's Q&A Responses\n${qaParts.join('\n')}`);
  } catch { /* skip */ }

  try {
    const letters = JSON.parse(fs.readFileSync(path.join(contentDir, 'letters.json'), 'utf8'));
    const letterText = letters.map((l: { targetAge: number; title: string; content: string }) =>
      `- Letter for age ${l.targetAge} ("${l.title}"): ${l.content}`
    ).join('\n');
    sections.push(`## Time-Capsule Letters\n${letterText}`);
  } catch { /* skip */ }

  // Load blog posts for additional context
  try {
    const blogsDir = path.join(contentDir, 'blogs');
    if (fs.existsSync(blogsDir)) {
      const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md') && !f.endsWith('_te.md'));
      const blogSummaries = blogFiles.map(file => {
        const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
        const titleMatch = content.match(/title:\s*"([^"]+)"/);
        const excerptMatch = content.match(/excerpt:\s*"([^"]+)"/);
        return `- ${titleMatch?.[1] || file}: ${excerptMatch?.[1] || ''}`;
      }).join('\n');
      sections.push(`## Blog Posts / Art Stories\n${blogSummaries}`);
    }
  } catch { /* skip */ }

  return sections.join('\n\n');
}

const blogContext = loadBlogContext();

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { messages } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Payload must contain a "messages" array.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Convert UIMessages (parts format) from the frontend to ModelMessages (content format) for streamText
  const modelMessages = await convertToModelMessages(messages).catch(() => messages);

  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    system: `You are the friendly, warm AI assistant for "Manu's Art World" — a digital art showcase blog for a young artist named Manu.

Your personality: enthusiastic about art, playful, family-friendly, and encouraging. Use emojis sparingly but naturally. Keep answers concise but informative.

IMPORTANT RULES:
1. Answer questions about Manu using ONLY the factual data below. Never invent facts not present in the data.
2. If asked something not covered in the data, say so honestly and suggest they check the blog.
3. If the user wants to send a message, feedback, or contact info, ALWAYS use the \`sendUserData\` tool.
4. Never share sensitive information or make up personal details beyond what's provided.
5. Be age-appropriate — this is a family blog about a child's art journey.
6. When talking about Manu's art, be enthusiastic and encouraging!
7. You can suggest checking out the AI Art Studio (/ai-studio) for AI-powered art features.

---
# MANU'S ART WORLD — KNOWLEDGE BASE

${blogContext}
---`,
    messages: modelMessages,
    tools: {
      sendUserData: {
        description: 'Sends a name, message, and optional email so the family can read it. Use this whenever someone wants to leave feedback, send a message, or share their contact info.',
        parameters: z.object({
          name: z.string().describe('The name of the person leaving the message.'),
          email: z.string().email().optional().describe('Their email address, if provided.'),
          message: z.string().describe('The actual message or feedback about Manu / her art.'),
        }),
        execute: async ({ name, email, message }: { name: string; email?: string; message: string }) => {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
              || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
            const res = await fetch(`${baseUrl}/api/data`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, message, source: 'ai-agent' }),
            });
            if (res.ok) {
              return { success: true, detail: `Message from ${name} has been delivered! 💌` };
            }
            return { success: false, detail: 'The endpoint returned an error. Please try again.' };
          } catch {
            return { success: false, detail: 'Could not reach the data endpoint.' };
          }
        },
      },
    } as any,
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
