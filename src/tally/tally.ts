// 行きたい順の集計（画面に依存しない）。票の数は毎回ここで数える。
// 決まり:
// - 過半数は、その段階で残っている票の過半数
// - 最下位が同点なら、前の段階の票数までさかのぼって少ないほうを外す
// - 最初の段階まで同じなら、くじ（seed から計算するので何回数えても同じ結果）

/** 1枚の票。行きたい順にお店が並ぶ */
export type Ballot<S extends string> = S[]

export type Round<S extends string> = {
  /** この段階で、各お店に入っている票 */
  counts: Record<S, number>
  /** この段階が始まる時点で外れていたお店 */
  out: S[]
  winner: S | null
  loser: S | null
  /** 外れたお店の票が、どこに何票移ったか */
  moves: Partial<Record<S, number>>
  /** 行き先がなくなった票（順位切れ） */
  ended: number
  /** この段階で数えた票の合計 */
  valid: number
  /** 最下位が同点だったときの決め方。back: 前の段階にさかのぼった、lot: くじ */
  how: 'back' | 'lot' | null
  /** 最下位で同点だったお店 */
  tied: S[]
}

export type TallyResult<S extends string> = { rounds: Round<S>[]; winner: S }

export type Plurality<S extends string> = {
  counts: Record<S, number>
  /** いちばん多かったお店。同じ票なら複数 */
  leaders: S[]
}

/** 票の中で、まだ外れていない最初のお店 */
function firstAlive<S extends string>(ballot: Ballot<S>, out: S[]): S | null {
  for (const shop of ballot) if (!out.includes(shop)) return shop
  return null
}

function count<S extends string>(ballots: Ballot<S>[], shops: S[], out: S[]): Record<S, number> {
  const c = {} as Record<S, number>
  for (const s of shops) c[s] = 0
  for (const b of ballots) {
    const s = firstAlive(b, out)
    if (s) c[s]++
  }
  return c
}

/** FNV-1a。くじを seed から決めるための小さなハッシュ */
function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

function pickLoser<S extends string>(tied: S[], rounds: Round<S>[], seed: string): Pick<Round<S>, 'loser' | 'how' | 'tied'> {
  if (tied.length === 1) return { loser: tied[0], how: null, tied }
  // 前の段階にさかのぼって、少なかったほうを外す
  let left = tied
  for (let i = rounds.length - 1; i >= 0 && left.length > 1; i--) {
    const counts = rounds[i].counts
    const min = Math.min(...left.map((s) => counts[s]))
    left = left.filter((s) => counts[s] === min)
  }
  if (left.length === 1) return { loser: left[0], how: 'back', tied }
  // 最初の段階まで同じなら、くじ
  const drawn = [...left].sort((a, b) => hash(seed + ':' + a) - hash(seed + ':' + b) || (a < b ? -1 : 1))[0]
  return { loser: drawn, how: 'lot', tied }
}

export function tally<S extends string>(ballots: Ballot<S>[], shops: S[], opt?: { seed?: string }): TallyResult<S> {
  const seed = opt?.seed ?? ''
  let out: S[] = []
  const rounds: Round<S>[] = []
  for (;;) {
    const c = count(ballots, shops, out)
    const alive = shops.filter((s) => !out.includes(s))
    const total = alive.reduce((n, s) => n + c[s], 0)
    const top = [...alive].sort((a, b) => c[b] - c[a])[0]
    if (c[top] * 2 > total || alive.length === 1) {
      rounds.push({ counts: c, out: [...out], winner: top, loser: null, moves: {}, ended: 0, valid: total, how: null, tied: [] })
      return { rounds, winner: top }
    }
    const min = Math.min(...alive.map((s) => c[s]))
    const p = pickLoser(alive.filter((s) => c[s] === min), rounds, seed)
    const loser = p.loser as S
    const nextOut = [...out, loser]
    const moves: Partial<Record<S, number>> = {}
    let ended = 0
    for (const b of ballots) {
      if (firstAlive(b, out) !== loser) continue
      const to = firstAlive(b, nextOut)
      if (to) moves[to] = (moves[to] ?? 0) + 1
      else ended++
    }
    rounds.push({ counts: c, out: [...out], winner: null, loser, moves, ended, valid: total, how: p.how, tied: p.tied })
    out = nextOut
  }
}

/** いつもの多数決。1番の票だけを数える */
export function plurality<S extends string>(ballots: Ballot<S>[], shops: S[]): Plurality<S> {
  const c = count(ballots, shops, [])
  const max = Math.max(...shops.map((s) => c[s]))
  return { counts: c, leaders: shops.filter((s) => c[s] === max) }
}
