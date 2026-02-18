"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Terminal,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

interface Props {
  editor: Editor | null;
}

interface ToolBtn {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  isActive?: () => boolean;
  separator?: false;
}

interface Separator {
  separator: true;
}

type ToolItem = ToolBtn | Separator;

export default function EditorToolbar({ editor }: Props) {
  const { colors } = useTheme();

  if (!editor) return null;

  const items: ToolItem[] = [
    {
      icon: <Bold size={15} />,
      label: "Negrita",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <Italic size={15} />,
      label: "Cursiva",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <UnderlineIcon size={15} />,
      label: "Subrayado",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: <Strikethrough size={15} />,
      label: "Tachado",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    { separator: true },
    {
      icon: <Heading1 size={15} />,
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 size={15} />,
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 size={15} />,
      label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    { separator: true },
    {
      icon: <List size={15} />,
      label: "Lista",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={15} />,
      label: "Lista numerada",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    { separator: true },
    {
      icon: <Code size={15} />,
      label: "Código inline",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      icon: <Terminal size={15} />,
      label: "Bloque de código",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      icon: <Quote size={15} />,
      label: "Cita",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: <Minus size={15} />,
      label: "Línea horizontal",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    { separator: true },
    {
      icon: <Undo2 size={15} />,
      label: "Deshacer",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <Redo2 size={15} />,
      label: "Rehacer",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-1 px-3 py-2 ${colors.card} border ${colors.border} rounded-t-lg`}
      style={{ borderBottom: `1px solid ${colors.accent}33` }}
    >
      {items.map((item, idx) => {
        if ("separator" in item && item.separator) {
          return (
            <div
              key={`sep-${idx}`}
              className="w-px h-5 mx-1"
              style={{ backgroundColor: `${colors.accent}33` }}
            />
          );
        }

        const btn = item as ToolBtn;
        const active = btn.isActive?.();

        return (
          <button
            key={idx}
            onClick={btn.action}
            title={btn.label}
            className={`p-1.5 rounded transition-all ${
              active
                ? "text-black bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.4)]"
                : `${colors.textAccent} hover:bg-cyan-400/10`
            }`}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
}
