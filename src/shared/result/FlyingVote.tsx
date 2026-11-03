// 外れたお店から次のお店へ飛ぶ1票。元のマスの位置に出してから、行き先まで動かす
import { useLayoutEffect, useRef } from 'react'

export type Flight = {
  key: number
  /** 飛び立つマスの位置と大きさ */
  left: number
  top: number
  width: number
  height: number
  /** 行き先までの距離 */
  dx: number
  dy: number
}

export function FlyingVote({ flight }: { flight: Flight }) {
  const el = useRef<HTMLElement>(null)

  // 置いた位置を一度描いてから動かす。すぐ transform を付けると動きにならない
  useLayoutEffect(() => {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => {
        el.current!.style.transform = `translate(${flight.dx}px,${flight.dy}px)`
      })
    })
    return () => cancelAnimationFrame(id)
  }, [flight])

  const { left, top, width, height } = flight
  return <i ref={el} className="v y flying" style={{ left, top, width, height }} />
}
