// 書き出したファイルをそのまま配る。
// 動画だけ、iPhone の Safari が再生に使う部分読み込み（Range）に答える。
export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request)
    const range = request.headers.get('Range')
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!m || res.status !== 200) return res

    // 動画をまるごとメモリに読む（1.1MB ほどなので問題ない）
    const body = await res.arrayBuffer()
    const size = body.byteLength
    let start
    let end
    if (m[1] === '') {
      start = Math.max(0, size - Number(m[2]))
      end = size - 1
    } else {
      start = Number(m[1])
      end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1)
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
    }

    const headers = new Headers(res.headers)
    headers.set('Accept-Ranges', 'bytes')
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
    headers.set('Content-Length', String(end - start + 1))
    return new Response(body.slice(start, end + 1), { status: 206, headers })
  },
}
