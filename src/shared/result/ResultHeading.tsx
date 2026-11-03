// 結果の見出し。決まったお店の名前か、同じ票で決まらなかったか
import type { Outcome } from '../outcome'
import { SHOPS } from '../shops'
import { Heading } from '../ui/parts'

export function ResultHeading({ outcome }: { outcome: Outcome }) {
  if (outcome.tie) {
    return (
      <Heading
        first={
          <>
            <u>同じ票</u>で
          </>
        }
        second="決まりませんでした"
      />
    )
  }
  return (
    <Heading
      first={
        <>
          <u>{SHOPS[outcome.decided!].name}</u>に
        </>
      }
      second="決まりました"
    />
  )
}
