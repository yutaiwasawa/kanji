// 幹事のページと参加者のページをつなぐ保存（同じブラウザの中だけ）
import type { ShopId } from './shops'

export type Method = 'rcv' | 'plain'

export type Store = {
  method?: Method
  /** 幹事が決め方を選び、参加者にメッセージを送った */
  sent?: boolean
  /** 参加者が投票した */
  voted?: boolean
  /** 参加者が選んだお店。行きたい順 */
  picks?: ShopId[]
}

const KEY = 'kanji-demo-v4'

export function loadStore(): Store {
  try {
    return (JSON.parse(localStorage.getItem(KEY) ?? 'null') as Store | null) ?? {}
  } catch {
    return {}
  }
}

export function saveStore(store: Store): void {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function clearStore(): void {
  localStorage.removeItem(KEY)
}

/** 決め方。指定がなければ、行きたい順の多数決 */
export function currentMethod(): Method {
  return loadStore().method === 'plain' ? 'plain' : 'rcv'
}
