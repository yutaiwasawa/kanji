// 結果の説明文。段階を見せず、何が起きたかを短く言う
import type { ReactNode } from 'react'
import type { Round } from '../../tally/tally'
import type { Outcome } from '../outcome'
import { SHOPS, type ShopId } from '../shops'
import { Lines } from '../ui/parts'

/** 「AとB」のように店名をつなぐ */
export function joinNames(ids: ShopId[]): string {
  return ids.map((id) => SHOPS[id].name).join('と')
}

/** 外れるお店の説明 */
export function loseText(rd: Round<ShopId>): string {
  const name = SHOPS[rd.loser!].name
  if (!rd.how) return name + 'がいちばん少ないので外れます。'
  return joinNames(rd.tied) + 'が同じ票でした。' + (rd.how === 'back' ? '前の段階で少なかった' : 'くじで') + name + 'が外れます。'
}

/** 外れたお店の票がどこに移ったかの説明 */
export function moveText(rd: Round<ShopId>): string {
  const to = Object.keys(rd.moves) as ShopId[]
  const n = rd.counts[rd.loser!]
  const where = to.length === 1 ? '次に行きたい' + SHOPS[to[0]].name + 'に移りました。' : to.length ? 'それぞれ次に行きたいお店に移りました。' : 'これで終わりました。'
  return SHOPS[rd.loser!].name + 'に入れた' + n + '人の票が、' + where
}

/** なぜそのお店に決まったか。行ごとに返す。いつもの多数決では空 */
export function whyLines(o: Outcome): ReactNode[] {
  if (!o.result || !o.decided) return []
  const rounds = o.result.rounds
  const winner = SHOPS[o.decided].name
  if (!rounds[0].loser) return ['1番の票だけで、' + winner + 'が' + rounds[0].counts[o.decided] + '票になりました。']
  return rounds
    .filter((r) => r.loser)
    .flatMap((r) => {
      const note = r.how ? joinNames(r.tied) + 'が同じ票だったので、' + (r.how === 'back' ? '前の段階で少なかったほうを外しました。' : 'くじで外すお店を決めました。') : null
      return note ? [note, moveText(r)] : [moveText(r)]
    })
}

/** あなたの票が最後に入ったお店。1番に入ったままなら何も言わない */
export function mineText(o: Outcome, picks: ShopId[]): ReactNode {
  if (!o.result) return ''
  const outs = o.result.rounds[o.result.rounds.length - 1].out
  for (let i = 0; i < picks.length; i++) {
    if (!outs.includes(picks[i])) {
      if (i === 0) return ''
      return (
        <>
          最終的にあなたの票は
          <span className="mine-line">{i + 1 + '番の' + SHOPS[picks[i]].name}</span>
          に入りました。
        </>
      )
    }
  }
  return 'あなたが選んだお店は、すべて外れました。'
}

/** いつもの多数決ならどうだったか。行きたい順の多数決のときだけ出す */
export function compareText(o: Outcome): string {
  if (!o.rcv) return ''
  const leaders = o.plain.leaders
  if (leaders.length > 1) return 'いつもの多数決なら、' + joinNames(leaders) + 'が同じ票でした。'
  return (leaders[0] === o.decided ? 'いつもの多数決でも、' : 'いつもの多数決なら、') + SHOPS[leaders[0]].name + 'でした。'
}

/**
 * 決まったあと、流れのカードの最後に出す説明。なぜ決まったかの行のあとに extras を太字で足す
 * @param extras 空の文は出さない
 */
export function endingLines(o: Outcome, extras: ReactNode[]): ReactNode {
  const why = whyLines(o)
  const lines = why.length ? why : [SHOPS[o.decided!].name + 'がいちばん多くなりました。']
  return <Lines items={[...lines, ...extras.filter(Boolean).map((text, i) => <b key={i}>{text}</b>)]} />
}
