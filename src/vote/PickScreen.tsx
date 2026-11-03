// お店を選ぶ。行きたい順の多数決では押した順に番号がつき、もう一度押すと取り消せる
import { useState } from 'react'
import { useModal } from '../shared/modal/ModalProvider'
import { EVENT, SHOPS, SHOP_IDS, type ShopId } from '../shared/shops'
import { currentMethod, loadStore, saveStore } from '../shared/store'
import { Arrow, Badge, Heading, HelpIcon, Top, VotingChip } from '../shared/ui/parts'
import type { Picks, VoteNav } from './VoteApp'

/** 押したお店を足す・外す。いつもの多数決では1つだけ */
function toggled(picks: ShopId[], id: ShopId): ShopId[] {
  if (picks.includes(id)) return picks.filter((x) => x !== id)
  if (currentMethod() === 'rcv') return [...picks, id]
  return [id]
}

export function PickScreen({ nav, chosen }: { nav: VoteNav; chosen: Picks }) {
  const { openDetail, openHow } = useModal()
  const { picks, setPicks } = chosen
  // 押して描き直したあとは、見出しの入りの動きを出さない
  const [touched, setTouched] = useState(false)

  const rcv = currentMethod() === 'rcv'
  const n = picks.length
  const label = rcv ? (n === 0 ? '1番を選んでください' : n === 1 ? '2番も選んでください' : 'これで投票する') : n ? 'これで投票する' : 'お店を選んでください'
  const ok = rcv ? n >= 2 : n > 0

  function toggle(id: ShopId) {
    setTouched(true)
    setPicks((picks) => toggled(picks, id))
  }

  function vote() {
    saveStore({ ...loadStore(), method: currentMethod(), picks: [...picks], sent: true, voted: true })
    nav.swap('voted')
  }

  return (
    <>
      <Top back={false} />
      <Heading
        fade={!touched}
        first={rcv ? '行きたい順に' : '行きたいお店を'}
        second={rcv ? <><em className="hl">2つ以上</em>押してください</> : <><em className="hl">1つ</em>押してください</>}
      />
      {rcv && (
        <button className="inline help" onClick={() => openHow({ label: 'お店を選ぶ' })}>
          <HelpIcon />
          この決め方の説明を見る
        </button>
      )}
      <div className="card">
        <div className="card-head">
          {EVENT.day + ' 忘年会のお店'}
          <VotingChip />
        </div>
        <dl className="info">
          <div>
            <dt>投票の締切</dt>
            <dd>
              <Badge>{EVENT.deadline}</Badge>
            </dd>
          </div>
        </dl>
        {SHOP_IDS.map((id) => {
          const rank = picks.indexOf(id)
          const selected = rank >= 0
          return (
            <div key={id} className={'shop-row' + (selected ? ' sel' : '')}>
              <button className="shop" data-id={id} aria-pressed={selected} onClick={() => toggle(id)}>
                <img src={SHOPS[id].img} alt="" />
                <span className="txt">
                  <strong>{SHOPS[id].name}</strong>
                  <small>{SHOPS[id].meta}</small>
                </span>
                <span className={'mark' + (selected ? ' num' : '')}>{selected ? rank + 1 : ''}</span>
              </button>
              <button
                className="detail"
                data-id={id}
                onClick={() => openDetail(id, { label: selected ? rank + 1 + '番を取り消す' : 'このお店を選ぶ', action: () => toggle(id) })}
              >
                詳細を見る
              </button>
            </div>
          )
        })}
      </div>
      {n > 0 && <p className="fine repick">番号をもう一度押すと選び直せます。</p>}
      <div className="push">
        <button className="btn" disabled={!ok} onClick={vote}>
          {label}
          {ok && <Arrow />}
        </button>
        <p className="fine strong">一度投票するとあとから変更できません。</p>
      </div>
    </>
  )
}
