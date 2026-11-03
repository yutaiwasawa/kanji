// お店・日程・サンプルの票。店名と票はサンプル
import umi from '../assets/umi.png'
import tori from '../assets/tori.png'
import bistro from '../assets/bistro.png'

export type ShopId = 'umi' | 'tori' | 'bistro'

export type Shop = {
  name: string
  /** 一覧に出す一言（料理・会費・場所） */
  meta: string
  price: number
  img: string
  /** 詳細のポップアップに出す項目 */
  rows: [string, string][]
}

export const SHOPS: Record<ShopId, Shop> = {
  umi: {
    name: '海の家',
    meta: '海鮮・4,500円・新宿駅5分',
    price: 4500,
    img: umi,
    rows: [['料理', '刺身と海鮮の盛り合わせ'], ['会費の目安', '4,500円（飲み放題つき）'], ['場所', '新宿駅 東口から徒歩5分'], ['席', '掘りごたつの個室']],
  },
  tori: {
    name: '鳥よし',
    meta: '焼き鳥・4,000円・新宿駅2分',
    price: 4000,
    img: tori,
    rows: [['料理', '炭火の焼き鳥コース'], ['会費の目安', '4,000円（飲み放題つき）'], ['場所', '新宿駅 西口から徒歩2分'], ['席', 'テーブル席の貸切スペース']],
  },
  bistro: {
    name: 'ビストロK',
    meta: '洋食・5,000円・新宿駅3分',
    price: 5000,
    img: bistro,
    rows: [['料理', '肉料理とワインのコース'], ['会費の目安', '5,000円（飲み放題つき）'], ['場所', '新宿駅 南口から徒歩3分'], ['席', 'ソファのある半個室']],
  },
}

/** 画面に並べる順 */
export const SHOP_IDS: ShopId[] = ['bistro', 'umi', 'tori']

/** あなた以外の 8 人の票（サンプル）。行きたい順に並んでいる */
export const OTHER_BALLOTS: ShopId[][] = [
  ['umi', 'tori'],
  ['umi', 'bistro'],
  ['umi', 'tori'],
  ['umi', 'bistro'],
  ['tori', 'umi'],
  ['tori', 'bistro'],
  ['tori', 'umi'],
  ['bistro', 'tori'],
]

export const EVENT = {
  day: '12/18(金)',
  date: '12/18(金) 19:00',
  place: '新宿',
  deadline: '12/11(金) 23:59',
}
