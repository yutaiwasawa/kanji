// 票のマスの表に何を出すか。1マスが1票
import type { Outcome } from '../outcome'
import { SHOP_IDS, type ShopId } from '../shops'

export type RowState = {
  /** 1番の票。青いマス */
  base: number
  /** 外れたお店から移ってきた票。黄色いマス */
  gain?: number
  /** 「+n」の印 */
  chip?: number
  /** 決まったお店 */
  win?: boolean
  /** 外れたお店 */
  out?: boolean
  /** いま外れるところ。票が飛んでいく */
  leaving?: boolean
}

export type TallyState = {
  /** 上から並べる順 */
  order: ShopId[]
  rows: Record<ShopId, RowState>
}

export type Counts = Record<ShopId, number>

/** 外れたお店を下に、あとは票の多い順に並べる */
export function orderShops(counts: Counts, out: ShopId[]): ShopId[] {
  return [...SHOP_IDS].sort((a, b) => Number(out.includes(a)) - Number(out.includes(b)) || counts[b] - counts[a])
}

/** まだ1票も入っていない表 */
export function emptyState(order: ShopId[]): TallyState {
  const rows = {} as Record<ShopId, RowState>
  for (const id of order) rows[id] = { base: 0 }
  return { order, rows }
}

export function patchRow(st: TallyState, id: ShopId, patch: Partial<RowState>): TallyState {
  return { ...st, rows: { ...st.rows, [id]: { ...st.rows[id], ...patch } } }
}

/** 1番の票を1票ずつ増やしたときの表 */
export function countedUpTo(st: TallyState, counts: Counts, n: number): TallyState {
  const rows = { ...st.rows }
  for (const id of st.order) rows[id] = { ...rows[id], base: Math.min(n, counts[id]) }
  return { ...st, rows }
}

/** 最後に出す表。決まったお店は上、外れたお店は下 */
export function finalState(o: Outcome): TallyState {
  if (!o.result) {
    const rows = {} as Record<ShopId, RowState>
    for (const id of SHOP_IDS) rows[id] = { base: o.plain.counts[id], win: id === o.decided }
    return { order: orderShops(o.plain.counts, []), rows }
  }
  const rounds = o.result.rounds
  const first = rounds[0]
  const last = rounds[rounds.length - 1]
  const rows = {} as Record<ShopId, RowState>
  for (const id of SHOP_IDS) {
    rows[id] = last.out.includes(id)
      ? { base: 0, out: true }
      : { base: first.counts[id], gain: last.counts[id] - first.counts[id], win: id === o.result.winner }
  }
  return { order: orderShops(last.counts, last.out), rows }
}

/** 1行に並べるマスの数。5より多い票が入ったら増やす */
export function slotsFor(o: Outcome): number {
  const counts = o.result ? o.result.rounds[o.result.rounds.length - 1].counts : o.plain.counts
  return Math.max(5, ...SHOP_IDS.map((id) => counts[id]))
}
