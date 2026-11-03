// ポップアップを開く入口。画面が変わってもポップアップは残る
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ShopId } from '../shops'
import { DetailSheet, type DetailOption } from './DetailSheet'
import { HowSheet, type HowOption } from './HowSheet'

type Opened = { kind: 'detail'; id: ShopId; option?: DetailOption } | { kind: 'how'; option: HowOption }

type ModalApi = {
  openDetail: (id: ShopId, option?: DetailOption) => void
  openHow: (option: HowOption) => void
}

const ModalContext = createContext<ModalApi | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<Opened | null>(null)
  const api = useMemo<ModalApi>(
    () => ({
      openDetail: (id, option) => setOpened({ kind: 'detail', id, option }),
      openHow: (option) => setOpened({ kind: 'how', option }),
    }),
    [],
  )
  const close = () => setOpened(null)

  return (
    <ModalContext.Provider value={api}>
      {children}
      {opened?.kind === 'detail' && <DetailSheet id={opened.id} option={opened.option} onClose={close} />}
      {opened?.kind === 'how' && <HowSheet option={opened.option} onClose={close} />}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalApi {
  const api = useContext(ModalContext)
  if (!api) throw new Error('ModalProvider の中で使う')
  return api
}
