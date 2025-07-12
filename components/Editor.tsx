// components/Editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  LinkIcon,
  Smile,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Tooltip-wrapped icon button
const ToolbarButton = ({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: any;
  label: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-muted/20 transition"
          onClick={onClick}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const MenuBar = ({ editor }: { editor: any }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addEmoji = (emoji: any) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-border bg-background px-3 py-2 rounded-md mb-3 relative">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} label="Bold" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} label="Italic" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} label="Strikethrough" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} label="Bullet List" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} label="Numbered List" />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} icon={AlignLeft} label="Align Left" />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} icon={AlignCenter} label="Align Center" />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} icon={AlignRight} label="Align Right" />
      <ToolbarButton onClick={addLink} icon={LinkIcon} label="Insert Link" />
      <ToolbarButton onClick={triggerImageUpload} icon={ImageIcon} label="Upload Image" />
      <ToolbarButton onClick={() => setShowEmojiPicker(prev => !prev)} icon={Smile} label="Emoji" />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {showEmojiPicker && (
        <div className="absolute top-16 z-50">
          <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
        </div>
      )}
    </div>
  );
};

const Editor = ({
  content,
  onChange,
}: {
  content?: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <div className="border border-border rounded-md p-4 bg-background min-h-[150px] text-foreground">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
