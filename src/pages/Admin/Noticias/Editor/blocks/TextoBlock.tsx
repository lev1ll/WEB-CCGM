import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExt from '@tiptap/extension-underline'
import LinkExt from '@tiptap/extension-link'
import {
  Bold, Italic, Underline, List, ListOrdered, Quote,
  Link2, Link2Off, Undo2, Redo2,
} from 'lucide-react'
import type { BloqueContenidoMap } from '@/types/noticias.types'

interface Props {
  contenido: BloqueContenidoMap['texto']
  onChange: (contenido: BloqueContenidoMap['texto']) => void
}

export default function TextoBlock({ contenido, onChange }: Props) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
    ],
    content: contenido.html || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange({ html: editor.getHTML() })
    },
  })

  if (!editor) return null

  function applyLink() {
    if (!linkUrl.trim()) {
      editor!.chain().focus().unsetLink().run()
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
      editor!.chain().focus().setLink({ href: url, target: '_blank' }).run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }

  function openLinkInput() {
    const existing = editor!.getAttributes('link').href ?? ''
    setLinkUrl(existing)
    setShowLinkInput(true)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">

        {/* Estilos de párrafo */}
        <ToolBtn active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Título principal">
          Título
        </ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Subtítulo">
          Subtítulo
        </ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Sección">
          Sección
        </ToolBtn>

        <Divider />

        {/* Formato de texto */}
        <ToolBtn active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita">
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva">
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Subrayado">
          <Underline className="w-3.5 h-3.5" />
        </ToolBtn>

        <Divider />

        {/* Listas */}
        <ToolBtn active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista con puntos">
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Cita destacada">
          <Quote className="w-3.5 h-3.5" />
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn active={editor.isActive('link')}
          onClick={openLinkInput}
          title="Insertar enlace">
          <Link2 className="w-3.5 h-3.5" />
        </ToolBtn>
        {editor.isActive('link') && (
          <ToolBtn active={false}
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Quitar enlace">
            <Link2Off className="w-3.5 h-3.5" />
          </ToolBtn>
        )}

        <Divider />

        {/* Deshacer / Rehacer */}
        <ToolBtn active={false}
          onClick={() => editor.chain().focus().undo().run()}
          title="Deshacer">
          <Undo2 className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={false}
          onClick={() => editor.chain().focus().redo().run()}
          title="Rehacer">
          <Redo2 className="w-3.5 h-3.5" />
        </ToolBtn>
      </div>

      {/* Input de link */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100">
          <Link2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <input
            type="url"
            autoFocus
            placeholder="https://..."
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') applyLink(); if (e.key === 'Escape') setShowLinkInput(false) }}
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          <button type="button" onClick={applyLink}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0">
            Aplicar
          </button>
          <button type="button" onClick={() => setShowLinkInput(false)}
            className="text-xs text-gray-400 hover:text-gray-600 shrink-0">
            Cancelar
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[120px] focus-within:outline-none text-gray-800
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-2
          [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-2
          [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-1
          [&_.ProseMirror_p]:mb-2
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:mb-2
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:mb-2
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-gray-500"
      />
    </div>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />
}

function ToolBtn({ children, active, onClick, title }: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1
        ${active ? 'bg-primary/15 text-primary' : 'text-gray-600 hover:bg-gray-200'}`}
    >
      {children}
    </button>
  )
}
