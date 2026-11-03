// 決め方を選ぶ。行きたい順の多数決をすすめる
import { useModal } from '../shared/modal/ModalProvider'
import { saveStore, type Method } from '../shared/store'
import { Arrow, Badge, Heading, HelpIcon, Top } from '../shared/ui/parts'
import type { KanjiNav } from './KanjiApp'

export function ChooseScreen({ nav }: { nav: KanjiNav }) {
  const { openHow } = useModal()

  function pick(method: Method) {
    saveStore({ method, sent: true })
    nav.go('wait')
  }

  return (
    <>
      <Top />
      <Heading first="どちらで決めますか" />
      <div className="card">
        <div className="method best">
          <Badge className="rec">おすすめ</Badge>
          <strong>多くの意見が反映される多数決</strong>
          <small>
            行きたい順に投票して、
            <br />
            より多くの人が行きたいお店に決まります。
          </small>
          <div className="row">
            <button className="btn" onClick={() => pick('rcv')}>
              この決め方にする
              <Arrow />
            </button>
            <button className="tlink help" onClick={() => openHow({ label: 'この決め方にする', action: () => pick('rcv') })}>
              <HelpIcon />
              この決め方の説明を見る
            </button>
          </div>
        </div>
        <div className="method">
          <strong>いつもの多数決</strong>
          <small>1人1票で、いちばん多いお店に決まります。</small>
          <div className="row">
            <button className="btn ghost" onClick={() => pick('plain')}>
              この決め方にする
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
