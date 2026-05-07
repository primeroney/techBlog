const express = require("express");
const path = require("path");
const { marked } = require("marked");
const hljs = require("highlight.js");
const posts = require("./src/data/posts");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {}
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
});

app.use(express.static(path.join(__dirname, "public")));

// Template helper
function layout(title, body, description = "") {
  const metaDesc = description || "A tech blog about software development, programming, and engineering.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${metaDesc}" />
  <title>${title} | DevPulse</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <nav class="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <span class="logo-mark">⬡</span>
        <span class="logo-text">DevPulse</span>
      </a>
      <div class="nav-links">
        <a href="/" class="nav-link">Home</a>
        <a href="/tags" class="nav-link">Topics</a>
        <a href="/about" class="nav-link">About</a>
      </div>
    </div>
  </nav>
  <main>${body}</main>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="logo-mark">⬡</span>
        <span>DevPulse</span>
      </div>
      <p class="footer-copy">Built with Node.js · Essays on software &amp; engineering</p>
    </div>
  </footer>
  <script src="/main.js"></script>
</body>
</html>`;
}

// HOME PAGE
app.get("/", (req, res) => {
  const featured = posts.filter((p) => p.featured);
  const recent = posts.filter((p) => !p.featured).slice(0, 4);
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  const featuredCards = featured
    .map(
      (p, i) => `
    <article class="featured-card ${i === 0 ? "featured-card--large" : ""}">
      <div class="card-meta">
        <div class="tag-list">
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <span class="card-read-time">${p.readTime}</span>
      </div>
      <h2 class="card-title">
        <a href="/post/${p.slug}">${p.title}</a>
      </h2>
      <p class="card-excerpt">${p.excerpt}</p>
      <div class="card-footer">
        <div class="author">
          <div class="author-avatar">${p.authorAvatar}</div>
          <div>
            <div class="author-name">${p.author}</div>
            <div class="author-date">${formatDate(p.date)}</div>
          </div>
        </div>
        <a href="/post/${p.slug}" class="read-more">Read →</a>
      </div>
    </article>
  `
    )
    .join("");

  const recentCards = recent
    .map(
      (p) => `
    <article class="post-card">
      <div class="card-meta">
        <div class="tag-list">
          ${p.tags
            .slice(0, 2)
            .map((t) => `<span class="tag">${t}</span>`)
            .join("")}
        </div>
        <span class="card-read-time">${p.readTime}</span>
      </div>
      <h3 class="card-title card-title--sm">
        <a href="/post/${p.slug}">${p.title}</a>
      </h3>
      <p class="card-excerpt card-excerpt--sm">${p.excerpt}</p>
      <div class="card-footer">
        <div class="author author--sm">
          <div class="author-avatar author-avatar--sm">${p.authorAvatar}</div>
          <div class="author-name">${p.author} · ${formatDate(p.date)}</div>
        </div>
      </div>
    </article>
  `
    )
    .join("");

  const tagLinks = allTags
    .map((t) => `<a href="/tag/${encodeURIComponent(t)}" class="tag tag--lg">${t}</a>`)
    .join("");

  const body = `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">Engineering · Code · Culture</div>
        <h1 class="hero-title">Ideas that move<br><em>software forward.</em></h1>
        <p class="hero-sub">Deep dives, tutorials, and sharp takes from developers building in the open.</p>
      </div>
      <div class="hero-ticker">
        <div class="ticker-inner">
          ${allTags.map((t) => `<span>· ${t}`).join(" ")} ·
          ${allTags.map((t) => `<span>· ${t}`).join(" ")} ·
        </div>
      </div>
    </section>

    <div class="container">
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Featured</h2>
          <div class="section-line"></div>
        </div>
        <div class="featured-grid">
          ${featuredCards}
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Latest Posts</h2>
          <div class="section-line"></div>
        </div>
        <div class="posts-grid">
          ${recentCards}
        </div>
      </section>

      <section class="section topics-section">
        <div class="section-header">
          <h2 class="section-title">Browse by Topic</h2>
          <div class="section-line"></div>
        </div>
        <div class="tags-cloud">
          ${tagLinks}
        </div>
      </section>
    </div>
  `;

  res.send(layout("Home", body));
});

// SINGLE POST
app.get("/post/:slug", (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).send(layout("Not Found", "<div class='container'><div class='error-page'><h1>404</h1><p>Post not found.</p><a href='/' class='btn'>Back Home</a></div></div>"));

  const htmlContent = marked(post.content.trim());

  const related = posts
    .filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  const relatedCards = related.length
    ? `<section class="related-section">
        <div class="section-header">
          <h2 class="section-title">Related Posts</h2>
          <div class="section-line"></div>
        </div>
        <div class="posts-grid">
          ${related
            .map(
              (p) => `
            <article class="post-card">
              <div class="card-meta">
                <div class="tag-list">${p.tags
                  .slice(0, 2)
                  .map((t) => `<span class="tag">${t}</span>`)
                  .join("")}</div>
                <span class="card-read-time">${p.readTime}</span>
              </div>
              <h3 class="card-title card-title--sm"><a href="/post/${p.slug}">${p.title}</a></h3>
              <p class="card-excerpt card-excerpt--sm">${p.excerpt}</p>
              <div class="card-footer">
                <div class="author author--sm">
                  <div class="author-avatar author-avatar--sm">${p.authorAvatar}</div>
                  <div class="author-name">${p.author} · ${formatDate(p.date)}</div>
                </div>
              </div>
            </article>`
            )
            .join("")}
        </div>
      </section>`
    : "";

  const body = `
    <div class="post-hero">
      <div class="container">
        <div class="post-hero-inner">
          <div class="tag-list">
            ${post.tags.map((t) => `<a href="/tag/${encodeURIComponent(t)}" class="tag">${t}</a>`).join("")}
          </div>
          <h1 class="post-title">${post.title}</h1>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-meta-bar">
            <div class="author">
              <div class="author-avatar">${post.authorAvatar}</div>
              <div>
                <div class="author-name">${post.author}</div>
                <div class="author-date">${formatDate(post.date)} · ${post.readTime}</div>
              </div>
            </div>
            <button class="share-btn" onclick="copyLink()">Share ↗</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="post-layout">
        <article class="post-body prose">
          ${htmlContent}
        </article>
        <aside class="post-sidebar">
          <div class="sidebar-sticky">
            <div class="sidebar-section">
              <h4 class="sidebar-title">Topics</h4>
              <div class="tag-list tag-list--col">
                ${post.tags.map((t) => `<a href="/tag/${encodeURIComponent(t)}" class="tag tag--lg">${t}</a>`).join("")}
              </div>
            </div>
            <div class="sidebar-section">
              <h4 class="sidebar-title">About the Author</h4>
              <div class="sidebar-author">
                <div class="author-avatar author-avatar--lg">${post.authorAvatar}</div>
                <p class="sidebar-author-name">${post.author}</p>
                <p class="sidebar-author-bio">Developer and technical writer sharing insights on modern software engineering.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      ${relatedCards}
    </div>
    <div id="toast" class="toast">Link copied!</div>
  `;

  res.send(layout(post.title, body, post.excerpt));
});

// TAGS PAGE
app.get("/tags", (req, res) => {
  const tagMap = {};
  posts.forEach((p) => {
    p.tags.forEach((t) => {
      tagMap[t] = (tagMap[t] || 0) + 1;
    });
  });

  const tagItems = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([tag, count]) => `
      <a href="/tag/${encodeURIComponent(tag)}" class="tag-item">
        <span class="tag-item-name">${tag}</span>
        <span class="tag-item-count">${count}</span>
      </a>
    `
    )
    .join("");

  const body = `
    <div class="page-hero">
      <div class="container">
        <h1 class="page-title">Browse Topics</h1>
        <p class="page-sub">Explore posts by technology, language, or concept.</p>
      </div>
    </div>
    <div class="container">
      <div class="tags-page-grid">
        ${tagItems}
      </div>
    </div>
  `;

  res.send(layout("Topics", body));
});

// SINGLE TAG
app.get("/tag/:tag", (req, res) => {
  const tag = decodeURIComponent(req.params.tag);
  const filtered = posts.filter((p) => p.tags.includes(tag));

  if (!filtered.length) {
    return res.status(404).send(layout("Not Found", "<div class='container'><div class='error-page'><h1>No posts</h1><p>No posts found for this tag.</p><a href='/tags' class='btn'>Browse Topics</a></div></div>"));
  }

  const cards = filtered
    .map(
      (p) => `
    <article class="post-card">
      <div class="card-meta">
        <div class="tag-list">${p.tags
          .slice(0, 2)
          .map((t) => `<span class="tag">${t}</span>`)
          .join("")}</div>
        <span class="card-read-time">${p.readTime}</span>
      </div>
      <h3 class="card-title card-title--sm"><a href="/post/${p.slug}">${p.title}</a></h3>
      <p class="card-excerpt card-excerpt--sm">${p.excerpt}</p>
      <div class="card-footer">
        <div class="author author--sm">
          <div class="author-avatar author-avatar--sm">${p.authorAvatar}</div>
          <div class="author-name">${p.author} · ${formatDate(p.date)}</div>
        </div>
        <a href="/post/${p.slug}" class="read-more">Read →</a>
      </div>
    </article>
  `
    )
    .join("");

  const body = `
    <div class="page-hero">
      <div class="container">
        <div class="tag tag--hero">${tag}</div>
        <h1 class="page-title">${filtered.length} post${filtered.length !== 1 ? "s" : ""}</h1>
        <p class="page-sub">All articles tagged with <strong>${tag}</strong>.</p>
      </div>
    </div>
    <div class="container">
      <div class="posts-grid posts-grid--wide">
        ${cards}
      </div>
    </div>
  `;

  res.send(layout(tag, body));
});

// ABOUT PAGE
app.get("/about", (req, res) => {
  const body = `
    <div class="page-hero">
      <div class="container">
        <h1 class="page-title">About DevPulse</h1>
      </div>
    </div>
    <div class="container">
      <div class="about-layout">
        <div class="about-content prose">
          <h2>What is DevPulse?</h2>
          <p>DevPulse is an independent technical blog focused on software engineering, modern development practices, and the tools and languages shaping how we build software.</p>
          <p>We write in-depth tutorials, honest opinions, and practical guides — all written by working developers who care deeply about their craft.</p>
          <h2>Our Topics</h2>
          <p>We cover the full stack: from systems programming in Rust and Go, to frontend with React and TypeScript, to infrastructure with Docker and PostgreSQL. If it's relevant to a working developer, we write about it.</p>
          <h2>Want to Contribute?</h2>
          <p>DevPulse is always looking for thoughtful contributors. If you have a deep-dive tutorial, a hard-won lesson, or a sharp opinion on something in our industry, we'd love to hear from you.</p>
          <a href="mailto:hello@devpulse.dev" class="btn btn--primary">Get in Touch</a>
        </div>
        <aside class="about-sidebar">
          <div class="stat-card">
            <div class="stat-num">${posts.length}</div>
            <div class="stat-label">Articles Published</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${[...new Set(posts.map((p) => p.author))].length}</div>
            <div class="stat-label">Contributors</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${[...new Set(posts.flatMap((p) => p.tags))].length}</div>
            <div class="stat-label">Topics Covered</div>
          </div>
        </aside>
      </div>
    </div>
  `;
  res.send(layout("About", body));
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

app.listen(PORT, () => {
  console.log(`DevPulse running at http://localhost:${PORT}`);
});
