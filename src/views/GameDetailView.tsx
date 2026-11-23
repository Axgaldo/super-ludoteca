import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGames } from '../context/GamesContext'
import type { Game } from '../types'
import { DIFFICULTY_CLASSES, DIFFICULTY_LABELS, GAME_TAGS } from '../types'
import { cn, coverGradient, formatDuration, formatPlayers, initials } from '../lib/utils'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Button, ConfirmDialog } from '../components/ui'
import { ChatPanel } from '../components/ChatPanel'
import {
  IconChat,
  IconCheck,
  IconChevronLeft,
  IconClock,
  IconListChecks,
  IconPencil,
  IconRotateCcw,
  IconSparkles,
  IconTrophy,
  IconTrash,
  IconUser,
  IconUsers,
} from '../components/icons'

type TabKey = 'setup' | 'turn' | 'end' | 'dudas'

const TABS: Array<{ key: TabKey; label: string; icon: typeof IconListChecks }> = [
  { key: 'setup', label: 'Preparación', icon: IconListChecks },
  { key: 'turn', label: 'Turno', icon: IconUser },
  { key: 'end', label: 'Fin y puntos', icon: IconTrophy },
  { key: 'dudas', label: 'Dudas', icon: IconChat },
]

/** Checklist interactivo de preparación: se marca en la mesa y persiste por juego. */
function SetupChecklist({ game }: { game: Game }) {
  const [checked, setChecked] = useLocalStorage<number[]>(`sl:check:${game.id}`, [])

  const toggle = (index: number) =>
    setChecked((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {checked.length}/{game.setup.length} pasos marcados
        </p>
        {checked.length > 0 && (
          <Button size="sm" onClick={() => setChecked([])}>
            <IconRotateCcw className="h-4 w-4" />
            Reiniciar
          </Button>
        )}
      </div>

      <ul className="space-y-2">
        {game.setup.map((item, index) => {
          const isOn = checked.includes(index)
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={isOn}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                  isOn ? 'border-accent/50 bg-accent-softer' : 'border-line bg-card hover:bg-elev',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors',
                    isOn ? 'border-accent bg-accent text-accent-ink' : 'border-line',
                  )}
                >
                  {isOn && <IconCheck className="h-4 w-4" />}
                </span>
                <span className={cn('text-sm leading-snug', isOn && 'text-muted line-through')}>{item}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Ficha de refresco rápido en 3 minutos, organizada en pestañas táctiles. */
export default function GameDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { games, removeGame } = useGames()
  const game = games.find((g) => g.id === id)

  const [tab, setTab] = useState<TabKey>('setup')
  const [confirm, setConfirm] = useState<0 | 1 | 2>(0)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [heroFailed, setHeroFailed] = useState(false)

  if (!game) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center">
        <p className="font-bold">Juego no encontrado</p>
        <p className="mt-1 text-sm text-muted">Puede que se haya eliminado o que aún se esté cargando.</p>
        <div className="mt-4 flex justify-center">
          <Link to="/">
            <Button>
              <IconChevronLeft className="h-4 w-4" />
              Volver a Mi Ludoteca
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const showImage = Boolean(game.image) && !heroFailed

  async function handleDelete() {
    if (!game) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await removeGame(game.id)
      navigate('/')
    } catch (err) {
      console.error(err)
      setDeleting(false)
      setDeleteError(err instanceof Error ? err.message : 'No se pudo eliminar el juego. Inténtalo otra vez.')
    }
  }

  return (
    <div className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold text-muted transition-colors hover:text-ink"
      >
        <IconChevronLeft className="h-4 w-4" />
        Mi Ludoteca
      </Link>

      {/* Portada */}
      <div className={cn('relative h-40 overflow-hidden rounded-2xl', !showImage && coverGradient(game.title))}>
        {showImage ? (
          <img
            src={game.image}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setHeroFailed(true)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-6xl font-extrabold tracking-wider text-white/90 drop-shadow-md">
            {initials(game.title)}
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          Refresco rápido · 3 min
        </span>
      </div>

      {/* Título y metadatos */}
      <div className="space-y-3">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{game.title}</h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1">
            <IconUsers className="h-4 w-4" />
            {formatPlayers(game)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1">
            <IconClock className="h-4 w-4" />
            {formatDuration(game.durationMin)}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold',
              DIFFICULTY_CLASSES[game.difficulty],
            )}
          >
            {DIFFICULTY_LABELS[game.difficulty]}
          </span>
        </div>

        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className={cn('rounded-full border px-2 py-0.5 text-[11px] font-bold', GAME_TAGS[tag].classes)}
              >
                {GAME_TAGS[tag].label}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link to={`/editar/${game.id}`}>
            <Button size="sm">
              <IconPencil className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => setConfirm(1)}>
            <IconTrash className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Pestañas grandes, fáciles de tocar con el pulgar */}
      <nav className="sticky top-14 z-30 -mx-4 mt-2 border-b border-line bg-app/90 px-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="grid grid-cols-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key}
              className={cn(
                'relative flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors sm:text-sm',
                tab === t.key ? 'text-accent' : 'text-muted hover:text-ink',
              )}
            >
              <t.icon className="h-5 w-5" />
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido de la pestaña */}
      <div className="fade-up" key={tab}>
        {tab === 'setup' && <SetupChecklist game={game} />}

        {tab === 'turn' && (
          <ol className="space-y-2">
            {game.turn.map((step, index) => (
              <li key={index} className="flex gap-3 rounded-xl border border-line bg-card p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-accent-ink">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {tab === 'end' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-accent/40 bg-accent-softer p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Fin de la partida</p>
              <p className="mt-1 font-semibold leading-snug">{game.endCondition}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Cómo se suman los puntos</p>
              {game.scoring.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl border border-line bg-card p-3">
                  <IconTrophy className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'dudas' && (
          <div className="space-y-6">
            {game.forgotten.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Reglas que siempre se olvidan
                </p>
                {game.forgotten.map((rule, index) => (
                  <div key={index} className="rounded-2xl border border-line bg-card p-4">
                    <p className="font-bold leading-tight">{rule.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{rule.text}</p>
                  </div>
                ))}
              </section>
            )}
            <section className="space-y-2">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <IconSparkles className="h-4 w-4 text-accent" />
                Pregunta tus dudas a la IA
              </p>
              <ChatPanel game={game} />
            </section>
          </div>
        )}
      </div>

      {/* Doble confirmación de borrado */}
      <ConfirmDialog
        open={confirm === 1}
        title={`¿Eliminar «${game.title}»?`}
        description="Se quitará de tu ludoteca."
        confirmLabel="Eliminar"
        danger
        onConfirm={() => setConfirm(2)}
        onClose={() => setConfirm(0)}
      />
      <ConfirmDialog
        open={confirm === 2}
        title="¿Seguro que quieres eliminarlo?"
        description="Esta acción no se puede deshacer: el juego y su ficha se perderán definitivamente."
        confirmLabel="Sí, eliminar definitivamente"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirm(0)}
      />
      {deleteError && <p className="text-center text-sm text-rose-500">{deleteError}</p>}
    </div>
  )
}
