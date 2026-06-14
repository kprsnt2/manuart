import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Code2,
  Database,
  Globe,
  Layers,
  MessageCircle,
  Shield,
  Sparkles,
  Zap,
  ArrowRight,
  Terminal,
  Send,
  Lock,
  Server,
  Cpu,
  Palette,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How We Built This — Manu's Art World Docs",
  description:
    "Technical documentation for Manu's Art World: how the AI chatbot, API endpoints, and blog platform were designed and built.",
};

/* ────────────────────────────── helpers ────────────────────────────── */

function SectionHeading({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center space-y-2 mb-10">
      <div className="text-4xl">{emoji}</div>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-purple-800">
        {title}
      </h2>
      <p className="text-purple-500 max-w-2xl mx-auto text-lg">{subtitle}</p>
    </div>
  );
}

function FlowStep({
  step,
  icon: Icon,
  title,
  description,
  accent = "purple",
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent?: "purple" | "pink" | "amber" | "emerald";
}) {
  const accents = {
    purple: {
      gradient: "from-purple-500 to-purple-600",
      border: "border-purple-200",
      bg: "bg-purple-50",
      icon: "text-purple-600",
    },
    pink: {
      gradient: "from-pink-500 to-pink-600",
      border: "border-pink-200",
      bg: "bg-pink-50",
      icon: "text-pink-600",
    },
    amber: {
      gradient: "from-amber-500 to-amber-600",
      border: "border-amber-200",
      bg: "bg-amber-50",
      icon: "text-amber-600",
    },
    emerald: {
      gradient: "from-emerald-500 to-emerald-600",
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
    },
  };
  const { gradient, border, bg, icon } = accents[accent];

  return (
    <div className="flex gap-4 items-start group">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md text-white font-bold text-sm group-hover:scale-110 transition-transform`}
      >
        {step}
      </div>
      <Card
        className={`flex-1 ${border} ${bg} border shadow-sm hover:shadow-md transition-shadow`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Icon className={`w-4 h-4 ${icon}`} />
            <h4 className="font-bold text-purple-800">{title}</h4>
          </div>
          <p className="text-sm text-purple-700 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function CodeBlock({
  title,
  code,
  language = "typescript",
}: {
  title: string;
  code: string;
  language?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-purple-200 shadow-sm">
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-purple-200 text-xs font-mono ml-2">{title}</span>
        {language && (
          <Badge className="ml-auto text-[10px] bg-purple-700 text-purple-200 border-purple-600">
            {language}
          </Badge>
        )}
      </div>
      <pre className="p-4 bg-purple-950 text-purple-100 text-sm leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TechCard({
  icon: Icon,
  name,
  version,
  role,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  version: string;
  role: string;
  color: string;
}) {
  return (
    <Card className="card-bounce border-purple-100 bg-white shadow-sm hover:border-purple-300 transition-colors">
      <CardContent className="p-4 flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-purple-800">{name}</p>
            <Badge
              variant="outline"
              className="text-[10px] border-purple-200 text-purple-500"
            >
              {version}
            </Badge>
          </div>
          <p className="text-xs text-purple-500 mt-0.5">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────── page ────────────────────────────── */

export default function DocsPage() {
  return (
    <main className="min-h-screen px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-20">
        {/* ──── Hero ──── */}
        <section className="text-center space-y-6 py-4">
          <Badge className="text-sm px-4 py-1.5 bg-purple-100 text-purple-700 border-purple-200">
            <Code2 className="w-3.5 h-3.5 mr-1.5" />
            Developer Documentation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight fun-gradient">
            How We Built This
          </h1>
          <p className="text-xl text-purple-500 max-w-2xl mx-auto">
            A behind-the-scenes look at the tech, AI integrations, and design
            decisions that power Manu&apos;s World.
          </p>
        </section>

        {/* ──── Tech Stack ──── */}
        <section>
          <SectionHeading
            emoji="🛠️"
            title="Tech Stack"
            subtitle="The building blocks behind the magic"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TechCard
              icon={Globe}
              name="Next.js"
              version="16"
              role="Full-stack React framework with App Router"
              color="bg-slate-100 text-slate-700"
            />
            <TechCard
              icon={Layers}
              name="React"
              version="19"
              role="UI components with Server Components"
              color="bg-blue-100 text-blue-700"
            />
            <TechCard
              icon={Palette}
              name="Tailwind CSS"
              version="4"
              role="Utility-first styling with custom tokens"
              color="bg-cyan-100 text-cyan-700"
            />
            <TechCard
              icon={Sparkles}
              name="shadcn/ui"
              version="latest"
              role="Accessible UI primitives (Card, Badge, Button…)"
              color="bg-purple-100 text-purple-700"
            />
            <TechCard
              icon={Cpu}
              name="AI SDK"
              version="6"
              role="Vercel AI SDK — streaming, tool-calling, chat UI"
              color="bg-emerald-100 text-emerald-700"
            />
            <TechCard
              icon={Bot}
              name="Gemini 2.5 Flash Lite"
              version="@ai-sdk/google"
              role="Google's fast, efficient LLM for chat"
              color="bg-amber-100 text-amber-700"
            />
            <TechCard
              icon={Server}
              name="Vercel"
              version="Edge"
              role="Deployment, analytics, serverless functions"
              color="bg-pink-100 text-pink-700"
            />
            <TechCard
              icon={Shield}
              name="Zod"
              version="4"
              role="Runtime schema validation for API safety"
              color="bg-red-100 text-red-700"
            />
          </div>
        </section>

        {/* ──── AI Chatbot ──── */}
        <section>
          <SectionHeading
            emoji="🤖"
            title="AI Chatbot"
            subtitle="How the &quot;Ask About Manu&quot; chat widget works end-to-end"
          />

          {/* Architecture flow */}
          <div className="space-y-4 mb-10">
            <FlowStep
              step={1}
              icon={MessageCircle}
              title="User sends a message"
              description="The chat widget uses AI SDK's useChat() hook with sendMessage(). Messages are stored as UIMessage objects with a 'parts' array containing typed text, tool-call, and tool-result segments."
              accent="purple"
            />
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-purple-300 rotate-90" />
            </div>
            <FlowStep
              step={2}
              icon={Send}
              title="Frontend → POST /api/chat"
              description="The useChat hook serializes the UIMessage[] array and sends it to the backend. Each message carries an id, role ('user' or 'assistant'), and parts array — not a plain 'content' string."
              accent="pink"
            />
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-purple-300 rotate-90" />
            </div>
            <FlowStep
              step={3}
              icon={Zap}
              title="Convert UIMessages → ModelMessages"
              description="The backend calls convertToModelMessages() from the AI SDK to translate the parts-based UIMessage format into the content-based ModelMessage format that streamText() expects. This is a critical step — skipping it causes Zod validation errors."
              accent="amber"
            />
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-purple-300 rotate-90" />
            </div>
            <FlowStep
              step={4}
              icon={Bot}
              title="streamText() → Gemini 2.5 Flash Lite"
              description="The converted messages plus a system prompt (injected with all blog content — profile, timeline, Q&A, letters) are streamed to Gemini via @ai-sdk/google. Tool definitions like sendUserData are registered here too."
              accent="emerald"
            />
            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-purple-300 rotate-90" />
            </div>
            <FlowStep
              step={5}
              icon={MessageCircle}
              title="Stream response back to UI"
              description="The response is returned via toUIMessageStreamResponse() which streams tokens back to the frontend in real-time. The chat widget renders them with typing indicators, auto-scroll, and tool invocation badges."
              accent="purple"
            />
          </div>

          {/* System prompt */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-500" />
              Knowledge Injection
            </h3>
            <p className="text-purple-600 text-sm leading-relaxed">
              At server startup, the API route reads all JSON files from the{" "}
              <code className="px-1.5 py-0.5 bg-purple-100 rounded text-purple-700 text-xs font-mono">
                /content
              </code>{" "}
              directory (profile, timeline, ask-nanu Q&amp;A, letters) and
              compiles them into a rich system prompt. This gives the model
              factual knowledge About Manu without needing a vector database.
            </p>
            <CodeBlock
              title="api/chat/route.ts — Knowledge loading"
              code={`// Load at module level (cached between requests)
const blogContext = loadBlogContext();

// Injected into the system prompt:
system: \`You are the friendly AI assistant for "Manu's Art World"...
---
# KNOWLEDGE BASE
\${blogContext}
---\``}
            />
          </div>

          {/* Tool calling */}
          <div className="space-y-4 mt-10">
            <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Tool Calling — sendUserData
            </h3>
            <p className="text-purple-600 text-sm leading-relaxed">
              When a visitor wants to Send a message, the model
              autonomously invokes the{" "}
              <code className="px-1.5 py-0.5 bg-purple-100 rounded text-purple-700 text-xs font-mono">
                sendUserData
              </code>{" "}
              tool. The tool parameters are validated by Zod, then the data is
              forwarded to{" "}
              <code className="px-1.5 py-0.5 bg-purple-100 rounded text-purple-700 text-xs font-mono">
                POST /api/data
              </code>
              . The chat UI shows a live &quot;Sending to Dad…&quot; indicator
              with a spinner, then a &quot;✓ Message delivered!&quot; badge.
            </p>
            <CodeBlock
              title="Tool definition"
              code={`tools: {
  sendUserData: {
    description: 'Sends a name, message, and optional email to Dad...',
    parameters: z.object({
      name:    z.string(),
      email:   z.string().email().optional(),
      message: z.string(),
    }),
    execute: async ({ name, email, message }) => {
      const res = await fetch(\`\${baseUrl}/api/data\`, {
        method: 'POST',
        body: JSON.stringify({ name, email, message, source: 'ai-agent' }),
      });
      return { success: res.ok, detail: '...' };
    },
  },
}`}
            />
          </div>
        </section>

        {/* ──── API Usage ──── */}
        <section>
          <SectionHeading
            emoji="💻"
            title="API Usage"
            subtitle="Connect to Nanu's AI from your own scripts and tools"
          />

          <div className="space-y-6">
            <p className="text-purple-600 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-8">
              The <code className="px-1.5 py-0.5 bg-purple-100 rounded text-purple-700 text-xs font-mono">/api/chat</code> endpoint uses the Vercel AI SDK and streams responses using Server-Sent Events (SSE). You can easily parse this stream in any language!
            </p>

            <CodeBlock
              title="cURL — Streaming chat response"
              language="bash"
              code={`curl -X POST https://nanu.kprsnt.in/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Tell me a fun fact About Manu!"}]
  }'`}
            />

            <CodeBlock
              title="Python — Parsing the SSE format stream"
              language="python"
              code={`import requests
import json

response = requests.post(
    "https://nanu.kprsnt.in/api/chat",
    json={"messages": [{"role": "user", "content": "Hi Manu!"}]},
    stream=True
)

for line in response.iter_lines():
    if line:
        text = line.decode('utf-8')
        # The AI SDK streams Server-Sent Events starting with "data: "
        if text.startswith("data: "):
            data_str = text[6:]
            if data_str.strip() == "[DONE]":
                break
            try:
                event = json.loads(data_str)
                if event.get("type") == "text-delta":
                    print(event.get("delta", ""), end="", flush=True)
            except:
                pass`}
            />
            
            <CodeBlock
              title="JavaScript / Node.js — Fetch API parsing"
              language="javascript"
              code={`const response = await fetch("https://nanu.kprsnt.in/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: "Hi!" }] })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\\n').filter(l => l.startsWith('data: '));
  
  for (const line of lines) {
    const dataStr = line.slice(6);
    if (dataStr.trim() === '[DONE]') continue;
    
    try {
      const event = JSON.parse(dataStr);
      if (event.type === 'text-delta') {
        process.stdout.write(event.delta || '');
      }
    } catch (e) { /* ignore parse errors on partial chunks */ }
  }
}`}
            />
          </div>
        </section>

        {/* ──── Chat Widget UX ──── */}
        <section>
          <SectionHeading
            emoji="💬"
            title="Chat Widget UX"
            subtitle="Floating glassmorphism chat with delightful micro-interactions"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                emoji: "✨",
                title: "Floating Button",
                desc: "Gradient FAB with sparkle icon, bounce animation on load, smooth scale-up on hover.",
              },
              {
                emoji: "🪟",
                title: "Glassmorphism Card",
                desc: "Semi-transparent white card with 20px backdrop blur, purple accent borders, slide-up entrance animation.",
              },
              {
                emoji: "⚡",
                title: "Quick Actions",
                desc: "Suggested prompts ('Who is Manu?', 'Tell me a fun fact', 'Send a message') for zero-friction start.",
              },
              {
                emoji: "🔄",
                title: "Auto-Scroll",
                desc: "Smooth scroll to bottom on every new message and during streaming, using a ref-based scroll container.",
              },
              {
                emoji: "🛠️",
                title: "Tool Indicators",
                desc: "Live 'Sending to Dad…' spinner during tool execution, replaced with '✓ Message delivered!' on completion.",
              },
              {
                emoji: "🔁",
                title: "Error & Retry",
                desc: "Friendly error card with 'Try Again' button that clears the error and regenerates the last response.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="card-bounce border-purple-100 bg-white shadow-sm"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="font-bold text-purple-800 text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-purple-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ──── Architecture diagram (pure CSS) ──── */}
        <section>
          <SectionHeading
            emoji="🏗️"
            title="Architecture Overview"
            subtitle="How all the pieces fit together"
          />
          <Card className="border-purple-200 bg-white shadow-md overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-3 text-sm">
                {/* Browser */}
                <div className="w-full max-w-md bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center border border-purple-200">
                  <p className="font-bold text-purple-800">🌐 Browser</p>
                  <p className="text-xs text-purple-500 mt-1">
                    React 19 · useChat() · ChatWidget · shadcn/ui
                  </p>
                </div>

                <ArrowRight className="w-5 h-5 text-purple-300 rotate-90" />

                {/* Next.js Server */}
                <div className="w-full max-w-lg bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <p className="font-bold text-purple-800 text-center mb-3">
                    ⚡ Next.js 16 Server (Vercel)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                      <p className="font-semibold text-purple-700 text-xs">
                        POST /api/chat
                      </p>
                      <p className="text-[10px] text-purple-400 mt-1">
                        streamText · tools · system prompt
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                      <p className="font-semibold text-purple-700 text-xs">
                        POST /api/data
                      </p>
                      <p className="text-[10px] text-purple-400 mt-1">
                        validation · rate limit · storage
                      </p>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-purple-300 rotate-90" />

                {/* External services */}
                <div className="w-full max-w-md grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center border border-amber-200">
                    <p className="font-bold text-amber-800">🧠 Gemini API</p>
                    <p className="text-xs text-amber-600 mt-1">
                      2.5 Flash Lite · Streaming
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center border border-emerald-200">
                    <p className="font-bold text-emerald-800">📁 Content</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      JSON files · /content dir
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ──── Footer ──── */}
        <footer className="text-center py-8 text-purple-400 text-sm">
          <p>
            Built by Dad with ❤️ and a lot of AI magic ✨
          </p>
        </footer>
      </div>
    </main>
  );
}
