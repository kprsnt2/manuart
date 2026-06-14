import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 30;

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    default: return 'image/jpeg';
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { drawingDescription, drawingPath, action } = body;

  if (!drawingDescription && !drawingPath) {
    return new Response(JSON.stringify({ error: 'Drawing description or path is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let systemPrompt = '';
  let userPrompt = '';

  switch (action) {
    case 'story':
      systemPrompt = `You are a magical storyteller for children. When given a child's drawing (and/or its description), create a short, enchanting story (3-4 paragraphs) inspired by the artwork. Use playful language, fun characters, and a happy ending. Keep it age-appropriate and magical. Use a few emojis naturally.`;
      userPrompt = drawingDescription 
        ? `Create a magical story inspired by this drawing description: ${drawingDescription}`
        : `Create a magical story inspired by this drawing.`;
      break;
    case 'critique':
      systemPrompt = `You are a warm, encouraging art teacher for young children. When given a child's drawing (and/or its description), provide a fun, positive, and constructive "art review". Praise specific elements (like lines, shapes, subject, expression), suggest fun things to try next, and be very encouraging. Never criticize — only celebrate and suggest. Use a fun, kid-friendly tone with emojis.`;
      userPrompt = drawingDescription
        ? `Give a fun art review for this drawing description: ${drawingDescription}`
        : `Give a fun art review for this drawing.`;
      break;
    case 'suggest':
      systemPrompt = `You are a creative art mentor for kids. Based on the drawing (and/or description) provided, suggest 3-5 fun new things the young artist could try drawing next. Make each suggestion exciting and imaginative. Include what colors and styles they might enjoy. Be playful and encouraging!`;
      userPrompt = drawingDescription
        ? `Based on this drawing description, suggest what to draw next: ${drawingDescription}`
        : `Based on this drawing, suggest what to draw next.`;
      break;
    default:
      systemPrompt = `You are a fun, warm AI art assistant for a children's art blog called "Manu's Art World". Provide a delightful description and analysis of the drawing, pointing out creative elements and imagination. Be encouraging and playful!`;
      userPrompt = drawingDescription
        ? `Describe and analyze this drawing description: ${drawingDescription}`
        : `Describe and analyze this drawing.`;
  }

  const promptParts: any[] = [{ type: 'text', text: userPrompt }];

  if (drawingPath) {
    const relativePath = drawingPath.startsWith('/') ? drawingPath.slice(1) : drawingPath;
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath);
      const mimeType = getMimeType(fullPath);
      promptParts.push({
        type: 'image',
        image: fileBuffer,
        mimeType: mimeType
      });
    }
  }

  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: promptParts
      }
    ]
  });

  return (result as any).toDataStreamResponse();
}
