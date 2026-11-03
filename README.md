# 幹事アプリ デモ（多くの意見が反映される多数決）

飲み会の幹事アプリの中に「多くの意見が反映される多数決」（Ranked Choice Voting）を入れたデモです。行きたい順に投票して、より多くの人が行きたいお店に決まります。

デモ: https://kanji.yulab.me/

## 画面

| 入口 | 誰が見るか | 中身 |
| --- | --- | --- |
| `index.html` | 幹事 | ホーム → 決め方を選ぶ → 参加者に送るメッセージ → 結果 |
| `vote.html` | 参加者 | 送られたリンクを開くと、すぐお店を選べる。幹事の画面には行かない |

幹事と参加者は同じブラウザの localStorage でつながっています。参加者が投票すると、幹事のタブに結果が出ます。

あなたの票のほかに 8 人分のサンプルの票があり、合わせて 9 人の投票として数えます。

## 動かす

Node.js 20 以上。

```sh
npm install
npm run dev        # http://localhost:5173/ が幹事、/vote.html が参加者
npm test           # 集計のテスト（Vitest）
npm run build      # dist/ に書き出す
npm run preview    # 書き出したものを確かめる
npm run deploy     # Cloudflare Workers に置く
```

同じ Wi-Fi のスマホから見るときは `npm run dev -- --host`（または `npm run preview -- --host`）で、表示された IP のアドレスを開きます。

`dist/` は相対パスで書き出しているので、静的なホストのどの階層に置いてもそのまま動きます。

## 構成

```
index.html, vote.html   入口（Vite のマルチページ）
worker.js               Cloudflare Workers。書き出したファイルを配り、動画だけ部分読み込み（Range）に答える
src/
  kanji/                幹事の画面
  vote/                 参加者の画面
  shared/
    shops.ts            お店・日程・サンプルの票
    store.ts            localStorage の読み書き
    outcome.ts          票を数えて結果にまとめる
    navigation.ts       画面の移動（history）
    modal/              お店の詳細と、決め方の説明（動画）のポップアップ
    result/             結果の表と、票が移る動き
    ui/                 画面の上の帯、見出し、印など、どの画面でも使う小さな部品
  tally/
    tally.ts            行きたい順の集計（画面に依存しない）
    tally.test.ts
  style.css
  assets/               写真と動画
```

### 集計の決まり（`src/tally/tally.ts`）

- 1番の票を数え、残っている票の過半数を取ったお店があればそこで決まる
- なければ、いちばん少ないお店を外し、その票を次に行きたいお店に移す
- 最下位が同点なら、前の段階の票数までさかのぼって少ないほうを外す。最初の段階まで同じなら、くじ（seed から決めるので、何回数えても同じ結果）
- 行き先がなくなった票（順位切れ）は、その後は数えない

集計の決まりと色は、[みんなのRCV](https://github.com/team-mirai/minna-no-rcv-oss)に合わせています。コードは使っていません。
