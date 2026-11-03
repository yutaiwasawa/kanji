// 参加者に送るメッセージ。投票が終わるまでここで待つ
import { useState } from 'react'
import { EVENT } from '../shared/shops'
import { loadStore } from '../shared/store'
import { Arrow, ChosenMethod, Heading, Top } from '../shared/ui/parts'
import { HomeScreen } from './HomeScreen'
import type { KanjiNav } from './KanjiApp'
import { ResultScreen } from './ResultScreen'

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  )
}

/** クリップボードが使えない環境では、見えない textarea を選んでコピーする */
function copyLegacy(text: string): boolean {
  const t = document.createElement('textarea')
  t.value = text
  document.body.appendChild(t)
  t.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  t.remove()
  return ok
}

export function WaitScreen({ nav }: { nav: KanjiNav }) {
  const store = loadStore()
  const [copyNote, setCopyNote] = useState('')
  if (store.voted) return <ResultScreen nav={nav} />
  if (!store.sent) return <HomeScreen nav={nav} />

  const url = new URL('vote.html', location.href).href
  const message = '忘年会のお店を選んでください。\n締切は ' + EVENT.deadline + ' です。\n' + url

  function copy() {
    const done = () => setCopyNote('メッセージをコピーしました')
    const legacy = () => setCopyNote(copyLegacy(message) ? 'メッセージをコピーしました' : 'コピーできません。上の文を長押ししてください')
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(message).then(done, legacy)
    else legacy()
  }

  return (
    <>
      <Top />
      <ChosenMethod plain={store.method === 'plain'} className="above-heading" />
      <Heading first="このメッセージを" second="みんなに送ってください" />
      <div className="card msg">
        <button className="copy-icon" aria-label="メッセージをコピー" onClick={copy}>
          <CopyIcon />
        </button>
        <p className="body">
          忘年会のお店を選んでください。
          <br />
          {'締切は ' + EVENT.deadline + ' です。'}
          <a className="url" href="vote.html" target="_blank" rel="noopener">
            {url}
          </a>
        </p>
        <p className="copy-note" hidden={!copyNote}>
          {copyNote}
        </p>
      </div>
      <div className="push">
        <a className="btn" href="vote.html" target="_blank" rel="noopener">
          参加者の画面を開く
          <Arrow />
        </a>
      </div>
    </>
  )
}
