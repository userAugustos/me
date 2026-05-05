import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

const POSTS_DIR = path.join(process.cwd(), 'public', 'posts')
const GENERATED_DIR = path.join(POSTS_DIR, 'generated')
const MANIFEST_FILE = path.join(POSTS_DIR, 'manifest.json')
const PREVIEW_PATTERN = /<!--\s*preview:start\s*-->([\s\S]*?)<!--\s*preview:end\s*-->/i
const KINDS = new Set(['essay', 'repo', 'post', 'talk', 'note'])

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: { className: ['heading-link'] },
  })
  .use(rehypePrettyCode, {
    theme: {
      dark: 'github-dark',
      light: 'github-light',
    },
  })
  .use(rehypeStringify)

function fail(file, message) {
  throw new Error(`${path.relative(process.cwd(), file)}: ${message}`)
}

function readString(file, frontmatter, key) {
  const value = frontmatter[key]
  if (typeof value !== 'string' || value.trim() === '') {
    fail(file, `frontmatter '${key}' must be a non-empty string`)
  }
  return value.trim()
}

function readKind(file, frontmatter) {
  const kind = readString(file, frontmatter, 'kind')
  if (!KINDS.has(kind)) fail(file, `frontmatter 'kind' must be one of ${[...KINDS].join(', ')}`)
  return kind
}

function readDate(file, frontmatter) {
  const value = frontmatter.date
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }
  fail(file, "frontmatter 'date' must be YYYY-MM-DD")
}

function readTags(file, frontmatter) {
  const value = frontmatter.tags
  if (!Array.isArray(value) || value.some((tag) => typeof tag !== 'string' || tag.trim() === '')) {
    fail(file, "frontmatter 'tags' must be a string array")
  }
  return value.map((tag) => tag.trim())
}

async function renderMarkdown(markdown) {
  return String(await processor.process(markdown))
}

function removeLeadingTitle(markdown, title) {
  const lines = markdown.trim().split('\n')
  return lines[0]?.trim() === `# ${title}` ? lines.slice(1).join('\n').trim() : markdown.trim()
}

async function readPost(file) {
  const source = await fs.readFile(file, 'utf8')
  const parsed = matter(source)
  const preview = parsed.content.match(PREVIEW_PATTERN)
  if (!preview) fail(file, 'missing <!-- preview:start --> ... <!-- preview:end --> block')

  const slug = readString(file, parsed.data, 'slug')
  const title = readString(file, parsed.data, 'title')
  const kind = readKind(file, parsed.data)
  const date = readDate(file, parsed.data)
  const meta = readString(file, parsed.data, 'meta')
  const tags = readTags(file, parsed.data)
  const body = removeLeadingTitle(parsed.content.replace(PREVIEW_PATTERN, ''), title)

  if (slug !== path.basename(file, '.md')) {
    fail(file, "frontmatter 'slug' must match the markdown filename")
  }

  return {
    slug,
    title,
    kind,
    date,
    meta,
    tags,
    href: `/posts/${slug}`,
    previewHtml: await renderMarkdown(preview[1].trim()),
    html: await renderMarkdown(body),
  }
}

async function main() {
  await fs.mkdir(POSTS_DIR, { recursive: true })
  await fs.rm(GENERATED_DIR, { recursive: true, force: true })
  await fs.mkdir(GENERATED_DIR, { recursive: true })

  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(POSTS_DIR, entry.name))
    .sort()

  const posts = await Promise.all(files.map(readPost))
  posts.sort((a, b) => b.date.localeCompare(a.date))

  await Promise.all(posts.map((post) => {
    const generated = {
      slug: post.slug,
      title: post.title,
      kind: post.kind,
      date: post.date,
      meta: post.meta,
      tags: post.tags,
      html: post.html,
    }
    return fs.writeFile(path.join(GENERATED_DIR, `${post.slug}.json`), `${JSON.stringify(generated, null, 2)}\n`)
  }))

  const manifest = posts.map(({ html, ...post }) => post)
  await fs.writeFile(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Generated ${posts.length} posts`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
