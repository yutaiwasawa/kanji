// 画面の上の帯、見出し、ボタンの矢印など、どの画面でも使う小さな部品
import { Fragment, type ReactNode } from 'react'

/** 画面の上の帯。back が false なら「戻る」を出さない */
export function Top({ back = true }: { back?: boolean }) {
  return (
    <div className="top">
      {back ? (
        <button className="link back" onClick={() => history.back()}>
          <svg className="back-icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12.5 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          戻る
        </button>
      ) : (
        <span />
      )}
      <span />
      <span className="right" />
    </div>
  )
}

/** 見出し。2行目がなければ、1行ぶんの高さにする */
export function Heading({ first, second, fade = true }: { first: ReactNode; second?: ReactNode; fade?: boolean }) {
  const classes = [fade && 'fade', !second && 'one'].filter(Boolean).join(' ')
  return (
    <h1 className={classes}>
      <span>{first}</span>
      {second && <span>{second}</span>}
    </h1>
  )
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 目立たせたい所に付ける黄色の印（おすすめ、締切、移った票の数） */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={'badge' + (className ? ' ' + className : '')}>{children}</span>
}

/** 「投票中」の印 */
export function VotingChip() {
  return (
    <span className="state">
      <i />
      投票中
    </span>
  )
}

/** 幹事が選んだ決め方。「決め方」の印と名前を1行で */
export function ChosenMethod({ plain, className }: { plain: boolean; className?: string }) {
  return (
    <p className={'method-chosen' + (className ? ' ' + className : '')}>
      <span>決め方</span>
      {plain ? 'いつもの多数決' : '多くの意見が反映される多数決'}
    </p>
  )
}

/** 説明を開くリンクの頭に付ける「?」 */
export function HelpIcon() {
  return (
    <svg className="help-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.6 7.7a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14.6" r="1" fill="currentColor" />
    </svg>
  )
}

/** 行の間に改行を入れて並べる */
export function Lines({ items }: { items: ReactNode[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {item}
        </Fragment>
      ))}
    </>
  )
}
