import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const DRAFTS_DIR = path.join(process.cwd(), 'blog_drafts');
const POSTS_DIR = path.join(process.cwd(), 'content', 'blogs');

if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

// Calculate Manu's current age from birthday
function getManuAge() {
    const birthday = new Date(2019, 2, 25); // March 25, 2019
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
}

// Track which AI model is being used
let currentAIModel = '';

async function generateWithGemini(prompt) {
    currentAIModel = 'Gemini 2.5 Flash';
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function generateWithClaude(prompt) {
    currentAIModel = 'Claude 3.5 Sonnet';
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
    });
    return msg.content[0].text;
}

async function generateAI(prompt) {
    if (process.env.GEMINI_API_KEY) {
        console.log('Using Gemini API...');
        return await generateWithGemini(prompt);
    } else if (process.env.ANTHROPIC_API_KEY) {
        console.log('Using Claude API...');
        return await generateWithClaude(prompt);
    } else {
        console.error('No AI API key found (GEMINI_API_KEY or ANTHROPIC_API_KEY).');
        process.exit(1);
    }
}

function cleanupContent(content) {
    const firstDash = content.indexOf('---');
    if (firstDash !== -1) {
        content = content.substring(firstDash);
    }
    content = content.replace(/\n```\s*$/g, '').trim();
    return content;
}

function injectAiModel(content, aiModel, draftData = {}) {
    // Insert aiModel field into the frontmatter
    const parsed = matter(content);
    parsed.data.aiModel = aiModel;

    // Carry over fields from original draft
    if (draftData.drawing) {
        parsed.data.drawing = draftData.drawing;
    }
    if (draftData.manu_said || draftData.nanu_said) {
        parsed.data.manu_said = draftData.manu_said || draftData.nanu_said;
    }
    if (draftData.family_note || draftData.dads_note) {
        parsed.data.family_note = draftData.family_note || draftData.dads_note;
    }

    // Ensure tags exist
    if (!parsed.data.tags && parsed.data.category) {
        parsed.data.tags = [parsed.data.category];
    }
    return matter.stringify(parsed.content, parsed.data);
}

async function generateTeluguTranslation(englishContent, baseName) {
    const teluguPath = path.join(POSTS_DIR, `${baseName}_te.md`);
    if (fs.existsSync(teluguPath)) {
        console.log(`  Telugu version already exists for ${baseName}`);
        return;
    }

    console.log(`  Generating Telugu translation for ${baseName}...`);

    const prompt = `Translate the following English blog post into Telugu (తెలుగు). 

RULES:
- Translate the content naturally into Telugu, keeping the fun and artistic tone
- Keep emojis as-is
- Keep the YAML frontmatter in English (title, date, excerpt, category fields stay in English)
- Add a new frontmatter field: language: "te"
- Names like "Manu" should stay in English
- The Telugu should feel natural and conversational, not formal/literary
- Keep any blockquotes or special formatting

Blog post to translate:
---
${englishContent}
---

Output exactly the markdown with frontmatter (no wrapping like \`\`\`markdown).`;

    try {
        let teluguContent = await generateAI(prompt);
        teluguContent = cleanupContent(teluguContent);
        fs.writeFileSync(teluguPath, teluguContent, 'utf8');
        console.log(`  Successfully generated Telugu version: ${teluguPath}`);
    } catch (error) {
        console.error(`  Failed to generate Telugu translation for ${baseName}:`, error);
    }
}

async function processDrafts() {
    const files = fs.readdirSync(DRAFTS_DIR);
    const manuAge = getManuAge();

    for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.txt')) continue;

        const baseName = file.replace(/\.(md|txt)$/, '');
        const postPath = path.join(POSTS_DIR, `${baseName}.md`);

        // Skip if already generated
        if (fs.existsSync(postPath)) {
            console.log(`Skipping ${file}: Blog post already exists.`);
            // Still try Telugu translation for existing posts
            const existingContent = fs.readFileSync(postPath, 'utf8');
            await generateTeluguTranslation(existingContent, baseName);
            continue;
        }

        console.log(`Processing draft: ${file}`);
        const rawContent = fs.readFileSync(path.join(DRAFTS_DIR, file), 'utf8');

        // Parse frontmatter if present
        let draftContent = rawContent;
        let manuSaid = '';
        let familyNote = '';
        let category = '';
        let draftData = {};

        try {
            const parsed = matter(rawContent);
            draftData = parsed.data || {};
            draftContent = parsed.content;
            manuSaid = parsed.data.manu_said || parsed.data.nanu_said || '';
            familyNote = parsed.data.family_note || parsed.data.dads_note || '';
            category = parsed.data.category || '';
        } catch {
            // If no frontmatter, use raw content
        }

        const manuQuoteInstruction = manuSaid
            ? `\n\nIMPORTANT: Manu actually said this: "${manuSaid}" — You MUST weave this quote naturally into the blog post in a funny and highlighted way. Use a special callout or blockquote format like:\n> 🗣️ **Manu said:** "${manuSaid}"\nMake it a centerpiece moment in the story!`
            : '';

        const familyNoteInstruction = familyNote
            ? `\n\nAt the very end, add a "📝 Family Note" section with this message: "${familyNote}"`
            : '\n\nAt the very end, add a "📝 Family Note" section with a short, loving message about this moment or artwork.';

        const categoryInstruction = category
            ? `\nThe category for this post is: "${category}". Include it in the frontmatter as 'category'.`
            : '\nChoose a fun category that fits this post (e.g., "Art Adventures", "Creative Moments", "School Art", "Family Fun", "Masterpieces"). Include it in the frontmatter as \'category\'.';

        const drawing = draftData.drawing || '';
        const drawingInstruction = drawing
            ? `\n\nIMPORTANT: This blog post is based on Manu's drawing located at "${drawing}". You should talk about this drawing in detail (describing its elements like the Nandi bull, horn decorations, bells, the date 14-Feb-26, the signature "Qi", etc. if applicable) and explain what makes it special. Also, you can display the drawing image in the post by using the markdown image syntax: ![Manu's Drawing](${drawing})`
            : '';

        const systemPrompt = `You are a fun, warm, and loving storyteller writing a blog post for a digital art showcase about a young artist named Manu. Manu is currently ${manuAge} years old.

This blog showcases Manu's drawings and paintings — the beautiful things she creates, her art adventures, and the stories behind each artwork. The blog is maintained with love so that one day Manu can look back at her amazing art journey!

YOUR WRITING STYLE:
- Write in a warm, fun, storytelling tone — like family telling friends about their little artist's latest creations
- Use simple, fun language with occasional emojis (but don't overdo it — 3-5 per post max)
- Be genuinely fun — use light humor, playful descriptions, and artistic observations
- Make it feel personal and heartfelt, not generic
- Keep paragraphs short and punchy
- Use headings to break up the story
- Manu is ${manuAge} years old — make sure the content feels age-appropriate and references her age naturally

FRONTMATTER FORMAT:
The blog must include markdown frontmatter with these fields:
- 'title': A fun, catchy title (wrapped in double quotes)
- 'date': Today's date in ISO format "${new Date().toISOString()}" (wrapped in double quotes)
- 'excerpt': A short fun one-liner about the post (wrapped in double quotes)
- 'category': A fun category label (wrapped in double quotes)
- 'manuAge': ${manuAge}
- 'illustration_prompt': A short prompt (wrapped in double quotes) describing a fun cartoon illustration for this post (e.g., "A ${manuAge}-year-old girl painting a colorful butterfly, cartoon style, bright colors")
- 'tags': An array of relevant tags for this post (e.g., ["Art Adventures", "Butterflies", "Drawings"])

IMPORTANT: You MUST wrap ALL string values in the YAML frontmatter in double quotes to prevent YAML parsing errors.
${manuQuoteInstruction}
${familyNoteInstruction}
${categoryInstruction}
${drawingInstruction}

Here are the notes/draft about what happened:
---
${draftContent}
---

Output exactly the markdown with the frontmatter (no wrapping markdown formatting like \`\`\`markdown, just the raw text). Make it awesome! 🎉🎨`;

        try {
            let finalContent = await generateAI(systemPrompt);
            finalContent = cleanupContent(finalContent);

            // Inject the AI model name and draft data into frontmatter
            finalContent = injectAiModel(finalContent, currentAIModel, draftData);

            fs.writeFileSync(postPath, finalContent, 'utf8');
            console.log(`Successfully generated ${postPath} (by ${currentAIModel})`);

            // Generate Telugu translation
            await generateTeluguTranslation(finalContent, baseName);

        } catch (error) {
            console.error(`Failed to process ${file}:`, error);
        }
    }
}

processDrafts();
