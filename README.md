# DevPulse — Tech Blog

A production-ready tech/dev blog built with Node.js + Express. Features syntax-highlighted code blocks, tag browsing, responsive design, and a bright editorial aesthetic.

## Features

- 📝 Markdown-powered blog posts with syntax highlighting
- 🏷️ Tag-based filtering and browsing
- 📱 Fully responsive design
- ⚡ Fast — no frontend framework, pure server-rendered HTML
- 🎨 Editorial design with Playfair Display + DM Sans typography

## Local Development

```bash
npm install
npm run dev        # starts with nodemon (auto-reload)
# Visit http://localhost:3000
```

## Adding a New Post

Open `src/data/posts.js` and add a new object to the array:

```js
{
  id: 7,                            // unique ID
  slug: "my-new-post",              // URL slug
  title: "My New Post",
  excerpt: "A short description.",
  content: `# My New Post\n\nMarkdown content here...`,
  author: "Your Name",
  authorAvatar: "YN",               // 2-letter initials
  date: "2025-05-01",
  readTime: "5 min read",
  tags: ["JavaScript", "Tutorial"],
  featured: false                   // true = shows in featured grid
}
```

## Deploy to Render via GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/devblog.git
   git push -u origin main
   ```

2. **Create a Render Web Service**
   - Go to [render.com](https://render.com) → New → Web Service
   - Connect your GitHub account and select this repo
   - Render will auto-detect `render.yaml` and configure everything
   - Click **Create Web Service**

3. **That's it!** Render will:
   - Run `npm install`
   - Start with `npm start`
   - Auto-deploy on every push to `main`

## Project Structure

```
devblog/
├── server.js          # Express server + all routes
├── render.yaml        # Render deployment config
├── package.json
├── src/
│   └── data/
│       └── posts.js   # All blog post content
└── public/
    ├── style.css      # All styles
    └── main.js        # Client-side JS
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Markdown**: marked + highlight.js
- **Fonts**: Playfair Display, DM Sans, JetBrains Mono
- **Deployment**: Render
