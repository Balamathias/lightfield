'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Code,
  X,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write your content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('bold') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('italic') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          }`}
          type="button"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          }`}
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          }`}
          type="button"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          }`}
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          }`}
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          }`}
          type="button"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={() => setShowLinkModal(true)}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('link') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          type="button"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground"
          type="button"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="prose-editor">
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Insert Link</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-sm rounded-lg hover:bg-accent text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={addLink}
                  className="px-4 py-2 text-sm rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Insert Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-sm rounded-lg hover:bg-accent text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={addImage}
                  className="px-4 py-2 text-sm rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
