// 票のマスの表。行は動かずに並び順だけ変わるので、transform で上下に動かす
import type { CSSProperties, Ref } from 'react'
import { SHOPS, SHOP_IDS, type ShopId } from '../shops'
import { Badge } from '../ui/parts'
import type { RowState, TallyState } from './tallyState'

/** 1行の高さ（px） */
export const PITCH = 58

export function TallyBoard({ state, slots, ref }: { state: TallyState; slots: number; ref: Ref<HTMLDivElement> }) {
  const style = { height: PITCH * SHOP_IDS.length, '--pitch': PITCH + 'px' } as CSSProperties
  return (
    <div className="tally" ref={ref} style={style}>
      {SHOP_IDS.map((id) => (
        <TallyRow key={id} id={id} row={state.rows[id]} y={state.order.indexOf(id) * PITCH} slots={slots} />
      ))}
    </div>
  )
}

function TallyRow({ id, row, y, slots }: { id: ShopId; row: RowState; y: number; slots: number }) {
  const base = row.base || 0
  const gain = row.gain || 0
  const gone = !!(row.out || row.leaving)
  const classes = ['tr-row', row.out && 'out', row.leaving && 'drop'].filter(Boolean).join(' ')

  // 印が変わったときだけ入れ直す（入りの動きをそのたびに出す）
  const tagKey = [row.chip || 0, row.win ? 'win' : '', gone ? 'off' : ''].join('|')

  return (
    <div className={classes} data-id={id} style={{ transform: `translateY(${y}px)` }}>
      <div className="tr-body">
        <div className="tr-line">
          <span className="tr-name">{SHOPS[id].name}</span>
          <span className="tr-tags" key={tagKey}>
            {row.chip ? <Badge className="pop">{'+' + row.chip}</Badge> : null}
            {row.win && <span className="tag win">決定</span>}
            {gone && <span className="tag off">外れました</span>}
          </span>
        </div>
        <div className="tr-bar">
          <div className="slots" style={{ gridTemplateColumns: `repeat(${slots},1fr)` }}>
            {Array.from({ length: slots }, (_, k) => (
              <i key={k} className={k < base ? (row.leaving ? 'v y' : 'v t') : k < base + gain ? 'v y' : 'v'} />
            ))}
          </div>
          <span className="count">{gone ? '' : base + gain + '票'}</span>
        </div>
      </div>
    </div>
  )
}
