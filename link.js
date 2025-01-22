#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function getPageAuthor(page) {
  const selectors = [
    'meta[name="author"]',
    'meta[property="article:author"]',
    'meta[property="og:author"]',
    '.author-name',
    '.author > .fn, .vcard > .fn',
    '[rel="author"]'
  ];

  for (const selector of selectors) {
    try {
      const authorElement = await page.$(selector);
      if (authorElement) {
        if (selector.startsWith('meta')) {
          const content = await page.evaluate(el => el.getAttribute('content'), authorElement);
          if (content) return content;
        } else {
          const text = await page.evaluate(el => el.textContent, authorElement);
          if (text) return text.trim();
        }
      }
    } catch (e) {
      continue;
    }
  }
  return ''; // Default if no author found
}

async function getPageInfo(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const title = await page.title();
  const author = await getPageAuthor(page);
  await browser.close();
  return { title, author };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

async function createPost(url, description) {
  try {
    // Get page info
    const { title, author } = await getPageInfo(url);
    
    // Generate date string
    const now = new Date();
    const dateStr = now.toISOString();
    const fileDate = dateStr.split('T')[0];
    
    // Create filename
    const fileName = `${fileDate}-${slugify(title)}.md`;
    const filePath = path.join('content', fileName);
    
    // Create content
    const content = `---
title: "${author}: ${title}"
date: ${dateStr}
link: ${url}
---
Link: [${title}](${url})

${description}
`;

    // Ensure directory exists
    fs.mkdirSync(path.join('content'), { recursive: true });
    
    // Write file
    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Handle CLI arguments
const [url, description] = process.argv.slice(2);
if (!url || !description) {
  console.error('Usage: ./link.js URL "description"');
  process.exit(1);
}

createPost(url, description);