import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/utils'
import { IconAlert, IconX } from './icons'

// ─── Botones ───────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'solid' | 'ghost' | 'danger' | 'danger-solid'
type ButtonSize = 'sm' | 'md' | 'lg'

/** Clases de botón reutilizables (para <button> y <Link>/<a>). */
export function buttonClasses(
  variant: ButtonVariant = 'ghost',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-transform',
    'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    { sm: 'min-h-9 px-3 text-sm', md: 'min-h-11 px-4 text-sm', lg: 'min-h-12 px-5 text-base' }[size],
    {
      primary: 'bg-accent text-accent-ink shadow-sm hover:brightness-90',
      solid: 'bg-ink text-app shadow-sm hover:opacity-90',
      ghost: 'border border-line bg-card text-ink hover:bg-elev',
      danger: 'border border-rose-500/40 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400',
      'danger-solid': 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
    }[variant],
    extra,
  )
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant = 'ghost', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />
}

// ─── Chip de filtro ─────────────────────────────────────────────────────

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ active = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'min-h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors',
        active
          ? 'border-accent bg-accent text-accent-ink'
          : 'border-line bg-card text-muted hover:text-ink',
        className,
      )}
      {...props}
    />
  )
}

// ─── Modal (bottom-sheet o centrado) ────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  variant?: 'sheet' | 'center'
}

export function Modal({ open, onClose, title, children, variant = 'sheet' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {variant === 'sheet' ? (
        <div
          role="dialog"
          aria-modal="true"
          className="sheet-in absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t border-line bg-elev shadow-2xl"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />
          <div className="p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {title !== undefined && (
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="rounded-full p-2 text-muted transition-colors hover:bg-card hover:text-ink"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="pop-in w-full max-w-sm rounded-2xl border border-line bg-elev p-4 shadow-2xl"
          >
            {children}
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}

// ─── Diálogo de confirmación ────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} variant="center">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {danger && (
            <span className="mt-0.5 rounded-full bg-rose-500/15 p-2 text-rose-500">
              <IconAlert className="h-5 w-5" />
            </span>
          )}
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold leading-tight tracking-tight">{title}</h2>
            {description && <p className="text-sm text-muted">{description}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button variant={danger ? 'danger-solid' : 'primary'} onClick={onConfirm} disabled={busy}>
            {busy ? 'Un momento…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Campos de formulario ───────────────────────────────────────────────

export const inputClasses =
  'w-full min-h-11 rounded-xl border border-line bg-card px-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none'

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-bold">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
