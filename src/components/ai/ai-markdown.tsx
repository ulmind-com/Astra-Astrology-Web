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
            <h4 className="mt-4 mb-1.5 text-sm font-bold first:mt-0 sm:text-base">
              {children}
            </h4>
          ),
          h2: ({ children }) => (
            <h4 className="mt-4 mb-1.5 text-sm font-bold first:mt-0 sm:text-base">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="mt-3 mb-1 text-[13px] font-bold first:mt-0 sm:text-sm">
              {children}
            </h5>
          ),
          h4: ({ children }) => (
            <h5 className="mt-3 mb-1 text-[13px] font-bold first:mt-0">{children}</h5>
          ),

          p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,

          ul: ({ children }) => (
            <ul className="my-1.5 list-disc space-y-0.5 ps-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 list-decimal space-y-0.5 ps-5">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          // The scroller is the point. Without it a five-column reading table
          // pushes the bubble past the edge of a phone screen.
          table: ({ children }) => (
            <div className="my-2.5 -mx-1 overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-[11px] sm:text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-current/[0.06]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-current/15 px-2 py-1.5 text-start font-bold align-top">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-current/15 px-2 py-1.5 align-top">{children}</td>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-2 border-s-2 border-current/25 ps-3 italic opacity-90">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-current/[0.08] px-1 py-0.5 font-mono text-[0.92em]">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-lg bg-current/[0.06] p-2.5 text-[11px]">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-3 border-current/15" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
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
