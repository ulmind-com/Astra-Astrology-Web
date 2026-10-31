"use client";

/**
 * The astrologer's reply, rendered.
 *
 * The model is asked for structured readings — headed sections, bold terms,
 * and tables of planet against effect — and it answers in Markdown. The chat
 * printed that Markdown as plain text, so a reading arrived as a wall of `##`,
 * `**` and pipe characters with the table rows running together.
 *
 * Two things here are about the chat bubble specifically rather than about
 * Markdown:
 *
 * Tables scroll sideways inside their own box. A reading's table is often five
 * columns of Bengali, which is far wider than a phone; without the scroller it
 * either stretches the bubble past the screen edge or squeezes every column to
 * one character per line.
 *
 * Spacing is tighter than prose would normally use. These are chat messages,
 * and a reply with ordinary heading margins looks like a document someone
 * pasted in rather than something said.
 *
 * Raw HTML is not enabled. react-markdown ignores it unless `rehype-raw` is
 * added, and it should stay that way: the text comes from a language model, and
 * nothing it writes should ever become markup.
 */

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export function AiMarkdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("ai-markdown text-xs leading-relaxed sm:text-sm", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // The model writes ## and ### for its section headings. In a chat
          // bubble those are not page headings, so they are rendered as strong
          // labels at close to body size rather than as display type.
          h1: ({ children }) => (
            <h4 className="mt-4 mb-2 font-display text-base font-bold text-amber-950 border-b border-amber-200/50 pb-1 first:mt-0 sm:text-lg">
              {children}
            </h4>
          ),
          h2: ({ children }) => (
            <h4 className="mt-4 mb-1.5 font-display text-sm font-bold text-amber-900 first:mt-0 sm:text-base">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="mt-3 mb-1 font-sans text-[13px] font-bold text-amber-900/90 first:mt-0 sm:text-sm">
              {children}
            </h5>
          ),
          h4: ({ children }) => (
            <h5 className="mt-3 mb-1 font-sans text-[13px] font-bold text-amber-900/90 first:mt-0">{children}</h5>
          ),

          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0 leading-relaxed text-slate-800">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-amber-950">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-700">{children}</em>,

          ul: ({ children }) => (
            <ul className="my-2 list-disc space-y-1 ps-5 marker:text-amber-600">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 list-decimal space-y-1 ps-5 marker:text-amber-600 font-medium">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed text-slate-800">{children}</li>,

          // The scroller is the point. Without it a five-column reading table
          // pushes the bubble past the edge of a phone screen.
          table: ({ children }) => (
            <div className="my-3 -mx-1 overflow-x-auto rounded-xl border border-amber-200/60 shadow-xs bg-amber-50/20">
              <table className="w-full min-w-max border-collapse text-[11px] sm:text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-amber-100/90 via-amber-50/80 to-amber-100/90 text-amber-950 font-bold border-b border-amber-200/70">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-r border-amber-200/50 last:border-r-0 px-3 py-2 text-start font-bold align-top">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-r border-amber-200/40 last:border-r-0 px-3 py-2 align-top text-slate-800">{children}</td>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-3 border-s-4 border-amber-500/80 bg-amber-50/40 rounded-r-xl py-2 px-3.5 italic text-amber-950 shadow-2xs">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-amber-100/80 text-amber-900 px-1.5 py-0.5 font-mono text-[0.9em] font-medium border border-amber-200/50">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-2.5 overflow-x-auto rounded-xl bg-slate-900 text-amber-100 p-3 text-[11px] border border-amber-500/20 font-mono">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-3 border-amber-200/50" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline underline-offset-2 hover:text-amber-800 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
