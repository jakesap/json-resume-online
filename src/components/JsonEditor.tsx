import { useEffect, useRef } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    fontFamily: '"Geist Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace',
  },
  '.cm-scroller': {
    overflow: 'auto',
    lineHeight: '1.6',
  },
  '.cm-content': {
    padding: '12px 0',
    caretColor: '#000',
  },
  '.cm-line': {
    padding: '0 16px',
  },
  '.cm-gutters': {
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e9ecef',
    color: '#9ca3af',
    minWidth: '3rem',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f0f2f5',
  },
  '.cm-activeLine': {
    backgroundColor: '#f8f9fc',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#000',
  },
  '&.cm-focused': {
    outline: 'none',
  },
})

export function JsonEditor({ value, onChange, className }: JsonEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        bracketMatching(),
        closeBrackets(),
        syntaxHighlighting(defaultHighlightStyle),
        json(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
        ]),
        editorTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync external value changes (only when different from editor content)
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      })
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ isolation: 'isolate' }}
    />
  )
}
