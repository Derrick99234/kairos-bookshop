import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hash } from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await hash("admin123", 12);
  const userPassword = await hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kairos.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@kairos.com",
      password: adminPassword,
      phone: "+2348000000001",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "samuel@example.com" },
    update: {},
    create: {
      name: "Brother Samuel",
      email: "samuel@example.com",
      password: userPassword,
      phone: "+2348000000002",
      role: "CUSTOMER",
    },
  });

  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "spiritual-growth" },
      update: {},
      create: {
        name: "Spiritual Growth",
        slug: "spiritual-growth",
        description: "Books for deepening your faith and spiritual walk",
        imageUrl: "/images/categories/spiritual-growth.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "prayer" },
      update: {},
      create: {
        name: "Prayer",
        slug: "prayer",
        description: "Books on the power and practice of prayer",
        imageUrl: "/images/categories/prayer.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "faith" },
      update: {},
      create: {
        name: "Faith",
        slug: "faith",
        description: "Books that build and strengthen your faith",
        imageUrl: "/images/categories/faith.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "prophetic" },
      update: {},
      create: {
        name: "Prophetic",
        slug: "prophetic",
        description: "Books on prophecy and the prophetic ministry",
        imageUrl: "/images/categories/prophetic.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "leadership" },
      update: {},
      create: {
        name: "Leadership",
        slug: "leadership",
        description: "Books on Christian leadership and influence",
        imageUrl: "/images/categories/leadership.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bible-study" },
      update: {},
      create: {
        name: "Bible Study",
        slug: "bible-study",
        description: "Books for deeper Scripture study and understanding",
        imageUrl: "/images/categories/bible-study.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "marriage" },
      update: {},
      create: {
        name: "Marriage",
        slug: "marriage",
        description: "Books on Christian marriage and family",
        imageUrl: "/images/categories/marriage.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "devotional" },
      update: {},
      create: {
        name: "Devotional",
        slug: "devotional",
        description: "Daily devotionals and quiet time resources",
        imageUrl: "/images/categories/devotional.jpg",
      },
    }),
  ]);

  const books = [
    {
      title: "Dynamics of the Spirit",
      slug: "dynamics-of-the-spirit",
      author: "Dr. Isaiah Wealth",
      description:
        "A profound exploration of the workings of the Holy Spirit in the life of a believer. This book unveils the dynamics of spiritual growth, power, and intimacy with God. Discover how to flow with the Spirit, operate in spiritual gifts, and experience a deeper dimension of your faith.",
      isbn: "978-0-123456-78-9",
      pages: 284,
      price: 14.99,
      comparePrice: 19.99,
      categorySlug: "spiritual-growth",
      featured: true,
      stock: 50,
      imageUrl: "/images/books/dynamics-of-the-spirit.jpg",
    },
    {
      title: "The Power of Prayer",
      slug: "the-power-of-prayer",
      author: "Dr. Isaiah Wealth",
      description:
        "Unlock the transformative power of prayer in your daily life. From intercession to spiritual warfare, this comprehensive guide teaches you how to pray effectively and see results.",
      isbn: "978-0-123456-79-6",
      pages: 312,
      price: 16.99,
      comparePrice: 21.99,
      categorySlug: "prayer",
      featured: true,
      stock: 45,
      imageUrl: "/images/books/the-power-of-prayer.jpg",
    },
    {
      title: "Metanoia: The Shift",
      slug: "metanoia-the-shift",
      author: "Dr. Isaiah Wealth",
      description:
        "A life-changing book about the power of transformation through Christ. Metanoia — a fundamental shift of mind, heart, and life direction. Learn how to embrace God's transformative power.",
      isbn: "978-0-123456-80-2",
      pages: 256,
      price: 13.99,
      comparePrice: 0,
      categorySlug: "spiritual-growth",
      featured: true,
      stock: 60,
      imageUrl: "/images/books/metanoia-the-shift.jpg",
    },
    {
      title: "The Spirit of Faith",
      slug: "the-spirit-of-faith",
      author: "Dr. Isaiah Wealth",
      description:
        "Discover the principles of faith that move mountains. This book teaches you how to develop a strong faith life, speak words of faith, and see God's promises manifest in your life.",
      isbn: "978-0-123456-81-9",
      pages: 298,
      price: 15.99,
      comparePrice: 20.99,
      categorySlug: "faith",
      featured: true,
      stock: 40,
      imageUrl: "/images/books/the-spirit-of-faith.jpg",
    },
    {
      title: "The Prophetic Voice",
      slug: "the-prophetic-voice",
      author: "Dr. Isaiah Wealth",
      description:
        "A comprehensive guide to understanding and operating in the prophetic ministry. Learn how to hear God's voice, discern spirits, and deliver prophetic words with accuracy and love.",
      isbn: "978-0-123456-82-6",
      pages: 330,
      price: 17.99,
      comparePrice: 22.99,
      categorySlug: "prophetic",
      featured: false,
      stock: 35,
      imageUrl: "/images/books/the-prophetic-voice.jpg",
    },
    {
      title: "Kingdom Leadership",
      slug: "kingdom-leadership",
      author: "Dr. Isaiah Wealth",
      description:
        "Biblical principles for effective leadership in God's kingdom. This book equips leaders with the tools to influence, inspire, and impact their generation for Christ.",
      isbn: "978-0-123456-83-3",
      pages: 275,
      price: 14.99,
      comparePrice: 0,
      categorySlug: "leadership",
      featured: false,
      stock: 30,
      imageUrl: "/images/books/kingdom-leadership.jpg",
    },
    {
      title: "The Word Made Plain",
      slug: "the-word-made-plain",
      author: "Dr. Isaiah Wealth",
      description:
        "A verse-by-verse study guide that makes Scripture accessible and applicable to daily life. Perfect for personal study or small group discussions.",
      isbn: "978-0-123456-84-0",
      pages: 420,
      price: 19.99,
      comparePrice: 24.99,
      categorySlug: "bible-study",
      featured: false,
      stock: 25,
      imageUrl: "/images/books/the-word-made-plain.jpg",
    },
    {
      title: "Covenant of Marriage",
      slug: "covenant-of-marriage",
      author: "Dr. Isaiah Wealth",
      description:
        "Building a God-centered marriage that stands the test of time. This book offers practical wisdom for couples at every stage of their relationship journey.",
      isbn: "978-0-123456-85-7",
      pages: 240,
      price: 12.99,
      comparePrice: 16.99,
      categorySlug: "marriage",
      featured: false,
      stock: 55,
      imageUrl: "/images/books/covenant-of-marriage.jpg",
    },
    {
      title: "Daily Bread Devotional",
      slug: "daily-bread-devotional",
      author: "Dr. Isaiah Wealth",
      description:
        "A year-long devotional journey through Scripture. Each day offers a reading, reflection, and prayer to draw you closer to God.",
      isbn: "978-0-123456-86-4",
      pages: 365,
      price: 11.99,
      comparePrice: 0,
      categorySlug: "devotional",
      featured: false,
      stock: 70,
      imageUrl: "/images/books/daily-bread-devotional.jpg",
    },
    {
      title: "Prayers That Avail Much",
      slug: "prayers-that-avail-much",
      author: "Dr. Isaiah Wealth",
      description:
        "Scripture-based prayers that get results. This powerful prayer manual covers every area of life with prayers rooted in God's Word.",
      isbn: "978-0-123456-87-1",
      pages: 200,
      price: 10.99,
      comparePrice: 14.99,
      categorySlug: "prayer",
      featured: false,
      stock: 80,
      imageUrl: "/images/books/prayers-that-avail-much.jpg",
    },
  ];

  for (const book of books) {
    const category = categories.find((c) => c.slug === book.categorySlug)!;
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {},
      create: {
        title: book.title,
        slug: book.slug,
        author: book.author,
        description: book.description,
        isbn: book.isbn,
        pages: book.pages,
        price: book.price,
        comparePrice: book.comparePrice,
        categoryId: category.id,
        stock: book.stock,
        imageUrl: book.imageUrl,
        featured: book.featured,
        published: true,
      },
    });
  }

  const dynamics = await prisma.book.findUnique({
    where: { slug: "dynamics-of-the-spirit" },
  });
  if (dynamics) {
    try {
      await prisma.review.create({
        data: {
          bookId: dynamics.id,
          userId: user.id,
          rating: 5,
          comment:
            "This book completely transformed my understanding of the Holy Spirit. Dr. Isaiah Wealth writes with such depth and clarity. Highly recommended for every believer!",
        },
      });
    } catch {
      // review already exists
    }
    try {
      await prisma.review.create({
        data: {
          bookId: dynamics.id,
          userId: admin.id,
          rating: 5,
          comment:
            "A masterpiece on the workings of the Spirit. Every chapter opened my eyes to new dimensions of faith.",
        },
      });
    } catch {
      // review already exists
    }
  }

  const blogPosts = [
    {
      title: "The Power of a Transformed Mind",
      slug: "the-power-of-a-transformed-mind",
      excerpt:
        "Discover how renewing your mind can transform your entire life and unlock the destiny God has prepared for you.",
      content: `In Romans 12:2, Paul urges us: "Do not be conformed to this world, but be transformed by the renewing of your mind."

The mind is the battlefield where most spiritual victories are won or lost. Your thoughts shape your beliefs, your beliefs shape your actions, and your actions shape your destiny.

**The Renewal Process**

Renewing your mind is not a one-time event but a daily discipline. It involves intentionally replacing worldly thought patterns with God's truth. When you meditate on Scripture, you program your mind with heaven's operating system.

**Practical Steps**

1. **Immerse yourself in Scripture** — Let God's Word saturate your thinking
2. **Guard your inputs** — Be selective about what you watch, read, and listen to
3. **Practice thanksgiving** — A grateful mind is a transformed mind
4. **Speak truth aloud** — Your words reinforce your thinking

As you consistently renew your mind, you will begin to see circumstances differently. Problems become opportunities, obstacles become stepping stones, and impossibilities become God's playground.

Your transformed mind is the gateway to your transformed life.`,
      author: "Dr. Isaiah Wealth",
      category: "Spiritual Growth",
      imageUrl: "/images/blog/transformed-mind.jpg",
    },
    {
      title: "Understanding Divine Timing",
      slug: "understanding-divine-timing",
      excerpt:
        "Why does God sometimes seem slow? Learn to recognize and cooperate with God's perfect timing for your life.",
      content: `One of the greatest challenges in the Christian walk is waiting on God's timing. We live in an age of instant gratification, but God operates on an eternal clock.

**Seasons and Seasons**

Ecclesiastes 3:1 reminds us that there is a season for everything. Just as nature has seasons, so does your spiritual life. The season of planting looks very different from the season of harvest, but both are necessary.

**Why God Delays**

God's delays are not denials. He is often working behind the scenes — building character, aligning circumstances, and preparing you for what He has planned. The delay is part of the preparation.

**How to Wait Well**

- **Stay faithful** in the small things
- **Keep worshiping** even when you don't understand
- **Surround yourself** with people of faith
- **Remember His faithfulness** in the past

Your appointed time will come. When it does, you'll be grateful for every moment of the wait.`,
      author: "Dr. Isaiah Wealth",
      category: "Faith",
      imageUrl: "/images/blog/divine-timing.jpg",
    },
    {
      title: "Building a Life of Prayer",
      slug: "building-a-life-of-prayer",
      excerpt:
        "Practical guidance on developing a consistent and powerful prayer life that produces results.",
      content: `Prayer is not just an activity; it is a lifestyle. Jesus Himself modeled a life of prayer, often withdrawing to lonely places to commune with the Father.

**The Foundation**

A life of prayer begins with the decision that prayer is non-negotiable. It's not about finding time but making time. Start with small, consistent steps rather than grand but unsustainable commitments.

**Types of Prayer**

- **Adoration** — Praising God for who He is
- **Confession** — Keeping your account short with God
- **Thanksgiving** — Gratitude for what He has done
- **Supplication** — Presenting your requests

**Overcoming Challenges**

Distractions, dryness, and doubt are common challenges in prayer. The key is persistence. Don't judge your prayer life by feelings — judge it by faithfulness.

Prayer changes things. More importantly, prayer changes you.`,
      author: "Dr. Isaiah Wealth",
      category: "Prayer",
      imageUrl: "/images/blog/life-of-prayer.jpg",
    },
    {
      title: "Walking in Your Prophetic Destiny",
      slug: "walking-in-your-prophetic-destiny",
      excerpt:
        "Every believer has a God-given destiny. Learn how to discover, pursue, and fulfill your prophetic purpose.",
      content: `Jeremiah 29:11 declares that God has plans for you — plans to prosper you and give you a future and a hope. But discovering and walking in that destiny requires intentionality.

**Discovering Your Destiny**

Your destiny is found at the intersection of your gifts, your passion, and the needs around you. Pay attention to what God has placed in your hands and what He has placed in your heart.

**The Journey of Destiny**

Walking in destiny is a journey, not a destination. There will be twists, turns, and unexpected detours. Each step is part of the path.

**Keys to Fulfillment**

1. **Know your identity** — Destiny flows from who you are in Christ
2. **Develop your gifts** — What God has placed in you must be cultivated
3. **Stay in community** — Destiny is never fulfilled in isolation
4. **Remain flexible** — God's path often looks different than we imagined

Your prophetic destiny is waiting. Take the next step today.`,
      author: "Dr. Isaiah Wealth",
      category: "Prophetic",
      imageUrl: "/images/blog/prophetic-destiny.jpg",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seed complete!");
  console.log(`  Admin: admin@kairos.com / admin123`);
  console.log(`  User: samuel@example.com / user123`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Books: ${books.length}`);
  console.log(`  Blog Posts: ${blogPosts.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
