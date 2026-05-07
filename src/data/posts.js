const posts = [
  {
    id: 1,
    slug: "getting-started-with-rust",
    title: "Getting Started with Rust in 2025",
    excerpt: "Rust has taken the systems programming world by storm. Here's everything you need to know to write your first safe, blazing-fast program.",
    content: `
# Getting Started with Rust in 2025

Rust has consistently topped the "most loved language" charts, and for good reason. It offers memory safety without a garbage collector, zero-cost abstractions, and a wonderfully expressive type system.

## Why Rust?

The core promise of Rust is simple: **no memory bugs, no data races, no undefined behavior** — all checked at compile time.

\`\`\`rust
fn main() {
    let s = String::from("hello, world");
    println!("{}", s);
}
\`\`\`

## Ownership — The Key Concept

Every value in Rust has a single owner. When the owner goes out of scope, the value is dropped.

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved here
    // println!("{}", s1); // This would error!
    println!("{}", s2); // This is fine
}
\`\`\`

## Borrowing

Rather than moving ownership, you can *borrow* references:

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);
}
\`\`\`

## Getting Started

Install Rust via \`rustup\`:

\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
\`\`\`

Then create your first project:

\`\`\`bash
cargo new hello_world
cd hello_world
cargo run
\`\`\`

## Conclusion

Rust has a steep learning curve, but once it clicks, you'll find yourself writing more correct, faster code than ever before. The compiler is your best friend.
    `,
    author: "Alex Chen",
    authorAvatar: "AC",
    date: "2025-04-28",
    readTime: "7 min read",
    tags: ["Rust", "Systems", "Beginner"],
    featured: true
  },
  {
    id: 2,
    slug: "react-server-components-deep-dive",
    title: "React Server Components: A Deep Dive",
    excerpt: "Server Components fundamentally change how we think about data fetching and rendering. Let's explore what they are and when to use them.",
    content: `
# React Server Components: A Deep Dive

React Server Components (RSC) represent the biggest architectural shift in React since hooks. They allow components to run exclusively on the server, with zero JavaScript sent to the client.

## What Are Server Components?

Server Components execute on the server and send **rendered HTML** to the client — not JavaScript. This means:

- No bundle size impact
- Direct database/filesystem access
- Automatic data fetching without useEffect

\`\`\`jsx
// This component runs ONLY on the server
async function BlogPost({ id }) {
  const post = await db.posts.find(id); // Direct DB access!
  return <article>{post.content}</article>;
}
\`\`\`

## Client vs Server Components

| Feature | Server | Client |
|---------|--------|--------|
| useState | ❌ | ✅ |
| useEffect | ❌ | ✅ |
| DB Access | ✅ | ❌ |
| Bundle size | 0kb | Counted |

## When to Use Each

Use **Server Components** for:
- Data fetching
- Large dependencies (markdown parsers, etc.)
- Accessing backend resources

Use **Client Components** for:
- Interactivity
- Browser APIs
- Event listeners

## The "use client" Directive

\`\`\`jsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## Conclusion

Server Components aren't a replacement for Client Components — they're complementary. The key insight is to push as much rendering server-side as possible, reserving client components for truly interactive pieces.
    `,
    author: "Maya Patel",
    authorAvatar: "MP",
    date: "2025-04-15",
    readTime: "9 min read",
    tags: ["React", "Next.js", "Frontend"],
    featured: true
  },
  {
    id: 3,
    slug: "docker-compose-production",
    title: "Docker Compose for Production: Best Practices",
    excerpt: "Most tutorials show Docker Compose for local dev. But with the right configuration, it's perfectly capable of running production workloads.",
    content: `
# Docker Compose for Production: Best Practices

While Kubernetes gets all the hype, Docker Compose is often the right tool for smaller teams running production workloads. Here's how to do it properly.

## The Basics: A Production-Ready Compose File

\`\`\`yaml
version: "3.9"

services:
  app:
    image: myapp:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

volumes:
  pgdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt
\`\`\`

## Key Production Practices

### 1. Always Set restart: unless-stopped

This ensures your containers come back up after a server reboot.

### 2. Use Healthchecks

Docker won't mark a container healthy until the healthcheck passes. This prevents traffic from hitting an unready app.

### 3. Use Secrets for Sensitive Data

Never put passwords directly in environment variables. Use Docker secrets or external secret managers.

### 4. Pin Image Versions

\`\`\`yaml
# Bad
image: postgres:latest

# Good  
image: postgres:16.1-alpine
\`\`\`

## Deploying Updates

\`\`\`bash
docker compose pull
docker compose up -d --no-deps --build app
\`\`\`

The \`--no-deps\` flag updates only your app container, leaving the database untouched.

## Conclusion

Docker Compose is a powerful, underrated production tool. For teams that don't need the complexity of Kubernetes, it strikes the perfect balance of simplicity and reliability.
    `,
    author: "Sam Torres",
    authorAvatar: "ST",
    date: "2025-03-30",
    readTime: "6 min read",
    tags: ["Docker", "DevOps", "Production"],
    featured: false
  },
  {
    id: 4,
    slug: "typescript-5-new-features",
    title: "TypeScript 5.x: The Features That Matter",
    excerpt: "TypeScript keeps shipping quality-of-life improvements. Here are the features from the 5.x series that will actually change how you write code.",
    content: `
# TypeScript 5.x: The Features That Matter

TypeScript 5 brought a wave of genuinely useful features. Let's focus on the ones with real day-to-day impact.

## Decorators (Finally, the Standard Way)

TypeScript 5.0 ships decorators that follow the TC39 standard — no more \`experimentalDecorators\`.

\`\`\`typescript
function logged(target: any, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    console.log(\`Calling \${String(context.name)}\`);
    return target.call(this, ...args);
  };
}

class UserService {
  @logged
  getUser(id: string) {
    return { id, name: "Alice" };
  }
}
\`\`\`

## const Type Parameters

\`\`\`typescript
function identity<const T>(value: T): T {
  return value;
}

const result = identity(["a", "b", "c"]);
// Type: readonly ["a", "b", "c"] — not string[]!
\`\`\`

## Variadic Tuple Types Improvements

\`\`\`typescript
type Strings = [string, string];
type Numbers = [number, number];
type Mixed = [...Strings, ...Numbers];
// Type: [string, string, number, number]
\`\`\`

## Better \`satisfies\` Usage

\`\`\`typescript
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Record<string, string | number[]>;

// palette.red is number[], not string | number[]
palette.red.map(v => v * 2); // ✅ Works!
\`\`\`

## Conclusion

TypeScript 5.x is a mature, thoughtful release. Standard decorators alone justify upgrading — paired with const type parameters, your types will be dramatically more precise.
    `,
    author: "Alex Chen",
    authorAvatar: "AC",
    date: "2025-03-10",
    readTime: "5 min read",
    tags: ["TypeScript", "JavaScript", "Frontend"],
    featured: false
  },
  {
    id: 5,
    slug: "building-cli-tools-with-go",
    title: "Building Beautiful CLI Tools with Go",
    excerpt: "Go's static binaries and excellent stdlib make it ideal for CLI tools. Learn how to build polished, user-friendly command-line applications.",
    content: `
# Building Beautiful CLI Tools with Go

Go is one of the best languages for CLI tools: fast compilation, single static binary, excellent standard library. Let's build something polished.

## Project Setup

\`\`\`bash
go mod init github.com/yourname/mytool
\`\`\`

Add the essentials:

\`\`\`bash
go get github.com/spf13/cobra
go get github.com/charmbracelet/bubbletea
go get github.com/charmbracelet/lipgloss
\`\`\`

## A Basic Command with Cobra

\`\`\`go
package main

import (
    "fmt"
    "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
    Use:   "mytool",
    Short: "A beautiful CLI tool",
    Long:  "A longer description of your amazing CLI tool",
}

var greetCmd = &cobra.Command{
    Use:   "greet [name]",
    Short: "Greet someone",
    Args:  cobra.ExactArgs(1),
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Printf("Hello, %s!\\n", args[0])
    },
}

func main() {
    rootCmd.AddCommand(greetCmd)
    rootCmd.Execute()
}
\`\`\`

## Beautiful Output with Lipgloss

\`\`\`go
import "github.com/charmbracelet/lipgloss"

var style = lipgloss.NewStyle().
    Bold(true).
    Foreground(lipgloss.Color("#FF5F87")).
    Background(lipgloss.Color("#1a1a2e")).
    PaddingTop(1).
    PaddingBottom(1).
    PaddingLeft(4).
    PaddingRight(4)

fmt.Println(style.Render("Hello from your beautiful CLI!"))
\`\`\`

## Building & Distributing

\`\`\`bash
# Build for current platform
go build -o mytool .

# Cross-compile for Linux
GOOS=linux GOARCH=amd64 go build -o mytool-linux .

# Cross-compile for Windows
GOOS=windows GOARCH=amd64 go build -o mytool.exe .
\`\`\`

## Conclusion

Go's ecosystem for CLI tools is world-class. Cobra handles argument parsing, Bubbletea handles interactive TUIs, and Lipgloss handles styling. The result: beautiful, fast, single-binary tools your users will love.
    `,
    author: "Jordan Kim",
    authorAvatar: "JK",
    date: "2025-02-20",
    readTime: "8 min read",
    tags: ["Go", "CLI", "Tools"],
    featured: false
  },
  {
    id: 6,
    slug: "postgres-performance-tips",
    title: "PostgreSQL Performance: 10 Tips That Actually Work",
    excerpt: "After running Postgres in production for years, these are the optimizations that moved the needle. No fluff, just results.",
    content: `
# PostgreSQL Performance: 10 Tips That Actually Work

PostgreSQL is incredibly powerful out of the box, but production workloads demand tuning. Here are the tips that genuinely make a difference.

## 1. Use EXPLAIN ANALYZE Religiously

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM users
WHERE email = 'test@example.com';
\`\`\`

The \`BUFFERS\` option shows cache hits vs disk reads — often the key insight.

## 2. Index What You Query

\`\`\`sql
-- Add index for common filter
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Partial index for active users only
CREATE INDEX CONCURRENTLY idx_active_users 
ON users(created_at) 
WHERE active = true;
\`\`\`

Use \`CONCURRENTLY\` to avoid locking the table.

## 3. Tune shared_buffers

Set it to 25% of RAM:

\`\`\`conf
# postgresql.conf
shared_buffers = 4GB  # for a 16GB server
\`\`\`

## 4. Use Connection Pooling (PgBouncer)

Each Postgres connection uses ~5-10MB RAM. At 500 connections, that's 5GB just for connections. PgBouncer multiplexes thousands of app connections into a handful of real DB connections.

## 5. Avoid SELECT *

\`\`\`sql
-- Bad: fetches all columns
SELECT * FROM users WHERE id = 1;

-- Good: fetch only what you need
SELECT id, name, email FROM users WHERE id = 1;
\`\`\`

## 6. Use Bulk Inserts

\`\`\`sql
-- Bad: 1000 round trips
INSERT INTO logs VALUES (...);
INSERT INTO logs VALUES (...);

-- Good: 1 round trip
INSERT INTO logs VALUES
  (...),
  (...),
  (...);
\`\`\`

## Conclusion

Performance tuning is iterative. Start with EXPLAIN ANALYZE, add indexes, tune memory settings, then add connection pooling. Most applications see 10-100x improvements from just these steps.
    `,
    author: "Maya Patel",
    authorAvatar: "MP",
    date: "2025-02-05",
    readTime: "10 min read",
    tags: ["PostgreSQL", "Database", "Performance"],
    featured: false
  }
];

module.exports = posts;
