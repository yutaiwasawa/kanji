import { describe, expect, it } from 'vitest'
import { plurality, tally } from './tally'

describe('tally（行きたい順の集計）', () => {
  it('最初の段階で過半数なら、そこで決まる', () => {
    const r = tally([['a'], ['a'], ['b']], ['a', 'b'])
    expect(r.winner).toBe('a')
    expect(r.rounds).toHaveLength(1)
    expect(r.rounds[0]).toMatchObject({ counts: { a: 2, b: 1 }, winner: 'a', loser: null, valid: 3 })
  })

  it('いちばん少ないお店が外れ、その票は次に行きたいお店に移る', () => {
    const r = tally([['a', 'c'], ['a', 'c'], ['b'], ['b'], ['c', 'b']], ['a', 'b', 'c'])
    expect(r.rounds[0]).toMatchObject({ counts: { a: 2, b: 2, c: 1 }, loser: 'c', moves: { b: 1 }, ended: 0, how: null })
    expect(r.rounds[1]).toMatchObject({ counts: { a: 2, b: 3, c: 0 }, out: ['c'], winner: 'b' })
    expect(r.winner).toBe('b')
  })

  it('順位切れの票は数えなくなり、過半数は残った票で見る', () => {
    const r = tally([['a'], ['a'], ['a'], ['b'], ['b'], ['c']], ['a', 'b', 'c'])
    // 最初は 3/6 で過半数に届かない
    expect(r.rounds[0]).toMatchObject({ loser: 'c', moves: {}, ended: 1, valid: 6 })
    // c の票は行き先がなく、残り 5 票の中で 3 票は過半数
    expect(r.rounds[1]).toMatchObject({ counts: { a: 3, b: 2, c: 0 }, winner: 'a', valid: 5 })
  })

  it('最下位が同点なら、前の段階で少なかったほうが外れる', () => {
    const ballots = [['a'], ['a'], ['a'], ['a'], ['b', 'a'], ['b', 'a'], ['c'], ['c'], ['c'], ['d', 'b']]
    const r = tally(ballots, ['a', 'b', 'c', 'd'])
    expect(r.rounds[0]).toMatchObject({ counts: { a: 4, b: 2, c: 3, d: 1 }, loser: 'd', moves: { b: 1 } })
    // 2 段階目は b と c が 3 票で同点。1 段階目は b が 2 票、c が 3 票だったので b が外れる
    expect(r.rounds[1]).toMatchObject({ counts: { a: 4, b: 3, c: 3, d: 0 }, loser: 'b', how: 'back', tied: ['b', 'c'], moves: { a: 2 }, ended: 1 })
    expect(r.rounds[2]).toMatchObject({ counts: { a: 6, b: 0, c: 3, d: 0 }, winner: 'a', valid: 9 })
  })

  it('最初の段階まで同点なら、くじ。seed が同じなら何回数えても同じ結果', () => {
    const first = tally([['a'], ['b']], ['a', 'b'], { seed: 'demo-poll' })
    const second = tally([['a'], ['b']], ['a', 'b'], { seed: 'demo-poll' })
    expect(first.rounds[0]).toMatchObject({ how: 'lot', tied: ['a', 'b'], loser: 'b' })
    expect(second).toEqual(first)
    expect(first.winner).toBe('a')
    // seed が変われば、くじの結果も変わりうる
    expect(tally([['a'], ['b']], ['a', 'b'], { seed: 'other' }).winner).toBe('b')
  })

  it('3 つ同点でも、くじで 1 つずつ外していく', () => {
    const r = tally([['a'], ['b'], ['c']], ['a', 'b', 'c'], { seed: 'demo-poll' })
    expect(r.rounds.map((rd) => rd.loser)).toEqual(['b', 'c', null])
    expect(r.rounds.map((rd) => rd.how)).toEqual(['lot', 'lot', null])
    expect(r.winner).toBe('a')
  })
})

describe('plurality（いつもの多数決）', () => {
  it('1番の票だけを数え、同じ票なら leaders が複数になる', () => {
    expect(plurality([['a'], ['b'], ['a'], ['b'], ['c']], ['a', 'b', 'c'])).toEqual({ counts: { a: 2, b: 2, c: 1 }, leaders: ['a', 'b'] })
    expect(plurality([['a', 'b'], ['b'], ['a']], ['a', 'b'])).toEqual({ counts: { a: 2, b: 1 }, leaders: ['a'] })
  })
})
