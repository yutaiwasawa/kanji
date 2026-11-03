// 幹事のページ。参加者の画面はここに出さない
import { Fragment, useEffect, type JSX } from 'react'
import { ModalProvider } from '../shared/modal/ModalProvider'
import { useScreens, type Navigation } from '../shared/navigation'
import { loadStore } from '../shared/store'
import { ChooseScreen } from './ChooseScreen'
import { HomeScreen } from './HomeScreen'
import { ResultScreen } from './ResultScreen'
import { WaitScreen } from './WaitScreen'

export type KanjiScreen = 'home' | 'choose' | 'wait' | 'result'
export type KanjiNav = Navigation<KanjiScreen>

export function KanjiApp() {
  const nav = useScreens<KanjiScreen>('home')

  // 参加者のタブで投票されたら、幹事の画面に結果を出す
  useEffect(() => {
    const onStorage = () => {
      const current = (window.history.state as { s?: string } | null)?.s
      if (current === 'wait' && loadStore().voted) nav.swap('result')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [nav.swap])

  const screens: Record<KanjiScreen, JSX.Element> = {
    home: <HomeScreen nav={nav} />,
    choose: <ChooseScreen nav={nav} />,
    wait: <WaitScreen nav={nav} />,
    result: <ResultScreen nav={nav} />,
  }
  return (
    <ModalProvider>
      <Fragment key={nav.epoch}>{screens[nav.name]}</Fragment>
    </ModalProvider>
  )
}
