import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { cn, uid } from '../lib/utils'
import { Button, Chip, Modal } from './ui'
import {
  IconCalculator,
  IconCrown,
  IconDices,
  IconMinus,
  IconPlus,
  IconRotateCcw,
  IconTrash,
  IconTrophy,
  IconX,
} from './icons'

type ToolKey = 'jugador' | 'dados' | 'puntos' | 'calc'

const TOOLS: Array<{ key: ToolKey; label: string; icon: typeof IconCrown }> = [
  { key: 'jugador', label: 'Inicial', icon: IconCrown },
  { key: 'dados', label: 'Dados', icon: IconDices },
  { key: 'puntos', label: 'Puntos', icon: IconTrophy },
  { key: 'calc', label: 'Calc.', icon: IconCalculator },
]

/** Botón flotante + cajón de herramientas de mesa. */
export function ToolsFab() {
  const [open, setOpen] = useState(false)
  const [tool, setTool] = useState<ToolKey>('dados')

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir herramientas de mesa"
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-elev shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <IconDices className="h-6 w-6 text-accent" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Herramientas de mesa">
        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-line bg-card p-1">
          {TOOLS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTool(t.key)}
              className={cn(
                'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-bold transition-colors',
                tool === t.key ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink',
              )}
            >
              <t.icon className="h-5 w-5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tool === 'jugador' && <FirstPlayerTool />}
          {tool === 'dados' && <DiceTool />}
          {tool === 'puntos' && <ScoreTool />}
          {tool === 'calc' && <CalcTool />}
        </div>
      </Modal>
    </>
  )
}

// ─── 1. Selector de jugador inicial ─────────────────────────────────────

function FirstPlayerTool() {
  const [names, setNames] = useLocalStorage<string[]>('sl:tools:names', [])
  const [newName, setNewName] = useState('')
  const [count, setCount] = useState(4)
  const [spinning, setSpinning] = useState(false)
  const [display, setDisplay] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
  }, [])

  function addName() {
    const value = newName.trim()
    if (!value) return
    setNames((prev) => [...prev, value])
    setNewName('')
  }

  function choose() {
    if (spinning) return
    const pool =
      names.length > 0 ? names : Array.from({ length: count }, (_, i) => `Jugador ${i + 1}`)
    if (pool.length === 0) return

    setSpinning(true)
    setResult(null)
    timerRef.current = window.setInterval(() => {
      setDisplay(pool[Math.floor(Math.random() * pool.length)])
    }, 90)
    window.setTimeout(() => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
      const winner = pool[Math.floor(Math.random() * pool.length)]
      setDisplay(winner)
      setResult(winner)
      setSpinning(false)
    }, 1400)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addName()
            }
          }}
          placeholder="Nombre del jugador…"
          aria-label="Nombre del jugador"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-card px-3 text-sm outline-none placeholder:text-muted/70 focus:border-accent"
        />
        <Button variant="primary" onClick={addName} aria-label="Añadir jugador">
          <IconPlus className="h-5 w-5" />
        </Button>
      </div>

      {names.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {names.map((name, index) => (
            <span
              key={`${index}-${name}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold"
            >
              {name}
              <button
                type="button"
                onClick={() => setNames(names.filter((_, j) => j !== index))}
                aria-label={`Quitar a ${name}`}
                className="text-muted transition-colors hover:text-rose-500"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="text-sm text-muted">Sin nombres: sortear entre</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(2, c - 1))}
              aria-label="Menos jugadores"
              className="h-9 w-9 rounded-full border border-line bg-card"
            >
              <IconMinus className="mx-auto h-4 w-4" />
            </button>
            <span className="w-8 text-center text-lg font-extrabold">{count}</span>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(12, c + 1))}
              aria-label="Más jugadores"
              className="h-9 w-9 rounded-full border border-line bg-card"
            >
              <IconPlus className="mx-auto h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Button variant="primary" size="lg" className="w-full" onClick={choose} disabled={spinning}>
        <IconCrown className="h-5 w-5" />
        Elegir jugador inicial
      </Button>

      {display && (
        <div
          className={cn(
            'rounded-2xl border p-5 text-center',
            result ? 'border-accent/50 bg-accent-softer' : 'border-line bg-card',
          )}
        >
          {result ? (
            <p className="pop-in text-xl font-extrabold">🎉 Empieza: {result}</p>
          ) : (
            <p className="text-xl font-extrabold text-muted">{display}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 2. Lanzador de dados ────────────────────────────────────────────────

type DiceKey = 'd6' | 'd10' | 'd20'

const DICE: Record<DiceKey, { sides: number; label: string }> = {
  d6: { sides: 6, label: 'D6' },
  d10: { sides: 10, label: 'D10' },
  d20: { sides: 20, label: 'D20' },
}

function DiceTool() {
  const [die, setDie] = useState<DiceKey>('d6')
  const [value, setValue] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<Array<{ die: DiceKey; value: number }>>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
  }, [])

  function roll() {
    if (rolling) return
    const sides = DICE[die].sides
    setRolling(true)
    setValue(null)
    timerRef.current = window.setInterval(() => {
      setValue(1 + Math.floor(Math.random() * sides))
    }, 70)
    window.setTimeout(() => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
      const final = 1 + Math.floor(Math.random() * sides)
      setValue(final)
      setRolling(false)
      setHistory((h) => [{ die, value: final }, ...h].slice(0, 10))
    }, 650)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {(Object.keys(DICE) as DiceKey[]).map((k) => (
          <Chip key={k} active={die === k} onClick={() => setDie(k)}>
            {DICE[k].label}
          </Chip>
        ))}
      </div>

      <div
        className={cn(
          'flex h-28 items-center justify-center rounded-2xl border border-line bg-card',
          rolling && 'dice-shake',
        )}
      >
        <span className="text-6xl font-extrabold tabular-nums">{value ?? '–'}</span>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={roll} disabled={rolling}>
        <IconDices className="h-5 w-5" />
        Lanzar {DICE[die].label}
      </Button>

      {history.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Últimas tiradas</p>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs font-bold',
                  i === 0 ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-card text-muted',
                )}
              >
                {DICE[h.die].label} · {h.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 3. Contador de puntos o vida ────────────────────────────────────────

interface ScorePlayer {
  id: string
  name: string
  score: number
}

function ScoreTool() {
  const [players, setPlayers] = useLocalStorage<ScorePlayer[]>('sl:tools:score', [])
  const [step, setStep] = useLocalStorage<number>('sl:tools:score-step', 1)
  const [newName, setNewName] = useState('')

  function addPlayer() {
    const name = newName.trim() || `Jugador ${players.length + 1}`
    setPlayers((prev) => [...prev, { id: uid(), name, score: 0 }])
    setNewName('')
  }

  function changeScore(id: string, delta: number) {
    setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, score: p.score + delta } : p)))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addPlayer()
            }
          }}
          placeholder="Nombre (opcional)…"
          aria-label="Nombre del jugador a añadir"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-card px-3 text-sm outline-none placeholder:text-muted/70 focus:border-accent"
        />
        <Button variant="primary" onClick={addPlayer} aria-label="Añadir jugador al contador">
          <IconPlus className="h-5 w-5" />
        </Button>
      </div>

      {players.length > 0 ? (
        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-xl border border-line bg-card p-2">
              <button
                type="button"
                onClick={() => changeScore(p.id, -step)}
                aria-label={`Restar ${step} a ${p.name}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-elev text-xl font-extrabold transition-transform active:scale-95"
              >
                −
              </button>
              <div className="min-w-0 flex-1 text-center">
                <p className="truncate text-sm font-bold">{p.name}</p>
                <p className="text-2xl font-extrabold leading-none tabular-nums">{p.score}</p>
              </div>
              <button
                type="button"
                onClick={() => changeScore(p.id, step)}
                aria-label={`Sumar ${step} a ${p.name}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-xl font-extrabold text-accent-ink transition-transform active:scale-95"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setPlayers(players.filter((x) => x.id !== p.id))}
                aria-label={`Quitar a ${p.name}`}
                className="rounded-full p-2 text-muted transition-colors hover:text-rose-500"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-card p-4 text-center text-sm text-muted">
          Añade jugadores para llevar puntos o vidas durante la partida.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-muted">Paso:</span>
          {[1, 5, 10].map((s) => (
            <Chip key={s} active={step === s} onClick={() => setStep(s)} className="min-h-8 px-2.5 text-xs">
              {s}
            </Chip>
          ))}
        </div>
        {players.length > 0 && (
          <button
            type="button"
            onClick={() => setPlayers(players.map((p) => ({ ...p, score: 0 })))}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent"
          >
            <IconRotateCcw className="h-4 w-4" />
            Poner a 0
          </button>
        )}
      </div>
    </div>
  )
}

// ─── 4. Calculadora rápida ───────────────────────────────────────────────

/** Evaluador de expresiones con precedencia (sumas, restas, multiplicaciones y divisiones). */
function evaluateExpr(expr: string): number {
  const tokens = expr.match(/\d+(?:\.\d+)?|[+\-×÷()]/g)
  if (!tokens || tokens.length === 0) throw new Error('vacía')
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]

  function parseExpr(): number {
    let value = parseTerm()
    while (peek() === '+' || peek() === '-') {
      const op = next()
      const rhs = parseTerm()
      value = op === '+' ? value + rhs : value - rhs
    }
    return value
  }

  function parseTerm(): number {
    let value = parseFactor()
    while (peek() === '×' || peek() === '÷') {
      const op = next()
      const rhs = parseFactor()
      if (op === '÷' && rhs === 0) throw new Error('división por cero')
      value = op === '×' ? value * rhs : value / rhs
    }
    return value
  }

  function parseFactor(): number {
    const token = next()
    if (token === undefined) throw new Error('incompleta')
    if (token === '(') {
      const value = parseExpr()
      if (next() !== ')') throw new Error('paréntesis sin cerrar')
      return value
    }
    if (token === '-') return -parseFactor()
    if (token === '+') return parseFactor()
    const number = Number(token)
    if (Number.isNaN(number)) throw new Error('número no válido')
    return number
  }

  const result = parseExpr()
  if (pos !== tokens.length) throw new Error('incompleta')
  return result
}

const CALC_KEYS = [
  ['C', '(', ')', '⌫'],
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '−'],
  ['0', '.', '=', '+'],
]

function CalcTool() {
  const [expr, setExpr] = useState('')
  const [fresh, setFresh] = useState(false)
  const [error, setError] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  // Espejo síncrono de la expresión: evita leer un estado obsoleto en clics muy rápidos.
  const exprRef = useRef('')

  function updateExpr(next: string) {
    exprRef.current = next
    setExpr(next)
  }

  function equals() {
    const source = exprRef.current
    if (!source.trim()) return
    try {
      const result = evaluateExpr(source)
      const rounded = Math.round(result * 1e6) / 1e6
      setHistory((h) => [`${source} = ${rounded}`, ...h].slice(0, 6))
      updateExpr(String(rounded))
      setFresh(true)
      setError(false)
    } catch {
      setError(true)
    }
  }

  function press(key: string) {
    setError(false)
    if (key === 'C') {
      updateExpr('')
      setFresh(false)
      return
    }
    if (key === '⌫') {
      updateExpr(exprRef.current.slice(0, -1))
      setFresh(false)
      return
    }
    if (key === '=') {
      equals()
      return
    }
    const value = key === '−' ? '-' : key
    if (fresh && /^[0-9.]$/.test(value)) {
      updateExpr(value)
    } else {
      updateExpr(exprRef.current + value)
    }
    setFresh(false)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-line bg-card p-4 text-right">
        <p className={cn('min-h-10 truncate text-3xl font-extrabold tabular-nums', error && 'text-rose-500')}>
          {error ? 'Error' : expr || '0'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {CALC_KEYS.flat().map((key) => {
          const isEquals = key === '='
          const isOp = ['÷', '×', '−', '+', '(', ')', 'C', '⌫'].includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              aria-label={key === '⌫' ? 'Borrar último carácter' : key}
              className={cn(
                'flex min-h-14 items-center justify-center rounded-xl text-lg font-extrabold transition-transform active:scale-95',
                isEquals
                  ? 'bg-accent text-accent-ink'
                  : isOp
                    ? 'bg-elev text-ink'
                    : 'border border-line bg-card text-ink',
              )}
            >
              {key}
            </button>
          )
        })}
      </div>

      {history.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Historial</p>
          <div className="space-y-1">
            {history.map((line, i) => (
              <p
                key={i}
                className={cn(
                  'rounded-lg px-2 py-1 text-right text-sm font-semibold tabular-nums',
                  i === 0 ? 'bg-accent-softer text-ink' : 'text-muted',
                )}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
