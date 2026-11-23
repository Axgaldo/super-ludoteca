import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useGames } from '../context/GamesContext'
import { CATALOG, catalogToDraft, type CatalogGame } from '../data/catalog'
import type { Difficulty, ForgottenRule, GameDraft } from '../types'
import { DIFFICULTY_LABELS, GAME_TAGS, GAME_TAG_KEYS } from '../types'
import { cn, formatDuration, formatPlayersShort } from '../lib/utils'
import { Button, Chip, Field, inputClasses } from '../components/ui'
import { IconCheck, IconPlus, IconSearch, IconX } from '../components/icons'

type FormTab = 'catalogo' | 'manual'

const DIFFICULTY_OPTIONS: Difficulty[] = [1, 2, 3, 4, 5]
const textareaClasses =
  'w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent'

function emptyDraft(): GameDraft {
  return {
    title: '',
    playersMin: 2,
    playersMax: 4,
    durationMin: 30,
    difficulty: 3,
    tags: [],
    setup: [''],
    turn: [''],
    endCondition: '',
    scoring: [''],
    forgotten: [],
  }
}

// ─── Editores de listas ─────────────────────────────────────────────────

function StringListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  label: string
  hint?: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  addLabel: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold">{label}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center text-xs font-bold text-muted">{index + 1}</span>
            <input
              value={item}
              onChange={(e) => onChange(items.map((it, j) => (j === index ? e.target.value : it)))}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              className={inputClasses}
            />
            <button
              type="button"
              aria-label={`Quitar ${label.toLowerCase()} ${index + 1}`}
              onClick={() => onChange(items.filter((_, j) => j !== index))}
              className="rounded-full p-2 text-muted transition-colors hover:text-rose-500"
            >
              <IconX className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-accent"
      >
        <IconPlus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  )
}

function ForgottenListEditor({
  items,
  onChange,
}: {
  items: ForgottenRule[]
  onChange: (items: ForgottenRule[]) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold">Reglas olvidadas / aclaraciones</p>
      <p className="text-xs text-muted">
        Las dudas típicas de este juego: se muestran en la pestaña «Dudas» de su ficha.
      </p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="space-y-2 rounded-xl border border-line bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted">Regla {index + 1}</span>
              <button
                type="button"
                aria-label={`Quitar regla ${index + 1}`}
                onClick={() => onChange(items.filter((_, j) => j !== index))}
                className="rounded-full p-1.5 text-muted transition-colors hover:text-rose-500"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
            <input
              value={item.title}
              onChange={(e) =>
                onChange(items.map((it, j) => (j === index ? { ...it, title: e.target.value } : it)))
              }
              placeholder="Título (ej.: El 7 y el ladrón)"
              aria-label={`Título de la regla ${index + 1}`}
              className={inputClasses}
            />
            <textarea
              value={item.text}
              onChange={(e) =>
                onChange(items.map((it, j) => (j === index ? { ...it, text: e.target.value } : it)))
              }
              placeholder="Explica la aclaración…"
              rows={2}
              aria-label={`Detalle de la regla ${index + 1}`}
              className={textareaClasses}
            />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...items, { title: '', text: '' }])}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-accent"
      >
        <IconPlus className="h-4 w-4" />
        Añadir regla
      </button>
    </div>
  )
}

// ─── Tarjeta del catálogo ───────────────────────────────────────────────

function CatalogCard({
  cat,
  added,
  busy,
  onAdd,
}: {
  cat: CatalogGame
  added: boolean
  busy: boolean
  onAdd: () => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-2xl border p-3 transition-colors',
        added ? 'border-accent/50 bg-accent-softer' : 'border-line bg-card',
      )}
    >
      <p className="font-bold leading-tight">{cat.title}</p>
      <p className="text-xs text-muted">
        {formatPlayersShort(cat)} · {formatDuration(cat.durationMin)} · {DIFFICULTY_LABELS[cat.difficulty]}
      </p>
      <p className="line-clamp-2 text-xs text-muted">{cat.description}</p>
      <div className="mt-auto pt-1">
        {added ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <IconCheck className="h-4 w-4" />
            En tu ludoteca
          </span>
        ) : (
          <Button size="sm" variant="primary" onClick={onAdd} disabled={busy}>
            <IconPlus className="h-4 w-4" />
            Añadir
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Vista ──────────────────────────────────────────────────────────────

/** Alta y edición de juegos: desde catálogo precargado o con formulario manual. */
export default function GameFormView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { games, saveGame } = useGames()

  const editing = id ? games.find((g) => g.id === id) : undefined

  const [tab, setTab] = useState<FormTab>(
    editing || searchParams.get('tab') === 'manual' ? 'manual' : 'catalogo',
  )
  const [draft, setDraft] = useState<GameDraft>(() =>
    editing
      ? {
          title: editing.title,
          image: editing.image,
          playersMin: editing.playersMin,
          playersMax: editing.playersMax,
          durationMin: editing.durationMin,
          difficulty: editing.difficulty,
          tags: editing.tags ? [...editing.tags] : [],
          setup: [...editing.setup],
          turn: [...editing.turn],
          endCondition: editing.endCondition,
          scoring: [...editing.scoring],
          forgotten: editing.forgotten.map((f) => ({ ...f })),
        }
      : emptyDraft(),
  )
  const [catalogQuery, setCatalogQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)

  const patch = (p: Partial<GameDraft>) => setDraft((d) => ({ ...d, ...p }))

  const catalogVisible = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase()
    return CATALOG.filter((c) => !q || c.title.toLowerCase().includes(q))
  }, [catalogQuery])

  async function addFromCatalog(cat: CatalogGame) {
    setSaving(true)
    setSaveError(null)
    try {
      await saveGame(catalogToDraft(cat), { catalogId: cat.id })
    } catch (err) {
      console.error(err)
      setSaveError(err instanceof Error ? err.message : 'No se pudo añadir el juego. Inténtalo otra vez.')
    } finally {
      setSaving(false)
    }
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!draft.title.trim()) errs.push('El título es obligatorio.')
    if (draft.playersMin < 1) errs.push('El mínimo de jugadores debe ser 1 o más.')
    if (draft.playersMax < draft.playersMin) errs.push('El máximo de jugadores no puede ser menor que el mínimo.')
    if (draft.durationMin <= 0) errs.push('La duración estimada debe ser mayor que 0 minutos.')
    if (draft.setup.every((s) => !s.trim())) errs.push('Añade al menos un paso de preparación.')
    if (draft.turn.every((s) => !s.trim())) errs.push('Añade al menos un paso de la estructura del turno.')
    if (!draft.endCondition.trim()) errs.push('Describe la condición de fin de partida.')
    return errs
  }

  async function submit() {
    const errs = validate()
    setErrors(errs)
    if (errs.length > 0) return
    const clean: GameDraft = {
      ...draft,
      title: draft.title.trim(),
      image: draft.image?.trim() || undefined,
      tags: [...new Set(draft.tags ?? [])],
      setup: draft.setup.map((s) => s.trim()).filter(Boolean),
      turn: draft.turn.map((s) => s.trim()).filter(Boolean),
      endCondition: draft.endCondition.trim(),
      scoring: draft.scoring.map((s) => s.trim()).filter(Boolean),
      forgotten: draft.forgotten
        .map((f) => ({ title: f.title.trim(), text: f.text.trim() }))
        .filter((f) => f.title && f.text),
    }
    setSaving(true)
    setSaveError(null)
    try {
      const game = await saveGame(clean, editing ? { id: editing.id } : undefined)
      navigate(`/juego/${game.id}`)
    } catch (err) {
      console.error(err)
      setSaving(false)
      setSaveError(err instanceof Error ? err.message : 'No se pudo guardar el juego. Inténtalo otra vez.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {editing ? 'Editar juego' : 'Añadir juego'}
        </h1>
        <p className="text-sm text-muted">
          {editing
            ? 'Retoca cualquier dato de la ficha: se guarda al instante.'
            : 'Desde el catálogo en un toque, o a mano si el juego es menos conocido.'}
        </p>
      </div>

      {!editing && (
        <div className="flex gap-1 rounded-2xl border border-line bg-card p-1">
          <button
            type="button"
            onClick={() => setTab('catalogo')}
            className={cn(
              'min-h-10 flex-1 rounded-xl px-3 text-sm font-bold transition-colors',
              tab === 'catalogo' ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink',
            )}
          >
            Desde catálogo
          </button>
          <button
            type="button"
            onClick={() => setTab('manual')}
            className={cn(
              'min-h-10 flex-1 rounded-xl px-3 text-sm font-bold transition-colors',
              tab === 'manual' ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink',
            )}
          >
            A mano
          </button>
        </div>
      )}

      {tab === 'catalogo' && !editing ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Toca «Añadir» en los juegos que tengas: se crean con su ficha de reglas completa
            (preparación, turno, puntuación y aclaraciones). Podrás editarlos después desde su ficha.
          </p>

          <div className="flex h-11 items-center gap-2 rounded-xl border border-line bg-card px-3">
            <IconSearch className="h-5 w-5 shrink-0 text-muted" />
            <input
              value={catalogQuery}
              onChange={(e) => setCatalogQuery(e.target.value)}
              placeholder="Buscar en el catálogo…"
              aria-label="Buscar en el catálogo"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
            />
          </div>

          {saveError && <p className="text-sm text-rose-500">{saveError}</p>}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {catalogVisible.map((cat) => {
              const added = games.some((g) => g.catalogId === cat.id)
              return (
                <CatalogCard
                  key={cat.id}
                  cat={cat}
                  added={added}
                  busy={saving}
                  onAdd={() => void addFromCatalog(cat)}
                />
              )
            })}
          </div>

          {catalogVisible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line bg-card p-6 text-center text-sm text-muted">
              No hay resultados para «{catalogQuery}». Añádelo a mano en la pestaña «A mano».
            </p>
          )}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
          className="space-y-5 rounded-2xl border border-line bg-card p-4"
        >
          <Field label="Título del juego" htmlFor="game-title">
            <input
              id="game-title"
              value={draft.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Ej.: Los Colonos de Catán"
              className={inputClasses}
              required
            />
          </Field>

          <Field
            label="URL de la imagen (opcional)"
            htmlFor="game-image"
            hint="Pega el enlace de una portada (BGG, editorial…). Si lo dejas vacío, se genera un degradado con las iniciales."
          >
            <input
              id="game-image"
              value={draft.image ?? ''}
              onChange={(e) => patch({ image: e.target.value })}
              placeholder="https://…"
              inputMode="url"
              className={inputClasses}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jugadores mínimo" htmlFor="players-min">
              <input
                id="players-min"
                type="number"
                min={1}
                max={20}
                value={draft.playersMin}
                onChange={(e) => patch({ playersMin: Number(e.target.value) || 0 })}
                className={inputClasses}
              />
            </Field>
            <Field label="Jugadores máximo" htmlFor="players-max">
              <input
                id="players-max"
                type="number"
                min={1}
                max={20}
                value={draft.playersMax}
                onChange={(e) => patch({ playersMax: Number(e.target.value) || 0 })}
                className={inputClasses}
              />
            </Field>
          </div>

          <Field label="Duración estimada (minutos)" htmlFor="duration">
            <input
              id="duration"
              type="number"
              min={5}
              max={600}
              value={draft.durationMin}
              onChange={(e) => patch({ durationMin: Number(e.target.value) || 0 })}
              className={inputClasses}
            />
          </Field>

          <div className="space-y-2">
            <p className="text-sm font-bold">Dificultad para novatos</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((d) => (
                <Chip
                  key={d}
                  active={draft.difficulty === d}
                  onClick={() => patch({ difficulty: d })}
                >
                  {DIFFICULTY_LABELS[d]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold">Categorías / etiquetas</p>
            <p className="text-xs text-muted">Aparecen en la ficha y sirven para filtrar tu ludoteca.</p>
            <div className="flex flex-wrap gap-2">
              {GAME_TAG_KEYS.map((tag) => {
                const active = (draft.tags ?? []).includes(tag)
                return (
                  <Chip
                    key={tag}
                    active={active}
                    onClick={() =>
                      patch({
                        tags: active
                          ? (draft.tags ?? []).filter((t) => t !== tag)
                          : [...(draft.tags ?? []), tag],
                      })
                    }
                  >
                    {GAME_TAGS[tag].label}
                  </Chip>
                )
              })}
            </div>
          </div>

          <StringListEditor
            label="Preparación (checklist)"
            hint="Lo que hay que montar antes de empezar: se convierte en una checklist interactiva."
            items={draft.setup}
            onChange={(setup) => patch({ setup })}
            placeholder="Ej.: Baraja las cartas y reparte 5 a cada jugador"
            addLabel="Añadir paso"
          />

          <StringListEditor
            label="Estructura del turno"
            hint="Pasos numerados de lo que hace un jugador en su turno."
            items={draft.turn}
            onChange={(turn) => patch({ turn })}
            placeholder="Ej.: Tira los dados y cobra recursos"
            addLabel="Añadir paso"
          />

          <Field label="Condición de fin de partida" htmlFor="end-condition">
            <textarea
              id="end-condition"
              value={draft.endCondition}
              onChange={(e) => patch({ endCondition: e.target.value })}
              placeholder="Ej.: La partida termina cuando alguien alcanza 10 puntos de victoria."
              rows={2}
              className={textareaClasses}
            />
          </Field>

          <StringListEditor
            label="Cómo se suman los puntos"
            items={draft.scoring}
            onChange={(scoring) => patch({ scoring })}
            placeholder="Ej.: Cada pueblo vale 1 punto de victoria"
            addLabel="Añadir regla de puntuación"
          />

          <ForgottenListEditor items={draft.forgotten} onChange={(forgotten) => patch({ forgotten })} />

          {errors.length > 0 && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400">
              <p className="font-bold">Revisa estos detalles:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          {saveError && <p className="text-sm text-rose-500">{saveError}</p>}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary" size="lg" disabled={saving} className="flex-1">
              {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Guardar juego'}
            </Button>
            <Link to={editing ? `/juego/${editing.id}` : '/'}>
              <Button size="lg">Cancelar</Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
