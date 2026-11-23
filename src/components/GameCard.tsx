import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Game } from '../types'
import { DIFFICULTY_CLASSES, DIFFICULTY_LABELS, GAME_TAGS } from '../types'
import { cn, coverGradient, formatDuration, formatPlayersShort, initials } from '../lib/utils'
import { IconClock, IconUsers } from './icons'

/** Tarjeta de juego: portada (imagen o degradado con iniciales) + metadatos */
export function GameCard({ game }: { game: Game }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(game.image) && !imageFailed

  return (
    <Link
      to={`/juego/${game.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div
        className={cn('relative aspect-[4/5] w-full overflow-hidden', !showImage && coverGradient(game.title))}
      >
        {showImage ? (
          <img
            src={game.image}
            alt={`Portada de ${game.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-extrabold tracking-wider text-white/90 drop-shadow-md">
              {initials(game.title)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 font-bold leading-tight">{game.title}</h3>
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={cn('rounded-full border px-1.5 py-0.5 text-[10px] font-bold', GAME_TAGS[tag].classes)}
              >
                {GAME_TAGS[tag].label}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <IconUsers className="h-3.5 w-3.5" />
            {formatPlayersShort(game)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClock className="h-3.5 w-3.5" />
            {formatDuration(game.durationMin)}
          </span>
        </div>
        <span
          className={cn(
            'inline-flex w-fit rounded-full border px-2 py-0.5 text-[11px] font-bold',
            DIFFICULTY_CLASSES[game.difficulty],
          )}
        >
          {DIFFICULTY_LABELS[game.difficulty]}
        </span>
      </div>
    </Link>
  )
}
