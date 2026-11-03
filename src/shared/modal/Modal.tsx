// ポップアップの土台。body の直下に出し、Esc と外側のクリックで閉じる
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ label, onClose, children }: { label?: string; onClose: () => void; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)

  // 開いたらポップアップにフォーカスを移す
  useEffect(() => {
    box.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      ref={box}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

/** ポップアップの右上の × */
export function CloseBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet-bar">
      <button className="close-x" aria-label="閉じる" onClick={onClose}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
