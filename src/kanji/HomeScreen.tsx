// 幹事のホーム。準備の進み具合と、次にやることのボタン
import type { ReactNode } from 'react'
import { outcome } from '../shared/outcome'
import { EVENT, SHOPS } from '../shared/shops'
import { clearStore, loadStore } from '../shared/store'
import { joinNames } from '../shared/result/texts'
import { Arrow, ChosenMethod, Heading, Top, VotingChip } from '../shared/ui/parts'
import type { KanjiNav } from './KanjiApp'

function Item({ title, note }: { title: string; note: string }) {
  return (
    <div className="item">
      <div>
        <strong>{title}</strong>
        <small>{note}</small>
      </div>
      <span className="mark done">✓</span>
    </div>
  )
}

export function HomeScreen({ nav }: { nav: KanjiNav }) {
  const store = loadStore()
  const o = store.voted ? outcome(store) : null
  const shop = o?.decided ? SHOPS[o.decided] : null

  let status = ''
  let next: ReactNode
  const startOver = () => {
    clearStore()
    nav.go('choose')
  }
  if (shop) {
    next = (
      <button className="btn" onClick={() => nav.go('wait')}>
        結果を見る
        <Arrow />
      </button>
    )
  } else if (o?.tie) {
    status = joinNames(o.tie) + 'が同じ票でした'
    next = (
      <button className="btn" onClick={startOver}>
        決め直す
        <Arrow />
      </button>
    )
  } else if (store.sent) {
    next = (
      <button className="btn" onClick={() => nav.go('wait')}>
        送るメッセージを見る
        <Arrow />
      </button>
    )
  } else {
    next = (
      <button className="btn" onClick={startOver}>
        お店の決め方を選ぶ
        <Arrow />
      </button>
    )
  }

  return (
    <>
      <Top back={false} />
      <Heading first={EVENT.day + ' 忘年会'} />
      <div className="card fade">
        <Item title="日程" note={EVENT.date} />
        {shop ? <Item title="お店" note={shop.name + '。9人の投票で決まりました'} /> : <Item title="お店" note="候補 3つ" />}
        <Item title="出欠" note="9人が参加" />
        <Item title="会費" note={shop ? '1人 ' + shop.price.toLocaleString() + '円' : '1人 4,000〜5,000円'} />
      </div>
      <div className="push">
        {store.sent && !o && (
          <div className="home-voting">
            <ChosenMethod plain={store.method === 'plain'} />
            <p>
              <VotingChip />
              締切 {EVENT.deadline}
            </p>
          </div>
        )}
        {status && <p className="home-status">{status}</p>}
        {next}
        {store.sent && (
          <button
            className="tlink"
            onClick={() => {
              clearStore()
              nav.show('home')
            }}
          >
            最初からやり直す
          </button>
        )}
        <p className="fine">デモなのでお店の投票だけ使えます。</p>
      </div>
    </>
  )
}
