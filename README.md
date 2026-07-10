<div align="center">

<br />

# ⚡ DevOS Notes
### A Notion-Inspired Technical Knowledge Workspace

<br />

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br />

> Organize your code snippets, documentation, and technical references — all in one place, right in your browser.

<br />

🔗 **Live Demo:** https://dev-notes-kdjt.vercel.app  
📁 **GitHub Repo:** https://github.com/aryan45sandilya/DevNotes

<br />

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Rich Markdown Editor** | Write in raw markdown with live syntax highlighting, line numbers, and instant preview split |
| 📁 **Folder & Note Management** | Create, rename, and delete folders; create notes per folder with full CRUD |
| 🔍 **Command Palette Search** | `Ctrl+K` full-text search across all notes, tags, and folders with keyboard navigation |
| 📌 **Pin & Favourite Notes** | Pin notes to the top; mark favourites and filter your list by them |
| 🏷️ **Tags & Categories** | Add multiple tags per note; filter and search by tag across the workspace |
| 🌙 **Dark / Light Mode** | System-agnostic toggle — persists your preference across sessions |
| 📱 **Responsive Design** | Fully functional on mobile, tablet, and desktop with an adaptive sidebar |
| 💾 **Local Storage Persistence** | Everything saves to `localStorage` automatically — no backend, no signup |
| 📊 **Activity Heatmap** | GitHub-style heatmap showing your writing activity over the past 24 weeks |
| 🗒️ **Sticky Scratchpads** | Quick-access colour-coded sticky notes for ephemeral thoughts |
| 📤 **Export / Import** | Back up your entire workspace as a `.json` file and restore it anytime |

---

## 🖥️ Screenshots

> *(Add screenshots here after deployment)*

---

## 🏗️ Project Architecture

Feature-based modular structure following Next.js 15 App Router best practices:

```
src/
├── app/                        # Next.js App Router entry
│   ├── globals.css             # ← Single source of truth for all design tokens
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── editor/                 # Editor, Toolbar, MarkdownRenderer, EditorHeader
│   ├── sidebar/                # Sidebar, FolderTree, CommandPalette, SearchBar, DarkModeToggle
│   ├── notes/                  # NoteList, NoteCard, NoteActions, StickyNotes
│   ├── dashboard/              # StatsPanel, Heatmap, TimelinePanel, ActivityPanel
│   ├── common/                 # Toast, ClientDate, Modal, Loader, EmptyState
│   └── ui/                     # Button, Input, Card, Badge  ← reusable primitives
│
├── hooks/                      # useNotes, useTheme, useDebounce, useMarkdown, useLocalStorage
├── store/                      # Thin re-export layer (ready for Zustand migration)
├── lib/                        # storage.ts, constants.ts  ← low-level infra
├── utils/                      # date.ts, export.ts, search.ts, helpers.ts
├── context/                    # ThemeContext (next-themes wrapper)
├── data/                       # initialData.ts (seed content)
└── types/                      # index.ts (all shared TypeScript interfaces)
```

**Key design decisions:**
- `globals.css` holds all CSS custom properties (color tokens, dark/light surfaces, spacing) — components never hardcode colors
- All workspace state lives in `useNotes` hook — `page.tsx` is a thin layout orchestrator
- `store/` acts as a stable import boundary — swap hooks for Zustand later without touching components
- No external markdown library — custom renderer keeps the bundle small

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/devos-notes.git
cd devos-notes

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + CSS Custom Properties |
| **Animations** | Motion (Framer Motion v12) |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **Persistence** | Browser localStorage |
| **Fonts** | Inter · Space Grotesk · JetBrains Mono |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` | Open Command Palette |
| `Ctrl + S` | Save & log current note |
| `↑ / ↓` | Navigate palette results |
| `Enter` | Select palette item |
| `Escape` | Close palette / modal |

---

## 📦 What Gets Persisted

All data is saved to `localStorage` under these keys:

| Key | Content |
|---|---|
| `devos_folders` | Folder list |
| `devos_notes` | All notes with content, tags, pins |
| `devos_stickies` | Sticky scratchpad notes |
| `devos_activities` | Activity log (used for heatmap) |

Export your workspace anytime via the **Download** button in the header to get a portable `.json` backup.

---

## 🤝 Acknowledgements

Built as part of the **Software Development Onboarding Task** — a Notion-inspired notes application featuring rich markdown editing, folder management, search, tags, dark mode, and local storage persistence.

---

<div align="center">
  <sub>Made with ⚡ using Next.js 15 · TypeScript · Tailwind CSS</sub>
</div>
