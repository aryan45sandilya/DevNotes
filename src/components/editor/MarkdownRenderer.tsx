'use client';

import React, { useState } from 'react';
import { Check, Copy, AlertTriangle, Info, Sparkles } from 'lucide-react';

interface Props {
  content: string;
}

// ── Inline token parser ───────────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];
  const tokens: { type: string; text: string; href?: string }[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) { tokens.push({ type: 'code', text: text.slice(i + 1, end) }); i = end + 1; continue; }
    }
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) { tokens.push({ type: 'bold', text: text.slice(i + 2, end) }); i = end + 2; continue; }
    }
    if (text[i] === '*' && !text.startsWith('**', i)) {
      const end = text.indexOf('*', i + 1);
      if (end !== -1) { tokens.push({ type: 'italic', text: text.slice(i + 1, end) }); i = end + 1; continue; }
    }
    if (text.startsWith('~~', i)) {
      const end = text.indexOf('~~', i + 2);
      if (end !== -1) { tokens.push({ type: 'strike', text: text.slice(i + 2, end) }); i = end + 2; continue; }
    }
    if (text[i] === '[') {
      const eb = text.indexOf(']', i);
      if (eb !== -1 && text[eb + 1] === '(') {
        const ep = text.indexOf(')', eb + 2);
        if (ep !== -1) {
          tokens.push({ type: 'link', text: text.slice(i + 1, eb), href: text.slice(eb + 2, ep) });
          i = ep + 1; continue;
        }
      }
    }
    let next = text.length;
    for (const sp of ['`', '**', '*', '~~', '[']) {
      const pos = text.indexOf(sp, i);
      if (pos !== -1 && pos < next) next = pos;
    }
    if (next === i) {
      // No special char found at current position — advance by 1 to avoid infinite loop
      tokens.push({ type: 'text', text: text[i] });
      i += 1;
    } else {
      tokens.push({ type: 'text', text: text.slice(i, next) });
      i = next;
    }
  }

  return tokens.map((tok, idx) => {
    switch (tok.type) {
      case 'code':   return <code key={idx} className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-white/5 border border-white/5 text-cyber-cyan whitespace-nowrap">{tok.text}</code>;
      case 'bold':   return <strong key={idx} className="font-extrabold text-[var(--text-primary)]">{tok.text}</strong>;
      case 'italic': return <em key={idx} className="italic text-[var(--text-secondary)]">{tok.text}</em>;
      case 'strike': return <span key={idx} className="line-through text-[var(--text-muted)]">{tok.text}</span>;
      case 'link':   return <a key={idx} href={tok.href} target="_blank" rel="noopener noreferrer" className="text-cyber-purple hover:text-cyber-cyan underline transition-colors">{tok.text}</a>;
      default:       return <React.Fragment key={idx}>{tok.text}</React.Fragment>;
    }
  });
}

// ── Syntax highlighter ────────────────────────────────────
function highlightCode(raw: string, lang: string): React.ReactNode[] {
  return raw.split('\n').map((ln, idx) => {
    let html = ln;
    if (lang === 'json') {
      html = ln
        .replace(/(".*?")(\s*:)/g, '<span class="text-cyber-cyan font-medium">$1</span>$2')
        .replace(/(:\s*)(".*?")/g, '$1<span class="text-cyber-lime">$2</span>')
        .replace(/(:\s*)(\d+)/g, '$1<span class="text-cyber-purple font-bold">$2</span>');
    } else {
      html = ln
        .replace(/\b(const|let|var|function|return|import|export|class|extends|new|async|await|try|catch|from|default|type|interface)\b/g, '<span class="text-cyber-purple font-semibold">$1</span>')
        .replace(/\b(string|number|boolean|any|null|undefined|void|React|ReactNode)\b/g, '<span class="text-cyber-cyan font-medium">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-cyber-lime">$1</span>')
        .replace(/(\/\/.*)$/gm, '<span class="text-gray-500 italic">$1</span>');
    }
    return <div key={idx} className="h-5 whitespace-pre font-mono" dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
  });
}

export default function MarkdownRenderer({ content }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = (line.match(/```(\w*)/) ?? [])[1] || 'plaintext';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { codeLines.push(lines[i]); i++; }
      i++;
      const code = codeLines.join('\n');
      const blockId = `block-${i}`;
      elements.push(
        <div key={blockId} className="my-5 rounded-lg border border-[var(--border-subtle)] overflow-hidden font-mono text-xs shadow-lg bg-[var(--bg-panel)]">
          <div className="flex justify-between items-center px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border-subtle)]">
            <span className="text-[10px] tracking-wider text-[var(--text-muted)] uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse" />{lang}
            </span>
            <button
              onClick={() => handleCopy(code, blockId)}
              className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
              aria-label="Copy code"
            >
              {copiedId === blockId
                ? <><Check className="w-3.5 h-3.5 text-cyber-lime" /><span className="text-cyber-lime">Copied</span></>
                : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>}
            </button>
          </div>
          <div className="p-4 overflow-x-auto flex gap-4 leading-relaxed">
            <div className="text-[var(--text-muted)] text-right select-none pr-2 border-r border-[var(--border-subtle)] hidden sm:block">
              {codeLines.map((_, idx) => <div key={idx} className="h-5">{idx + 1}</div>)}
            </div>
            <div className="flex-1 text-[var(--text-secondary)]">{highlightCode(code, lang)}</div>
          </div>
        </div>
      );
      continue;
    }

    // Blockquote / alert
    if (line.trim().startsWith('>')) {
      const qLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) { qLines.push(lines[i].trim().slice(1).trim()); i++; }
      const full  = qLines.join('\n');
      const isTip = full.startsWith('[!TIP]');
      const isWarn = full.startsWith('**CRITICAL') || full.startsWith('[!WARNING]');
      let clean = full, title = 'REFERENCE';
      let theme = 'border-cyber-purple/50 bg-cyber-purple/5 text-cyber-purple';
      let Icon: React.ElementType = Info;
      if (isTip)  { clean = full.replace('[!TIP]', '').trim(); title = 'NEURAL TIP';      theme = 'border-cyber-cyan/50 bg-cyber-cyan/5 text-cyber-cyan'; Icon = Sparkles; }
      if (isWarn) {                                              title = 'CRITICAL WARNING'; theme = 'border-cyber-lime/50 bg-cyber-lime/5 text-cyber-lime'; Icon = AlertTriangle; }
      elements.push(
        <div key={`q-${i}`} className={`my-4 p-4 rounded-r-lg border-l-4 glass-panel flex gap-3 items-start ${theme}`}>
          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] tracking-widest font-bold font-display uppercase block mb-1">{title}</span>
            <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {clean.split('\n').map((ln, qi) => <p key={qi}>{parseInline(ln)}</p>)}
            </div>
          </div>
        </div>
      );
      continue;
    }

    // Table
    if (line.trim().startsWith('|') && lines[i + 1]?.includes('-')) {
      const headers = line.split('|').map(s => s.trim()).filter(Boolean);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].split('|').map(s => s.trim()).filter((_, ci, arr) => ci > 0 && ci < arr.length - 1));
        i++;
      }
      elements.push(
        <div key={`tbl-${i}`} className="my-5 overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {headers.map((h, hi) => <th key={hi} className="p-3 text-[11px] font-bold uppercase text-cyber-cyan tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
                  {headers.map((_, ci) => <td key={ci} className="p-3 text-[var(--text-secondary)] leading-relaxed">{parseInline(row[ci] || '')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('#')) {
      const m = line.match(/^(#{1,6})\s+(.*)$/);
      if (m) {
        const level = m[1].length, text = m[2];
        if (level === 1) elements.push(
          <div key={`h1-${i}`} className="mt-6 mb-4">
            <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-cyber-purple font-mono">#</span>{parseInline(text)}
            </h1>
            <div className="h-[2px] w-full bg-gradient-to-r from-cyber-purple/50 via-cyber-cyan/30 to-transparent mt-2 rounded" />
          </div>
        );
        else if (level === 2) elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-bold font-display text-[var(--text-primary)] mt-6 mb-3 flex items-center gap-2 border-b border-[var(--border-subtle)] pb-1">
            <span className="text-cyber-cyan font-mono">##</span>{parseInline(text)}
          </h2>
        );
        else elements.push(
          <h3 key={`h3-${i}`} className="text-sm font-semibold font-display text-[var(--text-primary)] mt-5 mb-2 flex items-center gap-1.5">
            <span className="text-cyber-lime font-mono">###</span>{parseInline(text)}
          </h3>
        );
        i++; continue;
      }
    }

    // Lists
    if (/^(\s*)([-*]|\d+\.)\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^(\s*)([-*]|\d+\.)\s/.test(lines[i])) {
        const l = lines[i].trim();
        if (l.startsWith('- [x]') || l.startsWith('- [ ]')) {
          const checked = l.startsWith('- [x]');
          items.push(
            <li key={`li-${i}`} className="flex items-center gap-2.5 text-sm my-1 text-[var(--text-secondary)]">
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-cyber-purple/20 border-cyber-purple' : 'border-gray-600'}`}>
                {checked && <div className="w-2 h-2 rounded-sm bg-cyber-cyan" />}
              </div>
              <span className={checked ? 'line-through text-[var(--text-muted)]' : ''}>{parseInline(l.slice(5).trim())}</span>
            </li>
          );
        } else if (l.startsWith('- ') || l.startsWith('* ')) {
          items.push(
            <li key={`li-${i}`} className="list-none pl-4 relative text-sm my-1 text-[var(--text-secondary)]">
              <span className="absolute left-0 top-[8px] w-1.5 h-1.5 rounded-full bg-cyber-cyan shrink-0" />
              {parseInline(l.slice(2))}
            </li>
          );
        } else {
          const om = l.match(/^(\d+)\.\s+(.*)/);
          if (om) items.push(
            <li key={`li-${i}`} className="list-none pl-6 relative text-sm my-1 text-[var(--text-secondary)]">
              <span className="absolute left-0 top-0 text-cyber-lime font-mono text-xs font-bold">{om[1]}.</span>
              {parseInline(om[2])}
            </li>
          );
        }
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="my-3 space-y-1">{items}</ul>);
      continue;
    }

    // Paragraph / blank
    if (line.trim()) {
      elements.push(<p key={`p-${i}`} className="my-3 text-sm text-[var(--text-secondary)] leading-relaxed">{parseInline(line)}</p>);
    } else {
      elements.push(<div key={`br-${i}`} className="h-2" />);
    }
    i++;
  }

  return <div className="prose max-w-none">{elements}</div>;
}
