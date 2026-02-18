"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect, useRef, useCallback } from "react";

import EditorToolbar from "./Toolbar";
import CodeBlockView from "./CodeBlockView";
import { useTheme } from "@/lib/ThemeContext";

const lowlight = createLowlight(common);

// Patterns that auto-detect code when typed at line start
const CODE_PATTERNS = [
  /^(import |from |export |const |let |var |function |class |interface |type )/,
  /^(git |npm |npx |yarn |pnpm |pip |cargo |docker |kubectl )/,
  /^(public |private |protected |static |void |int |string |bool )/,
  /^(def |if __name__|print\(|console\.log)/,
  /^(<\?php|<html|<div|<script)/,
  /^(SELECT |INSERT |UPDATE |DELETE |CREATE |DROP |ALTER )/i,
  /^\$ /,
  /^#!\//,
];

interface Props {
  contenido: string;
  onChange: (html: string) => void;
  editable: boolean;
}

export default function TiptapEditor({ contenido, onChange, editable }: Props) {
  const { theme, colors } = useTheme();
  const isInitialMount = useRef(true);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // replaced by CodeBlockLowlight
      }),
      Underline,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }).configure({
        lowlight,
        defaultLanguage: "text",
      }),
    ],
    content: contenido,
    editable,
    editorProps: {
      attributes: {
        class: "outline-none min-h-[55vh] p-4 sm:p-6 prose-invert max-w-none",
        spellcheck: "false",
      },
      handleKeyDown: (_view, event) => {
        // Auto-detect code: when Enter is pressed, check if current paragraph looks like code
        if (event.key === "Enter" && editor && !editor.isActive("codeBlock")) {
          const { from } = editor.state.selection;
          const $pos = editor.state.doc.resolve(from);
          const textBefore = $pos.parent.textContent;

          if (CODE_PATTERNS.some((p) => p.test(textBefore))) {
            // Convert the current node to a code block
            editor
              .chain()
              .focus()
              .setCodeBlock()
              .run();
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Sync content on initial load only
  useEffect(() => {
    if (editor && isInitialMount.current && contenido) {
      editor.commands.setContent(contenido);
      isInitialMount.current = false;
    }
  }, [editor, contenido]);

  return (
    <div className="w-full">
      {editable && <EditorToolbar editor={editor} />}

      <div
        className={`${colors.card} border ${colors.border} ${
          editable ? "rounded-b-lg border-t-0" : "rounded-lg"
        } transition-colors overflow-hidden`}
      >
        {/* Editor styles scoped */}
        <style jsx global>{`
          .tiptap {
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
            font-size: 0.875rem;
            line-height: 1.7;
            color: ${theme === "AEGIS_DARK" ? "#d4d4d4" : "#2c2c2c"};
          }
          .tiptap h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${colors.accent};
            margin: 1rem 0 0.5rem;
            border-bottom: 1px solid ${colors.accent}33;
            padding-bottom: 0.25rem;
          }
          .tiptap h2 {
            font-size: 1.25rem;
            font-weight: 700;
            color: ${colors.accent};
            margin: 0.875rem 0 0.375rem;
          }
          .tiptap h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: ${colors.accent}cc;
            margin: 0.75rem 0 0.375rem;
          }
          .tiptap p {
            margin: 0.375rem 0;
          }
          .tiptap ul, .tiptap ol {
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .tiptap li {
            margin: 0.25rem 0;
          }
          .tiptap ul li::marker {
            color: ${colors.accent};
          }
          .tiptap ol li::marker {
            color: ${colors.accent};
          }
          .tiptap blockquote {
            border-left: 3px solid ${colors.accent};
            padding-left: 1rem;
            margin: 0.75rem 0;
            opacity: 0.85;
            font-style: italic;
          }
          .tiptap code:not(pre code) {
            background: ${colors.accent}15;
            border: 1px solid ${colors.accent}30;
            border-radius: 3px;
            padding: 0.1rem 0.3rem;
            font-size: 0.8rem;
            color: ${colors.accent};
          }
          .tiptap hr {
            border-color: ${colors.accent}33;
            margin: 1rem 0;
          }
          .tiptap strong {
            color: ${theme === "AEGIS_DARK" ? "#ffffff" : "#000000"};
          }
          .tiptap p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: ${theme === "AEGIS_DARK" ? "#555" : "#aaa"};
            pointer-events: none;
            height: 0;
          }
        `}</style>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
