import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const POSTS_DIR = path.join(process.cwd(), 'content', 'blogs');
const ILLUSTRATIONS_DIR = path.join(process.cwd(), 'public', 'illustrations');

if (!fs.existsSync(ILLUSTRATIONS_DIR)) fs.mkdirSync(ILLUSTRATIONS_DIR, { recursive: true });

async function generateImageWithGemini(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const imagePrompt = `Generate a fun, colorful, child-friendly cartoon illustration: ${prompt}. Style: cute, bright colors, playful, no text in the image.`;

    try {
        const result = await model.generateContent(imagePrompt);
        const response = result.response;
        // Check if the model returned image data
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return Buffer.from(part.inlineData.data, 'base64');
                }
            }
        }
        console.log('  No image data returned from Gemini');
        return null;
    } catch (error) {
        console.error('  Image generation failed:', error.message);
        return null;
    }
}

async function processIllustrations() {
    const files = fs.readdirSync(POSTS_DIR);

    for (const file of files) {
        if (!file.endsWith('.md') || file.endsWith('_te.md')) continue;

        const slug = file.replace(/\.md$/, '');
        const illustrationPath = path.join(ILLUSTRATIONS_DIR, `${slug}.png`);

        // Skip if illustration already exists
        if (fs.existsSync(illustrationPath)) {
            console.log(`Skipping ${slug}: Illustration already exists.`);
            continue;
        }

        const fileContents = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data } = matter(fileContents);

        if (!data.illustration_prompt) {
            console.log(`Skipping ${slug}: No illustration_prompt in frontmatter.`);
            continue;
        }

        console.log(`Generating illustration for: ${slug}`);
        console.log(`  Prompt: ${data.illustration_prompt}`);

        if (process.env.GEMINI_API_KEY) {
            const imageBuffer = await generateImageWithGemini(data.illustration_prompt);
            if (imageBuffer) {
                fs.writeFileSync(illustrationPath, imageBuffer);
                console.log(`  Saved illustration: ${illustrationPath}`);
            }
        } else {
            console.log('  No GEMINI_API_KEY found, skipping image generation.');
        }
    }
}

processIllustrations();
