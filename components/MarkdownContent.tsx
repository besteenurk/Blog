"use client";

import { marked } from "marked";
import { useMemo } from "react";

marked.setOptions({ breaks: true });

export default function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => marked.parse(content, { async: false }) as string, [content]);
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
