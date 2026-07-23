import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as cheerio from "cheerio";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const WP_API = "https://kairosbookshop.org/wp-json/wp/v2/posts";

interface WPPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ taxonomy: string; name: string }>>;
    author?: Array<{ name: string }>;
  };
}

function cleanContent(html: string): string {
  const $ = cheerio.load(html);

  $("script, style, iframe, object, embed, link, meta").remove();
  $("[class*='elementor'], [id*='elementor'], .wp-block-image, [data-elementor-]").removeAttr("class").removeAttr("id").removeAttr("data-elementor-type").removeAttr("data-elementor-id").removeAttr("data-elementor-post-type").removeAttr("data-id").removeAttr("data-type").removeAttr("data-widget_type");

  $("figure").each((_, el) => {
    const $el = $(el);
    if ($el.find("img").length > 0) {
      const $img = $el.find("img").first();
      const src = $img.attr("src") || $img.attr("data-src") || "";
      const alt = $img.attr("alt") || "";
      $el.replaceWith(`<figure><img src="${src}" alt="${alt}" /></figure>`);
    }
  });

  $("img").each((_, el) => {
    const $img = $(el);
    const src = $img.attr("src") || $img.attr("data-src") || "";
    const alt = $img.attr("alt") || "";
    if (src) {
      $img.replaceWith(`<img src="${src}" alt="${alt}" />`);
    }
  });

  $("*").each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0 && $el.text().trim() === "" && !$el.is("br,img,figure")) {
      $el.remove();
    }
  });

  const allowedTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre", "code", "figure", "figcaption", "img", "a", "strong", "em", "br", "hr", "div"];
  const cleaned: string[] = [];
  $("body").contents().each((_, el) => {
    if (el.type === "tag" && allowedTags.includes(el.tagName)) {
      cleaned.push($.html(el));
    }
  });

  return cleaned.join("\n");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchAllPosts(): Promise<WPPost[]> {
  const posts: WPPost[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${WP_API}?per_page=20&page=${page}&_embed=true`;
    console.log(`  Fetching page ${page}...`);
    const res = await fetch(url);
    totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
    const data: WPPost[] = await res.json();
    posts.push(...data);
    page++;
  }

  return posts;
}

async function main() {
  console.log("Fetching posts from WordPress...");
  const wpPosts = await fetchAllPosts();
  console.log(`Found ${wpPosts.length} posts\n`);

  let imported = 0;
  let skipped = 0;

  for (const wp of wpPosts) {
    const slug = wp.slug;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      console.log(`  SKIP (already exists): ${slug}`);
      skipped++;
      continue;
    }

    const title = wp.title.rendered;
    const excerpt = stripHtml(wp.excerpt.rendered).slice(0, 300);
    const content = cleanContent(wp.content.rendered);
    const published = wp.status === "publish";

    const author = wp._embedded?.author?.[0]?.name || "Dr. Isaiah Wealth";

    const categories = wp._embedded?.["wp:term"]
      ?.flatMap((tg) => tg.filter((t) => t.taxonomy === "category").map((t) => t.name)) || [];
    const category = categories.length > 0 ? categories[0] : "General";

    let imageUrl = wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

    if (!imageUrl) {
      const $ = cheerio.load(content);
      const firstImg = $("img").first();
      imageUrl = firstImg.attr("src") || "";
    }

    const createdAt = new Date(wp.date);

    await prisma.blogPost.create({
      data: { title, slug, excerpt, content, author, category, imageUrl, published, createdAt },
    });

    console.log(`  IMPORTED: "${title}" (${slug})`);
    imported++;
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
