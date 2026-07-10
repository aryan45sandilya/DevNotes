import type { Note, Folder, StickyNote, ActivityLog } from '@/types';

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'f-react', name: 'React 19 & Frontend', icon: 'Atom',   color: 'cyan'   },
  { id: 'f-next',  name: 'Next.js Arch & SSR',  icon: 'Layers', color: 'purple' },
  { id: 'f-dsa',   name: 'DSA & Hard Algos',    icon: 'Binary', color: 'lime'   },
  { id: 'f-sys',   name: 'System Design & Auth', icon: 'Cpu',   color: 'gray'   },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'n-react-19',
    title: 'React 19 New Features Cheat Sheet',
    folderId: 'f-react',
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-07T12:30:00Z',
    favorite: true,
    pinned: true,
    tags: ['React', 'Hooks', 'WebDev', 'Actions'],
    content: `# React 19 New Features & Patterns

Welcome to the **DevOS Workspace** note engine. React 19 introduces major updates to async operations, form handling, and state management.

## 1. Direct Async Actions
Instead of manual \`pending\` state toggling, you can now pass async functions directly into forms.

\`\`\`tsx
import { useActionState } from 'react';

async function updateProfile(prevState: any, formData: FormData) {
  try {
    const name = formData.get("username") as string;
    await api.post("/profile", { name });
    return { success: true, message: "Sync successful!" };
  } catch (err) {
    return { success: false, message: "System error, retry." };
  }
}

function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="username" placeholder="Enter developer handle" />
      <button disabled={isPending}>
        {isPending ? "Syncing..." : "Initialize Update"}
      </button>
      {state && <p>{state.message}</p>}
    </form>
  );
}
\`\`\`

> [!TIP]
> **React 19 Actions** automatically manage pending states, error handling, and form resetting under the hood!

## 2. The \`use\` API for Async Contexts

| Feature | Old React (<=18) | New React 19 |
| :--- | :--- | :--- |
| **Promises** | \`useEffect\` state fetching | \`const data = use(promise)\` |
| **Context** | \`useContext(Theme)\` | \`const theme = use(Theme)\` |
| **Suspense Integration** | Manual boundary setup | Native integration |

*Happy hacking! DevOS notes are stored safely inside your browser local storage.*`,
  },
  {
    id: 'n-jwt-auth',
    title: 'Symmetric JWT Authentication Flow & Security',
    folderId: 'f-sys',
    createdAt: '2026-07-03T14:15:00Z',
    updatedAt: '2026-07-06T18:40:00Z',
    favorite: true,
    pinned: false,
    tags: ['Security', 'Backend', 'JWT', 'System-Design'],
    content: `# Symmetric JWT Authentication Architecture

A review of modern token-based authorization protocols.

## Recommended Cookie Payload Layout

\`\`\`json
{
  "sub": "usr_99812",
  "name": "Alex Mercer",
  "role": "core_kernel_dev",
  "permissions": ["read:sys", "write:nodes", "execute:compiler"],
  "iat": 1783341829,
  "exp": 1783345429
}
\`\`\`

## High-Performance Middleware Flowchart

1. **Header Validation**: Check for \`Authorization: Bearer <token>\` or read secure \`httpOnly\` cookie.
2. **Signature Check**: Parse header block, apply SHA256 with workspace salt.
3. **Claim Assertions**: Verify expiration timestamp (\`exp\`) is greater than current epoch.
4. **Context Injection**: Assign decoded claims to execution threads.

### Security Best Practices
- [x] Use \`SameSite=Strict\` flag on auth cookies.
- [x] Rotate keys every 24 hours using HSM clusters.
- [x] Keep payload body under 1KB.
- [ ] Configure automatic Revocation Lists via Redis.

> **CRITICAL SEVERITY WARNING**: Never serialize raw passwords or unencrypted system parameters in JWT payloads!`,
  },
  {
    id: 'n-next-app-router',
    title: 'Next.js 15 Partial Prerendering (PPR) Cheat Sheet',
    folderId: 'f-next',
    createdAt: '2026-07-05T10:00:00Z',
    updatedAt: '2026-07-07T10:12:00Z',
    favorite: false,
    pinned: true,
    tags: ['NextJS', 'SSR', 'PPR', 'Vercel'],
    content: `# Next.js 15 Partial Prerendering (PPR)

Partial Prerendering merges static shell optimization with dynamic rendering paths in the same page.

## Core Principle

Next.js builds a **static shell** at compile time. Dynamic modules wrapped in \`<Suspense>\` are deferred until runtime.

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { StaticShell, DynamicMetrics } from '@/components';

export const experimental_ppr = true;

export default function Dashboard() {
  return (
    <main className="min-h-screen grid gap-6 p-8">
      <StaticShell title="DevOS Terminal Analytics" />
      <Suspense fallback={<MetricsSkeleton />}>
        <DynamicMetrics />
      </Suspense>
    </main>
  );
}
\`\`\`

## Why PPR is Revolutionary
- **Immediate TTFB**: HTML skeleton loads in milliseconds from nearest Edge server.
- **Dynamic Context**: Full cookie, query, and geo data available inside dynamic modules.
- **Zero Client-side Fetching Overhead**: Server streams chunks in a single TCP socket.`,
  },
  {
    id: 'n-dsa-trees',
    title: 'Red-Black Trees vs AVL Rebalancing Complexity',
    folderId: 'f-dsa',
    createdAt: '2026-07-02T11:00:00Z',
    updatedAt: '2026-07-02T11:00:00Z',
    favorite: false,
    pinned: false,
    tags: ['DSA', 'Algorithms', 'Trees', 'Complexity'],
    content: `# Red-Black vs AVL Self-Balancing Trees

A deep-dive comparison of rebalancing algorithms.

## Algorithmic Comparison

| Criterion | AVL Tree | Red-Black Tree |
| :--- | :--- | :--- |
| **Balance Severity** | Strict (\`|height_diff| <= 1\`) | Loose (paths differ up to 2×) |
| **Search** | Highly optimized | Fast, slightly slower than AVL |
| **Insertion Cost** | Max 2 rotations | Max 2 rotations + color flips |
| **Deletion Cost** | Up to \`O(log N)\` rotations | Max 3 rotations absolute |

## Left-Leaning Red-Black Tree Insertion

\`\`\`typescript
class LLRBNode<T> {
  value: T;
  left: LLRBNode<T> | null = null;
  right: LLRBNode<T> | null = null;
  color: 'RED' | 'BLACK' = 'RED';
  constructor(val: T) { this.value = val; }
}

function rotateLeft<T>(h: LLRBNode<T>): LLRBNode<T> {
  const x = h.right!;
  h.right = x.left;
  x.left = h;
  x.color = h.color;
  h.color = 'RED';
  return x;
}
\`\`\`

## Quick Recap
- **Choose AVL** for read-heavy workloads (e.g. directory name lookups).
- **Choose Red-Black** when inserts/deletes are frequent (e.g. task queues).`,
  },
];

export const INITIAL_STICKIES: StickyNote[] = [
  {
    id: 's-1',
    content: '🚀 Reviewer Goal:\nFocus on visual layouts & micro-interactions.\nCtrl+K opens command palette!',
    color: 'cyan',
    updatedAt: '2026-07-07T13:40:00Z',
  },
  {
    id: 's-2',
    content: '💡 Code Idea:\nUse Next.js PPR + custom ES module bundles on production. Keep payload low.',
    color: 'purple',
    updatedAt: '2026-07-07T13:42:00Z',
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: 'a-1', noteId: 'n-react-19',       noteTitle: 'React 19 New Features Cheat Sheet',            type: 'edit',     timestamp: '2026-07-07T12:30:00Z' },
  { id: 'a-2', noteId: 'n-next-app-router', noteTitle: 'Next.js 15 Partial Prerendering (PPR)',        type: 'pin',      timestamp: '2026-07-07T10:12:00Z' },
  { id: 'a-3', noteId: 'n-jwt-auth',        noteTitle: 'Symmetric JWT Authentication Flow & Security', type: 'favorite', timestamp: '2026-07-06T18:40:00Z' },
];
