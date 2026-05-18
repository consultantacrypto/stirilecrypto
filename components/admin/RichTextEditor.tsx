'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
} from 'lucide-react';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  label: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, isActive, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
        isActive
          ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
          target: '_blank',
          rel: 'noopener noreferrer sponsored',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
    ],
    content: value || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none p-4 min-h-[360px] text-gray-300 font-[var(--font-inter)] leading-relaxed prose-headings:font-[var(--font-space)] prose-headings:text-white prose-a:text-blue-500 prose-a:underline prose-strong:text-white prose-img:rounded-lg',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '<p></p>';
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL link (affiliate sau extern):', previousUrl ?? 'https://');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = (url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) {
    return (
      <div className="rounded-xl border border-white/10 bg-gray-900 min-h-[400px] animate-pulse" />
    );
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-900 shadow-inner">
        <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-white/10 bg-[#0a0f1e]">
          <ToolbarButton
            label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic size={16} />
          </ToolbarButton>
          <span className="w-px h-6 bg-white/10 mx-1" aria-hidden />
          <ToolbarButton
            label="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <Heading3 size={16} />
          </ToolbarButton>
          <span className="w-px h-6 bg-white/10 mx-1" aria-hidden />
          <ToolbarButton
            label="Bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Ordered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <span className="w-px h-6 bg-white/10 mx-1" aria-hidden />
          <ToolbarButton
            label="Link"
            onClick={setLink}
            isActive={editor.isActive('link')}
          >
            <Link2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Insert Image"
            onClick={() => setMediaLibraryOpen(true)}
          >
            <ImageIcon size={16} />
          </ToolbarButton>
        </div>

        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none focus:outline-none min-h-[400px] bg-gray-900"
        />
      </div>

      {mediaLibraryOpen && (
        <MediaLibraryModal
          onClose={() => setMediaLibraryOpen(false)}
          onSelect={insertImage}
        />
      )}
    </>
  );
}
