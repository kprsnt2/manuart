import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const POSTS_DIR = path.join(process.cwd(), 'content', 'blogs');

function getNanuAge() {
    const birthday = new Date(2019, 2, 25);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
}

async function generateAI(prompt) {
    if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } else if (process.env.ANTHROPIC_API_KEY) {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            messages: [{ role: "user", content: prompt }]
        });
        return msg.content[0].text;
    }
    throw new Error('No AI API key found');
}

async function generateMonthlySummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const nanuAge = getNanuAge();

    // Find all posts from this month
    const files = fs.readdirSync(POSTS_DIR);
    const monthPosts = [];

    for (const file of files) {
        if (!file.endsWith('.md') || file.endsWith('_te.md') || file.startsWith('monthly-')) continue;
        const fileContents = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data, content } = matter(fileContents);
        const postDate = new Date(data.date);
        if (postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear) {
            monthPosts.push({ title: data.title, excerpt: data.excerpt, content: content.substring(0, 500) });
        }
    }

    if (monthPosts.length === 0) {
        console.log(`No posts found for ${monthName} ${currentYear}. Skipping summary.`);
        return;
    }

    const summarySlug = `monthly-${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const summaryPath = path.join(POSTS_DIR, `${summarySlug}.md`);

    if (fs.existsSync(summaryPath)) {
        console.log('Monthly summary already exists.');
        return;
    }

    const postSummaries = monthPosts.map((p, i) => `${i + 1}. "${p.title}" - ${p.excerpt}`).join('\n');

    const prompt = `You are writing a fun monthly summary blog post for "Nanu's World" — a digital scrapbook about a ${nanuAge}-year-old kid named Nanu, maintained by his Dad.

This month (${monthName} ${currentYear}), there were ${monthPosts.length} stories posted:
${postSummaries}

Write a fun "Nanu's Month in Review" blog post that:
- Has a catchy title like "Nanu's ${monthName} Madness! 🎉" or similar
- Briefly recaps each story in a funny way
- Adds Dad's commentary
- Ends with what Dad is looking forward to next month

FRONTMATTER FORMAT (wrap all strings in double quotes):
- title, date (ISO: "${now.toISOString()}"), excerpt, category: "Monthly Roundup", nanuAge: ${nanuAge}

Output exactly the markdown with frontmatter (no \`\`\`markdown wrapping).`;

    try {
        let content = await generateAI(prompt);
        const firstDash = content.indexOf('---');
        if (firstDash !== -1) content = content.substring(firstDash);
        content = content.replace(/\n```\s*$/g, '').trim();

        fs.writeFileSync(summaryPath, content, 'utf8');
        console.log(`Generated monthly summary: ${summaryPath}`);
    } catch (error) {
        console.error('Failed to generate monthly summary:', error);
    }
}

generateMonthlySummary();
