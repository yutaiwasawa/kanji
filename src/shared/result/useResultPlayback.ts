// 結果の表の動き。1番の票を数え、外れたお店の票が次のお店へ飛ぶところを順に見せる
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Outcome } from '../outcome'
import type { ShopId } from '../shops'
import type { Flight } from './FlyingVote'
import { countedUpTo, emptyState, finalState, orderShops, patchRow, type TallyState } from './tallyState'
import { loseText, moveText } from './texts'

/** 1番の票を数え始めるまで */
const COUNT_START = 200
/** 1票ずつ増やす間隔 */
const COUNT_STEP = 300
/** 1票が飛び終わるまで（CSS の transform 1s より少し長い） */
const FLIGHT = 1050
/** 票が1票ずつ飛ぶ間隔 */
const FLIGHT_GAP = 1300

/** 画面を離れたら止まるタイマー */
function useTimers() {
  const ids = useRef<number[]>([])
  const later = useCallback((fn: () => void, ms: number) => {
    ids.current.push(window.setTimeout(fn, ms))
  }, [])
  const stop = useCallback(() => {
    ids.current.forEach(clearTimeout)
    ids.current = []
  }, [])
  useEffect(() => stop, [stop])
  return useMemo(() => ({ later, stop }), [later, stop])
}

function firstCounts(o: Outcome) {
  return o.result ? o.result.rounds[0].counts : o.plain.counts
}

/**
 * @param o 結果
 * @param ending 動きが終わったあとに出す説明
 * @param board 票のマスの表。飛ぶ票の位置を測るために見る
 */
export function useResultPlayback(o: Outcome, ending: ReactNode, board: RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState<TallyState>(() => emptyState(orderShops(firstCounts(o), [])))
  const [caption, setCaption] = useState<ReactNode>('1番の票を数えます。')
  const [flights, setFlights] = useState<Flight[]>([])
  // 最後まで出した。スキップを消し、もう一度見るを出す
  const [finished, setFinished] = useState(false)
  const timers = useTimers()
  const flightKey = useRef(0)

  const stop = useCallback(() => {
    timers.stop()
    setFlights([])
  }, [timers])

  const end = useCallback(() => {
    setState(finalState(o))
    setCaption(ending)
    setFinished(true)
  }, [o, ending])

  const play = useCallback(() => {
    stop()
    setFinished(false)
    const counts = firstCounts(o)
    // 動きの途中の表。タイマーごとに進め、そのたびに画面へ出す
    let st = emptyState(orderShops(counts, []))
    const paint = (next: TallyState) => {
      st = next
      setState(st)
    }
    paint(st)
    setCaption('1番の票を数えます。')

    // 1番の票を1票ずつ増やす
    const max = Math.max(...st.order.map((id) => counts[id]))
    for (let i = 1; i <= max; i++) {
      timers.later(() => paint(countedUpTo(st, counts, i)), COUNT_START + (i - 1) * COUNT_STEP)
    }
    let t = COUNT_START + 5 * COUNT_STEP + COUNT_STEP

    // 外れたお店の1票を、行き先のお店へ飛ばす
    const fly = (from: ShopId, to: ShopId) => {
      const root = board.current!
      const src = root.querySelector(`[data-id="${from}"]`)!.querySelectorAll('.v')[st.rows[from].base - 1]
      const dst = root.querySelector(`[data-id="${to}"]`)!.querySelectorAll('.v')[(st.rows[to].base || 0) + (st.rows[to].gain || 0)]
      const a = src.getBoundingClientRect()
      const b = dst.getBoundingClientRect()
      const key = ++flightKey.current
      setFlights((f) => [...f, { key, left: a.left, top: a.top, width: a.width, height: a.height, dx: b.left - a.left, dy: b.top - a.top }])
      paint(patchRow(st, from, { base: st.rows[from].base - 1 }))
      timers.later(() => {
        setFlights((f) => f.filter((x) => x.key !== key))
        const gain = (st.rows[to].gain || 0) + 1
        paint(patchRow(st, to, { gain, chip: gain }))
      }, FLIGHT)
    }

    const rounds = o.result ? o.result.rounds.filter((r) => r.loser) : []
    for (const rd of rounds) {
      const loser = rd.loser!
      // 行き先を1票ずつ並べる
      const targets = (Object.keys(rd.moves) as ShopId[]).flatMap((to) => Array<ShopId>(rd.moves[to]!).fill(to))
      timers.later(() => {
        const r = st.rows[loser]
        // 移ってきた票もまとめて黄色にして、外れる印を出す
        paint(patchRow(st, loser, { base: (r.base || 0) + (r.gain || 0), gain: 0, chip: 0, leaving: true }))
        setCaption(loseText(rd))
      }, t)
      timers.later(() => setCaption(moveText(rd)), t + 1800)
      const start = t + 2000
      targets.forEach((to, i) => timers.later(() => fly(loser, to), start + i * FLIGHT_GAP))
      timers.later(() => paint(patchRow(st, loser, { leaving: false, out: true, base: 0 })), start + targets.length * FLIGHT_GAP)
      t += 2000 + targets.length * FLIGHT_GAP + 400
    }
    timers.later(end, t)
  }, [o, board, timers, stop, end])

  // 画面を開いたときに一度だけ始める。結果はこのカードが出ている間は変わらない
  useEffect(() => {
    play()
  }, [])

  const skip = useCallback(() => {
    stop()
    end()
  }, [stop, end])

  return { state, caption, flights, finished, skip, again: play }
}
