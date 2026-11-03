// 「決まるまでの流れ」のカードと、スキップ・もう一度見る
import { useRef, type ReactNode } from 'react'
import type { Outcome } from '../outcome'
import { FlyingVote } from './FlyingVote'
import { TallyBoard } from './TallyBoard'
import { slotsFor } from './tallyState'
import { useResultPlayback } from './useResultPlayback'

export function ResultCard({ outcome, ending }: { outcome: Outcome; ending: ReactNode }) {
  const board = useRef<HTMLDivElement>(null)
  const { state, caption, flights, finished, skip, again } = useResultPlayback(outcome, ending, board)
  return (
    <>
      <div className="card">
        <div className="card-head">決まるまでの流れ</div>
        <TallyBoard ref={board} state={state} slots={slotsFor(outcome)} />
        <p className="why cap">{caption}</p>
      </div>
      {finished ? (
        <button className="tlink" onClick={again}>
          ↻ もう一度見る
        </button>
      ) : (
        <button className="tlink" onClick={skip}>
          スキップ
        </button>
      )}
      {flights.map((flight) => (
        <FlyingVote key={flight.key} flight={flight} />
      ))}
    </>
  )
}
