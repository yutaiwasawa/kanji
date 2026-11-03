// 決め方の説明（ポップアップ）。動画は押すと止まる
import { useCallback, useRef, useState } from 'react'
import howVideo from '../../assets/how-v15.mp4'
import { Arrow } from '../ui/parts'
import { CloseBar, Modal } from './Modal'

/** 主ボタンの文言と、押したときの動き */
export type HowOption = { label: string; action?: () => void }

export function HowSheet({ option, onClose }: { option: HowOption; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  // 一度でも再生が始まったら、動画を見せる（読み込み中の白い面を消す）
  const [ready, setReady] = useState(false)
  // 読み込み中の表示を消しているか。途中で止まったら戻す
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [fast, setFast] = useState(false)
  // 最後まで見たら少し暗くして、もう一度見るを出す
  const [ended, setEnded] = useState(false)

  const close = useCallback(() => {
    video.current?.pause()
    onClose()
  }, [onClose])

  function replay() {
    const v = video.current!
    setEnded(false)
    v.currentTime = 0
    v.playbackRate = fast ? 1.5 : 1
    v.play()
  }

  function toggleSpeed() {
    const v = video.current!
    const next = !fast
    setFast(next)
    v.playbackRate = next ? 1.5 : 1
    if (v.paused && !v.ended) v.play()
  }

  function togglePause() {
    const v = video.current!
    if (v.paused) v.play()
    else v.pause()
  }

  return (
    <Modal label="この決め方の説明" onClose={close}>
      <div className="sheet how-sheet fade">
        <CloseBar onClose={close} />
        <div className={'card video' + (loaded ? ' loaded' : '')}>
          <div className="loading" role="status">
            {failed ? (
              <span>動画を読み込めませんでした</span>
            ) : (
              <>
                <i />
                <span>読み込み中</span>
              </>
            )}
          </div>
          <video
            ref={video}
            className={ready ? 'ready' : undefined}
            src={howVideo}
            muted
            playsInline
            autoPlay
            preload="auto"
            onPlaying={() => {
              setReady(true)
              setLoaded(true)
            }}
            onWaiting={() => setLoaded(false)}
            onError={() => {
              setLoaded(false)
              setFailed(true)
            }}
            onClick={togglePause}
            onEnded={() => setEnded(true)}
            onPlay={() => setEnded(false)}
          />
          <div className="ended-cover" hidden={!ended}>
            <button className="pill-btn replay" onClick={replay}>
              ↻ もう一度見る
            </button>
          </div>
        </div>
        <div className="vctl">
          <button className="pill-btn" onClick={toggleSpeed}>
            {fast ? '標準の速さで見る' : '1.5倍速で見る'}
          </button>
          <button className="tlink" hidden={ended} onClick={replay}>
            ↻ もう一度見る
          </button>
        </div>
        <button
          className="btn"
          onClick={() => {
            close()
            option.action?.()
          }}
        >
          {option.label}
          <Arrow />
        </button>
      </div>
    </Modal>
  )
}
