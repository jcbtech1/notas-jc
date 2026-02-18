"use client";

import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

const LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  rb: "ruby",
  sh: "bash",
  yml: "yaml",
  md: "markdown",
};

function normalizeLanguage(lang: string | undefined): string {
  if (!lang) return "text";
  const lower = lang.toLowerCase();
  return LANGUAGE_MAP[lower] || lower;
}

export default function CodeBlockView({ node, updateAttributes, extension }: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const language = normalizeLanguage(node.attrs.language);
  const code = node.textContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="relative group my-4">
      {/* Language selector */}
      <div className="flex items-center justify-between bg-[#0d1117] border border-cyan-900 rounded-t px-3 py-1.5">
        <select
          contentEditable={false}
          value={node.attrs.language || ""}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="bg-transparent text-cyan-400 text-xs font-mono border-none outline-none cursor-pointer"
        >
          <option value="">AUTO_DETECT</option>
          {(extension.options.lowlight?.listLanguages?.() || [
            "javascript", "typescript", "python", "java", "csharp",
            "cpp", "go", "rust", "bash", "sql", "html", "css",
            "json", "yaml", "markdown", "plaintext",
          ]).map((lang: string) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Copy button */}
        <button
          contentEditable={false}
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-all ${
            copied
              ? "text-green-400 border border-green-500/30"
              : "text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(0,255,255,0.2)]"
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>

      {/* Code display (syntax highlighted) — read preview overlay */}
      <div className="relative">
        <pre className="!m-0 !rounded-t-none bg-[#0d1117] border border-t-0 border-cyan-900 rounded-b p-0 overflow-hidden">
          <code className={`language-${language} block p-4 text-sm font-mono outline-none`} style={{ color: "#e5e5e5", tabSize: 2 }}>
            <NodeViewContent />
          </code>
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
