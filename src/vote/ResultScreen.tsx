// 参加者に見せる結果。自分の票がどこに入ったかも言う
import { outcome } from '../shared/outcome'
import { ResultCard } from '../shared/result/ResultCard'
import { ResultHeading } from '../shared/result/ResultHeading'
import { compareText, endingLines, joinNames, mineText } from '../shared/result/texts'
import { EVENT } from '../shared/shops'
import { loadStore } from '../shared/store'
import { Top } from '../shared/ui/parts'
import { WonCard } from '../shared/ui/WonCard'
import { PickScreen } from './PickScreen'
import type { Picks, VoteNav } from './VoteApp'

export function ResultScreen({ nav, chosen }: { nav: VoteNav; chosen: Picks }) {
  const store = loadStore()
  if (!store.voted) return <PickScreen nav={nav} chosen={chosen} />
  const o = outcome(store)

  if (o.tie) {
    return (
      <>
        <Top />
        <ResultHeading outcome={o} />
        <ResultCard outcome={o} ending={joinNames(o.tie) + 'が同じ票でした。'} />
        <p className="fine big">お店は、幹事さんから連絡があります。</p>
      </>
    )
  }

  return (
    <>
      <Top />
      <ResultHeading outcome={o} />
      <p className="sub">{'開催 ' + EVENT.date + '・' + EVENT.place}</p>
      <WonCard id={o.decided!} />
      <ResultCard outcome={o} ending={endingLines(o, [mineText(o, store.picks ?? []), compareText(o)])} />
      <p className="closing">
        当日の案内は幹事さんから届きますので
        <br />
        お待ちください。
      </p>
    </>
  )
}
