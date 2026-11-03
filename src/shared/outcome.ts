// あなたの票と 8 人のサンプルの票を合わせて数え、結果にまとめる
import { plurality, tally, type Plurality, type TallyResult } from '../tally/tally'
import { OTHER_BALLOTS, SHOP_IDS, type ShopId } from './shops'
import type { Store } from './store'

export type Outcome = {
  /** 行きたい順の多数決で数えたか */
  rcv: boolean
  /** 1番の票だけで数えた結果（いつもの多数決）。比べる文に使う */
  plain: Plurality<ShopId>
  /** 行きたい順で数えた結果。いつもの多数決のときは null */
  result: TallyResult<ShopId> | null
  /** 決まったお店。同じ票で決まらなかったときは null */
  decided: ShopId | null
  /** 同じ票で決まらなかったお店。決まったときは null */
  tie: ShopId[] | null
}

export function outcome(store: Store): Outcome {
  const picks = store.picks ?? []
  const rcv = store.method !== 'plain'
  const firsts = [...OTHER_BALLOTS.map((b) => [b[0]]), [picks[0]]]
  const plain = plurality(firsts, SHOP_IDS)
  if (rcv) {
    const result = tally([...OTHER_BALLOTS, picks], SHOP_IDS, { seed: 'demo-poll' })
    return { rcv, plain, result, decided: result.winner, tie: null }
  }
  if (plain.leaders.length === 1) return { rcv, plain, result: null, decided: plain.leaders[0], tie: null }
  return { rcv, plain, result: null, decided: null, tie: plain.leaders }
}
