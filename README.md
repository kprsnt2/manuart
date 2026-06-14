# Manu's Art World 🎨

A Next.js, shadcn/ui powered art showcase & blog platform for Manu — a young artist! Features automatic blog post generation from rough drafts using AI (Gemini or Claude).

## Features

- **🎨 Drawing Showcase**: Beautiful gallery to display Manu's artwork with timeline grouping
- **📖 Auto-Blogging**: Drop a `.md` or `.txt` file with rough notes in `blog_drafts/`. Push to GitHub, and AI writes a full blog post!
- **🪄 AI Art Studio**: AI-powered art features — generate stories, art reviews, and drawing suggestions from descriptions
- **💬 AI Chat**: Ask questions about Manu and her art journey
- **📸 Photo Gallery**: Photo memories with lightbox viewer
- **🌱 Timeline**: Growth milestones
- **🗣️ Ask Manu**: Yearly Q&A tracker
- **💌 Letters**: Time-capsule letters to future Manu
- **🎮 Games**: Fun interactive games

## Getting Started

1. Clone this repository
2. Run `npm install`
3. Edit `content/profile.json` with your details
4. Run `npm run dev` to see the site running locally

## Adding Drawings

1. Drop image files into `public/drawings/` folder
2. Name them like `DRAWING_20260614_description.jpg` or `IMG_20260614_220013.jpg` — dates are extracted automatically!
3. Push to GitHub — they'll appear in the gallery automatically

## Writing a Blog Post

### Manual
1. Create a `.md` file in `content/blogs/` with frontmatter:
   ```yaml
   ---
   title: "My Drawing Title"
   date: "2026-06-14"
   excerpt: "A fun description"
   category: "Art Adventures"
   manuAge: 7
   tags: ["Art Adventures", "Drawings"]
   ---
   ```

### AI-Powered (Automatic)
1. Create a rough notes file in `blog_drafts/`, e.g., `my-butterfly.txt`
2. Push to GitHub
3. GitHub Action runs AI to rewrite your notes into a polished blog post in `content/blogs/`
4. If deployed on Vercel, it auto-deploys!

## Setting up AI Automation

1. Go to your repository **Settings > Secrets and variables > Actions**
2. Add a repository secret:
   - `GEMINI_API_KEY` (Get from [Google AI Studio](https://aistudio.google.com/))
   - `ANTHROPIC_API_KEY` (Get from [Anthropic Console](https://console.anthropic.com/))
3. Under **Settings > Actions > General > Workflow permissions**, enable **Read and write permissions**

## AI Features

- **AI Chat** (`/api/chat`): Conversational AI that knows about Manu's art
- **AI Art Studio** (`/ai-studio`): Describe a drawing and get:
  - 📖 **Stories** — AI-generated stories inspired by the art
  - ⭐ **Art Reviews** — Fun, encouraging art critiques
  - 💡 **Drawing Suggestions** — What to draw next based on current art
- **AI Blog Generation**: Automatic blog posts from drafts via GitHub Actions

## Deployment

Deploy easily to Vercel:
1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` to environment variables
4. Your site is live! 🎉
