// 投票したあと。選んだ順を見せ、デモなので結果をすぐ見られる
import { EVENT, SHOPS } from '../shared/shops'
import { loadStore } from '../shared/store'
import { Arrow, Badge, Heading, Top } from '../shared/ui/parts'
import type { VoteNav } from './VoteApp'

export function VotedScreen({ nav }: { nav: VoteNav }) {
  const picks = loadStore().picks ?? []
  return (
    <>
      <Top back={false} />
      <Heading first="ありがとうございます！" second="投票しました" />
      <p className="sub">
        結果は締切のあとに確認できます
        <span className="deadline-line">
          締切<Badge>{EVENT.deadline}</Badge>
        </span>
      </p>
      <div className="card">
        <div className="card-head">あなたの順番</div>
        {picks.map((id, i) => (
          <div key={id} className="item mine">
            <span className="mark num">{i + 1}</span>
            <strong>{SHOPS[id].name}</strong>
          </div>
        ))}
      </div>
      <div className="push">
        <button className="btn" onClick={() => nav.go('result')}>
          結果を見る
          <Arrow />
        </button>
        <p className="fine">デモなので締切を待たずに結果を見られます。</p>
      </div>
    </>
  )
}
