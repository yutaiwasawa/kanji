// 決まったお店のカード。詳細はボタンで目立たせる
import { useModal } from '../modal/ModalProvider'
import { SHOPS, type ShopId } from '../shops'

export function WonCard({ id }: { id: ShopId }) {
  const { openDetail } = useModal()
  const shop = SHOPS[id]
  return (
    <div className="card won fade">
      <img src={shop.img} alt="" />
      <span className="txt">
        <strong>{shop.name}</strong>
        <small>{shop.meta}</small>
      </span>
      <button className="pill-btn" onClick={() => openDetail(id)}>
        詳細を見る
      </button>
    </div>
  )
}
