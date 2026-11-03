// お店の詳細（ポップアップ）。option があれば選ぶボタンを出す
import { SHOPS, type ShopId } from '../shops'
import { CloseBar, Modal } from './Modal'

export type DetailOption = { label: string; action: () => void }

export function DetailSheet({ id, option, onClose }: { id: ShopId; option?: DetailOption; onClose: () => void }) {
  const shop = SHOPS[id]
  return (
    <Modal onClose={onClose}>
      <div className="sheet fade">
        <CloseBar onClose={onClose} />
        <div className="sheet-head">
          <img src={shop.img} alt="" />
          <div>
            <strong>{shop.name}</strong>
            <small>{shop.meta}</small>
          </div>
        </div>
        <dl className="rows">
          {shop.rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {option && (
          <button
            className="btn"
            onClick={() => {
              onClose()
              option.action()
            }}
          >
            {option.label}
          </button>
        )}
      </div>
    </Modal>
  )
}
