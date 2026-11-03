import { describe, expect, it } from 'vitest'
import { outcome } from './outcome'
import { compareText, mineText, whyLines } from './result/texts'
import { finalState } from './result/tallyState'

describe('デモの結果（8 人のサンプルの票 + あなたの票）', () => {
  it('ビストロK → 鳥よし と選ぶと、鳥よし 5票、海の家 4票、ビストロK は外れる', () => {
    const o = outcome({ method: 'rcv', picks: ['bistro', 'tori'], sent: true, voted: true })
    expect(o.rcv).toBe(true)
    expect(o.decided).toBe('tori')
    expect(o.tie).toBeNull()

    const rounds = o.result!.rounds
    expect(rounds[0]).toMatchObject({ counts: { bistro: 2, umi: 4, tori: 3 }, loser: 'bistro', moves: { tori: 2 } })
    expect(rounds[1]).toMatchObject({ counts: { bistro: 0, umi: 4, tori: 5 }, winner: 'tori', out: ['bistro'] })

    // 画面の最後に出す表: 上から 鳥よし 5票（3 + 2）、海の家 4票、ビストロK は外れました
    const final = finalState(o)
    expect(final.order).toEqual(['tori', 'umi', 'bistro'])
    expect(final.rows.tori).toEqual({ base: 3, gain: 2, win: true })
    expect(final.rows.umi).toEqual({ base: 4, gain: 0, win: false })
    expect(final.rows.bistro).toEqual({ base: 0, out: true })

    expect(whyLines(o)).toEqual(['ビストロKに入れた2人の票が、次に行きたい鳥よしに移りました。'])
    expect(mineText(o, ['bistro', 'tori'])).not.toBe('')
    expect(compareText(o)).toBe('いつもの多数決なら、海の家でした。')
  })

  it('いつもの多数決では 1番の票だけで決まる', () => {
    const o = outcome({ method: 'plain', picks: ['tori'], sent: true, voted: true })
    expect(o.rcv).toBe(false)
    expect(o.result).toBeNull()
    // 海の家 4、鳥よし 3 + 1、ビストロK 1 で同じ票
    expect(o.decided).toBeNull()
    expect(o.tie).toEqual(['umi', 'tori'])
  })

  it('いつもの多数決で海の家を選ぶと、海の家に決まる', () => {
    const o = outcome({ method: 'plain', picks: ['umi'], sent: true, voted: true })
    expect(o.decided).toBe('umi')
    expect(o.plain.counts).toEqual({ bistro: 1, umi: 5, tori: 3 })
  })
})
