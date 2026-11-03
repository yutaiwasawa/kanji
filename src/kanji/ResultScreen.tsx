// 幹事に見せる結果。決まったお店と、決まるまでの流れ
import { outcome } from '../shared/outcome'
import { ResultCard } from '../shared/result/ResultCard'
import { ResultHeading } from '../shared/result/ResultHeading'
import { compareText, endingLines, joinNames } from '../shared/result/texts'
import { loadStore } from '../shared/store'
import { Arrow, Top } from '../shared/ui/parts'
import { WonCard } from '../shared/ui/WonCard'
import { HomeScreen } from './HomeScreen'
import type { KanjiNav } from './KanjiApp'

export function ResultScreen({ nav }: { nav: KanjiNav }) {
  const store = loadStore()
  if (!store.voted) return <HomeScreen nav={nav} />
  const o = outcome(store)

  const home = (
    <div className="push">
      <button className="btn" onClick={() => nav.go('home')}>
        ホームに戻る
        <Arrow />
      </button>
    </div>
  )

  if (o.tie) {
    return (
      <>
        <Top />
        <ResultHeading outcome={o} />
        <ResultCard outcome={o} ending={joinNames(o.tie) + 'が同じ票でした。ホームから決め直せます。'} />
        {home}
      </>
    )
  }

  return (
    <>
      <Top />
      <ResultHeading outcome={o} />
      <p className="sub">みんなの投票で決まりました</p>
      <WonCard id={o.decided!} />
      <ResultCard outcome={o} ending={endingLines(o, [compareText(o)])} />
      {home}
    </>
  )
}
