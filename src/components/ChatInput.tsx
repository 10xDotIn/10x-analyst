import { ArrowUp } from 'lucide-react'
import { useRef, useState } from 'react'
import type { UploadedFile } from '../types/chat'
import FileUploadButton from './FileUploadButton'
import FileChip from './FileChip'

interface ChatInputProps {
  onSend: (message: string, files?: UploadedFile[]) => void
  disabled?: boolean
  className?: string
}

export default function ChatInput({ onSend, disabled = false, className = '' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if ((!trimmed && attachedFiles.length === 0) || disabled) return
    onSend(trimmed || 'Analyze this file and give me key insights', attachedFiles.length > 0 ? attachedFiles : undefined)
    setValue('')
    setAttachedFiles([])
    setUploadError(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setUploadError(null)
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const handleFileUploaded = (file: UploadedFile) => {
    setAttachedFiles((prev) => [...prev, file])
    setUploadError(null)
  }

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.fileId !== fileId))
  }

  const canSend = (value.trim().length > 0 || attachedFiles.length > 0) && !disabled

  return (
    <div className={`shrink-0 bg-card px-5 py-4 ${className}`} style={{ borderTop: '1px solid hsl(var(--border))' }}>
      {/* Attached files */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachedFiles.map((file) => (
            <FileChip
              key={file.fileId}
              file={file}
              onRemove={() => handleRemoveFile(file.fileId)}
            />
          ))}
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="mb-2">
          <p className="text-xs text-destructive">{uploadError}</p>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3">
        <FileUploadButton
          onFileUploaded={handleFileUploaded}
          onError={(msg) => setUploadError(msg)}
        />

        <div className="flex-1 rounded-xl bg-background overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your data..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Type your message"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.95] focus-ring disabled:opacity-30 disabled:pointer-events-none shrink-0"
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
