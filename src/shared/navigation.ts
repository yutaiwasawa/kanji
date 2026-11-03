// 画面の移動。history の state に画面名を持たせ、ブラウザの戻るで前の画面に戻れるようにする
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

export type Navigation<Name extends string> = {
  /** いま出す画面 */
  name: Name
  /** 画面を組み直すたびに増える。同じ画面でも、組み直したら入りの動きを最初から出す */
  epoch: number
  /** 履歴を足して移る。戻るで戻れる */
  go: (name: Name) => void
  /** 今の履歴を置き換えて移る。戻るで戻れない */
  swap: (name: Name) => void
  /** 履歴はそのままで、画面を組み直す */
  show: (name: Name) => void
}

type HistoryState = { s?: string } | null

const asIs = <Name,>(name: Name) => name

/**
 * @param first 最初に出す画面
 * @param resolve 行き先を決め直す（投票ずみなら投票画面に戻さない、など）。変わったら履歴も置き換える
 */
export function useScreens<Name extends string>(first: Name, resolve: (name: Name) => Name = asIs): Navigation<Name> {
  const [state, setState] = useState(() => ({ name: resolve(first), epoch: 0 }))

  const move = useCallback(
    (name: Name, history: 'push' | 'replace' | 'keep') => {
      const target = resolve(name)
      if (history === 'push') window.history.pushState({ s: name }, '')
      if (history === 'replace' || target !== name) window.history.replaceState({ s: target }, '')
      setState((s) => ({ name: target, epoch: s.epoch + 1 }))
    },
    [resolve],
  )
  const go = useCallback((name: Name) => move(name, 'push'), [move])
  const swap = useCallback((name: Name) => move(name, 'replace'), [move])
  const show = useCallback((name: Name) => move(name, 'keep'), [move])

  // 最初の画面。履歴は置き換える（開いたときの一度だけ）
  useEffect(() => {
    window.history.replaceState({ s: state.name }, '')
  }, [])

  // ブラウザの戻る・進む
  useEffect(() => {
    const onPop = (e: PopStateEvent) => move(((e.state as HistoryState)?.s as Name | undefined) ?? first, 'keep')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [first, move])

  // 画面を組み直したら、いちばん上から見せる
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [state.epoch])

  return { name: state.name, epoch: state.epoch, go, swap, show }
}
