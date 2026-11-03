// 参加者のページ。送られたリンクを開くと、すぐお店を選べる。幹事の画面には行かない
import { Fragment, useState, type JSX } from 'react'
import { ModalProvider } from '../shared/modal/ModalProvider'
import { useScreens, type Navigation } from '../shared/navigation'
import type { ShopId } from '../shared/shops'
import { loadStore } from '../shared/store'
import { PickScreen } from './PickScreen'
import { ResultScreen } from './ResultScreen'
import { VotedScreen } from './VotedScreen'

export type VoteScreen = 'pick' | 'voted' | 'result'
export type VoteNav = Navigation<VoteScreen>

/** 選んだお店。行きたい順 */
export type Picks = { picks: ShopId[]; setPicks: (update: (picks: ShopId[]) => ShopId[]) => void }

// 投票ずみなら選ぶ画面には戻さず、投票ずみでなければ投票した画面は出さない
function resolve(name: VoteScreen): VoteScreen {
  const voted = !!loadStore().voted
  if (name === 'pick' && voted) return 'voted'
  if (name === 'voted' && !voted) return 'pick'
  return name
}

export function VoteApp() {
  const nav = useScreens<VoteScreen>('pick', resolve)
  // 画面を行き来しても、選んだ順は消えない
  const [picks, setPicks] = useState<ShopId[]>([])
  const chosen: Picks = { picks, setPicks }

  const screens: Record<VoteScreen, JSX.Element> = {
    pick: <PickScreen nav={nav} chosen={chosen} />,
    voted: <VotedScreen nav={nav} />,
    result: <ResultScreen nav={nav} chosen={chosen} />,
  }
  return (
    <ModalProvider>
      <Fragment key={nav.epoch}>{screens[nav.name]}</Fragment>
    </ModalProvider>
  )
}
