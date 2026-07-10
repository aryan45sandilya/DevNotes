'use client';

// useMarkdown — returns derived stats from a markdown string.
// Centralises word count, line count, and read-time calculations
// so Editor and NoteCard both derive from the same logic.

import { useMemo } from 'react';

interface MarkdownStats {
  wordCount: number;
  lineCount: number;
  /** Estimated reading time in minutes (200 wpm). */
  readTime: number;
  charCount: number;
}

export function useMarkdown(content: string): MarkdownStats {
  return useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    return {
      wordCount: words.length,
      lineCount: content.split('\n').length,
      readTime:  Math.max(1, Math.ceil(words.length / 200)),
      charCount: content.length,
    };
  }, [content]);
}
