import { User } from 'lucide-react'
import type { Message } from '../types/chat'

interface MessageBubbleProps {
  message: Message
  className?: string
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export default function MessageBubble({ message, className = '' }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up ${className}`}
    >
      {/* User avatar — only for user messages */}
      {isUser && (
        <div className="flex items-start justify-center w-7 h-7 rounded-full bg-primary/10 text-primary shrink-0 ml-2 order-2 mt-1">
          <User className="h-3.5 w-3.5 mt-1.5" />
        </div>
      )}

      <div className={`${isUser ? 'max-w-[72%] order-1' : 'max-w-[85%]'}`}>
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
              : 'bg-card text-card-foreground rounded-2xl rounded-tl-sm border border-border'
          }`}
        >
          {message.content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < message.content.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
        <p
          className={`mt-1 text-[11px] text-muted-foreground px-2 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}
