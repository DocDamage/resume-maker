import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ content, onChange, placeholder, rows = 4 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || "Start typing..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-background">
      <div className="flex items-center gap-1 p-1 border-b bg-muted/50">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}>
          <Bold size={14} className={editor.isActive("bold") ? "text-primary" : ""} />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}>
          <Italic size={14} className={editor.isActive("italic") ? "text-primary" : ""} />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()}>
          <List size={14} className={editor.isActive("bulletList") ? "text-primary" : ""} />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
          <Undo size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
          <Redo size={14} />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 min-h-[80px] focus:outline-none"
        style={{ minHeight: `${rows * 24}px` }}
      />
    </div>
  );
}
