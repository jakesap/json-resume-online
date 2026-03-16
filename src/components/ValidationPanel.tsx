import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { type ValidationResult } from '@/lib/schema'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ValidationPanelProps {
  result: ValidationResult | null
  className?: string
}

export function ValidationPanel({ result, className }: ValidationPanelProps) {
  const [expanded, setExpanded] = useState(false)

  if (!result) return null

  const errorCount = result.schemaErrors.length + (result.parseError ? 1 : 0)

  return (
    <div className={cn('rounded-lg border text-sm', className)}>
      <button
        onClick={() => errorCount > 0 && setExpanded((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          result.valid
            ? 'bg-green-50 border-green-200 text-green-800 cursor-default'
            : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100 cursor-pointer'
        )}
      >
        {result.valid ? (
          <CheckCircle2 className="size-4 shrink-0 text-green-600" />
        ) : result.parseError ? (
          <XCircle className="size-4 shrink-0 text-red-600" />
        ) : (
          <AlertCircle className="size-4 shrink-0 text-amber-600" />
        )}

        <span className="flex-1 text-left font-medium">
          {result.valid
            ? 'Valid JSON Resume'
            : result.parseError
              ? 'Invalid JSON syntax'
              : `${errorCount} schema error${errorCount !== 1 ? 's' : ''}`}
        </span>

        {errorCount > 0 && (
          <>
            <Badge
              variant="destructive"
              className="text-xs"
            >
              {errorCount}
            </Badge>
            {expanded ? (
              <ChevronUp className="size-3.5 shrink-0" />
            ) : (
              <ChevronDown className="size-3.5 shrink-0" />
            )}
          </>
        )}
      </button>

      {expanded && errorCount > 0 && (
        <div className="border-t border-red-200 divide-y divide-red-100 max-h-48 overflow-y-auto">
          {result.parseError && (
            <div className="px-3 py-2 bg-red-50">
              <code className="text-xs text-red-700 font-mono">{result.parseError}</code>
            </div>
          )}
          {result.schemaErrors.map((err, i) => (
            <div key={i} className="px-3 py-2 bg-red-50">
              <div className="flex items-start gap-2">
                {err.instancePath && (
                  <code className="text-xs font-mono text-red-600 shrink-0">
                    {err.instancePath}
                  </code>
                )}
                <span className="text-xs text-red-700">{err.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
