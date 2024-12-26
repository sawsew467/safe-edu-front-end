"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ImageResize from "tiptap-extension-resize-image";

import ToolBar from "./tool-bar";

interface RichTextEditorProps {
  content?: string;
  onChange?: (value: string) => void;
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  required?: boolean;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  label,
  errorMessage,
  isInvalid = false,
  required = false,
  editable = true,
  ...props
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      Highlight,
      Image,
      ImageResize,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: `min-h-[156px] border rounded-md bg-slate-50 dark:bg-slate-900 py-2 px-3 ${
          isInvalid ? "border-red-500" : "border-gray-300 dark:border-gray-900"
        } text-sm`,
        style: "font-size: 14px;",
      },
    },
    onUpdate: ({ editor }) => {
      const editorContent = editor.getHTML();

      onChange && onChange(editorContent);
    },
    editable: editable,
  });

  React.useEffect(() => {
    if (editor?.getHTML() === content) return;
    editor?.commands.setContent(content ?? "");
  }, [content]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {editable && <ToolBar editor={editor} />}
      <EditorContent editor={editor} {...props} />
      {isInvalid && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
