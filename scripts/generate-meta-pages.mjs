import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SITE = 'https://www.useraugustos.me';
const DIST = path.join(process.cwd(), 'dist');
const MANIFEST_FILE = path.join(process.cwd(), 'public', 'posts', 'manifest.json');
const OG_BLOCK = /<!-- og:start -->[\s\S]*?<!-- og:end -->/;
const SITE_NAME = 'Felipe Augustos';
const OG_IMAGE = `${SITE}/assets/og.png`;

const STATIC_PAGES = [
  { file: 'watched.html', href: '/watched', title: 'Watched', description: 'Things worth watching.' },
  { file: 'wish-list.html', href: '/wish-list', title: 'Wish list', description: 'Things worth wanting.' },
];

function escapeAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toDescription(html) {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 200) return text;
  const clipped = text.slice(0, 197);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 120 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}...`;
}

function metaTags({ title, description, url, type, publishedAt }) {
  const tags = [
    `<meta name="description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${escapeAttribute(url)}" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (publishedAt) {
    tags.push(`<meta property="article:published_time" content="${publishedAt}" />`);
  }
  return tags.join('\n    ');
}

function buildPage(shell, { title, description, url, type, publishedAt }) {
  const withTitle = shell.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttribute(title)}</title>`,
  );
  return withTitle.replace(
    OG_BLOCK,
    metaTags({ title, description, url, type, publishedAt }),
  );
}

async function main() {
  const shell = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  if (!OG_BLOCK.test(shell)) {
    throw new Error('dist/index.html is missing the <!-- og:start --> block');
  }

  const posts = JSON.parse(await fs.readFile(MANIFEST_FILE, 'utf8'));
  await fs.mkdir(path.join(DIST, 'posts'), { recursive: true });

  await Promise.all(
    posts.map(post =>
      fs.writeFile(
        path.join(DIST, 'posts', `${post.slug}.html`),
        buildPage(shell, {
          title: `${post.title} — ${SITE_NAME}`,
          description: toDescription(post.previewHtml),
          url: `${SITE}${post.href}`,
          type: 'article',
          publishedAt: post.date,
        }),
      ),
    ),
  );

  await Promise.all(
    STATIC_PAGES.map(page =>
      fs.writeFile(
        path.join(DIST, page.file),
        buildPage(shell, {
          title: `${page.title} — ${SITE_NAME}`,
          description: page.description,
          url: `${SITE}${page.href}`,
          type: 'website',
        }),
      ),
    ),
  );

  console.log(`Generated ${posts.length + STATIC_PAGES.length} meta pages`);
}

await main();
