'use client';

import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export default function MathRenderer({ content, className = '', inline = false }: MathRendererProps) {
  if (!content) return null;

  // Split content by $$ (block math) and $ (inline math)
  const renderFormattedText = (raw: string) => {
    // Process block math ($$...$$) first
    const blockParts = raw.split(/(\$\$[\s\S]*?\$\$)/g);

    return blockParts.map((blockPart, bIdx) => {
      if (blockPart.startsWith('$$') && blockPart.endsWith('$$')) {
        const mathExpr = blockPart.slice(2, -2).trim();
        try {
          const html = katex.renderToString(mathExpr, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`block-${bIdx}`}
              className="my-3 overflow-x-auto py-1 text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <pre key={`block-err-${bIdx}`} className="text-red-500 font-mono text-xs">
              {blockPart}
            </pre>
          );
        }
      }

      // Process inline math ($...$) within non-block text
      const inlineParts = blockPart.split(/(\$[^\$]+?\$)/g);
      return (
        <span key={`inline-wrapper-${bIdx}`}>
          {inlineParts.map((part, iIdx) => {
            if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
              const expr = part.slice(1, -1).trim();
              try {
                const html = katex.renderToString(expr, {
                  displayMode: false,
                  throwOnError: false,
                });
                return (
                  <span
                    key={`math-${iIdx}`}
                    className="inline-math px-0.5"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch {
                return (
                  <span key={`math-err-${iIdx}`} className="text-red-500 font-mono text-xs">
                    {part}
                  </span>
                );
              }
            }
            // Normal text: handle line breaks
            return (
              <span key={`text-${iIdx}`} className="whitespace-pre-wrap">
                {part}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return <div className={`prose-math leading-relaxed ${className}`}>{renderFormattedText(content)}</div>;
}
