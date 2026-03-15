import { useState, useRef, useCallback } from 'react'

const BRANDING = '\n\n✍️ Formatted using AnshuPostCraft'

// ─── Formatting engine ────────────────────────────────────────────────────────
function formatPost(raw) {
  if (!raw.trim()) return ''
  const cleaned = raw.split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
  const sentenceRaw = cleaned.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean)
  const sentences = sentenceRaw.map((s) =>
    s.replace(/^[-–—•]\s+/, '').replace(/^\d+\.\s+/, '')
  )
  if (sentences.length === 0) return ''

  const blocks = []
  blocks.push(sentences[0])
  blocks.push('')

  const body = sentences.slice(1)
  const isListLike = (s) => s.length < 80 && !s.includes(' because ') && !s.includes(' so ')

  let i = 0
  while (i < body.length) {
    const s = body[i]
    if (isListLike(s) && i + 1 < body.length && isListLike(body[i + 1])) {
      const listRun = []
      while (i < body.length && isListLike(body[i])) {
        listRun.push('→ ' + body[i])
        i++
      }
      blocks.push(...listRun)
      blocks.push('')
    } else {
      blocks.push(s)
      blocks.push('')
      i++
    }
  }

  const result = []
  let blankCount = 0
  for (const line of blocks) {
    if (line === '') { blankCount++; if (blankCount <= 1) result.push('') }
    else { blankCount = 0; result.push(line) }
  }
  while (result[result.length - 1] === '') result.pop()
  return result.join('\n') + BRANDING
}

// ─── Parse inline markers into React nodes ────────────────────────────────────
function parseInline(text) {
  // Order matters: bold-italic first, then bold, then italic, then highlight
  const tokens = []
  const regex = /(\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|_([^_]+)_|==([^=]+)==)/g
  let last = 0, m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: 'text', val: text.slice(last, m.index) })
    if (m[2]) tokens.push({ type: 'bolditalic', val: m[2] })
    else if (m[3]) tokens.push({ type: 'bold', val: m[3] })
    else if (m[4]) tokens.push({ type: 'italic', val: m[4] })
    else if (m[5]) tokens.push({ type: 'highlight', val: m[5] })
    last = m.index + m[0].length
  }
  if (last < text.length) tokens.push({ type: 'text', val: text.slice(last) })
  return tokens.map((t, i) => {
    if (t.type === 'bold') return <strong key={i} className="font-bold">{t.val}</strong>
    if (t.type === 'italic') return <em key={i} className="italic">{t.val}</em>
    if (t.type === 'bolditalic') return <strong key={i}><em>{t.val}</em></strong>
    if (t.type === 'highlight') return <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{t.val}</mark>
    return t.val
  })
}

// ─── Render preview lines ─────────────────────────────────────────────────────
function renderPreview(text) {
  const lines = text.split('\n')
  let firstContent = true
  return lines.map((line, i) => {
    if (line === '') return <div key={i} className="h-3" />
    const isArrow = line.startsWith('→ ')
    const content = isArrow ? line.slice(2) : line
    const isHook = firstContent
    if (firstContent && line !== '') firstContent = false

    if (isArrow) {
      return (
        <div key={i} className="flex items-start gap-2 my-0.5 text-[15px] text-gray-800">
          <span className="text-linkedin-blue font-bold shrink-0 mt-0.5">→</span>
          <span>{parseInline(content)}</span>
        </div>
      )
    }
    return (
      <p key={i} className={`my-0 leading-snug ${isHook ? 'text-[15px] font-semibold text-gray-900' : 'text-[15px] text-gray-800'}`}>
        {parseInline(line)}
      </p>
    )
  })
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({ onClick, title, children, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors
        ${active ? 'bg-linkedin-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Formatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const textareaRef = useRef(null)

  // Wrap selected text with a marker
  function wrap(before, after) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = input.slice(start, end)
    if (!selected) return
    const next = input.slice(0, start) + before + selected + after + input.slice(end)
    setInput(next)
    // Restore selection after state update
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, end + before.length)
    })
  }

  // Insert text at cursor
  function insertAt(text) {
    const ta = textareaRef.current
    if (!ta) return
    const pos = ta.selectionStart
    const next = input.slice(0, pos) + text + input.slice(pos)
    setInput(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(pos + text.length, pos + text.length)
    })
  }

  function handleFormat() { setOutput(formatPost(input)) }

  const handleCopy = useCallback(() => {
    if (!output) return
    // Strip all markers for plain text
    const plain = output
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/==([^=]+)==/g, '$1')
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [output])

  function handleDownload() {
    if (!output) return
    const plain = output
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/==([^=]+)==/g, '$1')
    const blob = new Blob([plain], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'linkedin-post.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Post Formatter</h1>
        <p className="text-gray-500 text-sm">Paste your raw thoughts. Format like a ghost-writer. Preview like LinkedIn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── LEFT: Editor ── */}
        <div className="flex flex-col gap-0 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
            <ToolBtn onClick={() => wrap('**', '**')} title="Bold (select text first)">
              <span className="font-bold text-base">B</span>
            </ToolBtn>
            <ToolBtn onClick={() => wrap('_', '_')} title="Italic (select text first)">
              <span className="italic text-base">I</span>
            </ToolBtn>
            <ToolBtn onClick={() => wrap('***', '***')} title="Bold + Italic">
              <span className="font-bold italic text-base">BI</span>
            </ToolBtn>
            <ToolBtn onClick={() => wrap('==', '==')} title="Highlight (select text first)">
              <span className="bg-yellow-200 px-0.5 rounded text-xs font-semibold">H</span>
            </ToolBtn>

            <div className="w-px h-5 bg-gray-300 mx-1" />

            <ToolBtn onClick={() => insertAt('\n→ ')} title="Insert arrow bullet">
              <span className="text-linkedin-blue font-bold text-sm">→</span>
            </ToolBtn>
            <ToolBtn onClick={() => insertAt('\n• ')} title="Insert bullet point">
              <span className="text-base">•</span>
            </ToolBtn>
            <ToolBtn onClick={() => insertAt('\n\n')} title="Add line break">
              <span className="text-xs font-mono">↵</span>
            </ToolBtn>

            <div className="w-px h-5 bg-gray-300 mx-1" />

            <ToolBtn onClick={() => insertAt('#️⃣ ')} title="Add hashtag prefix">
              <span className="text-xs font-bold">#</span>
            </ToolBtn>
            <ToolBtn onClick={() => insertAt('💡 ')} title="Insight emoji">💡</ToolBtn>
            <ToolBtn onClick={() => insertAt('🔑 ')} title="Key point emoji">🔑</ToolBtn>
            <ToolBtn onClick={() => insertAt('🚀 ')} title="Growth emoji">🚀</ToolBtn>

            <div className="flex-1" />
            <span className="text-xs text-gray-400">{input.length} chars</span>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your raw LinkedIn post here.\n\nExample:\nToday I learned something about networking. People think networking means asking for jobs but actually it means building relationships. I used to cold message 10 people a day. Nothing worked. Then I started giving value first. Everything changed.`}
            className="w-full h-80 p-4 text-sm text-gray-800 resize-none focus:outline-none leading-relaxed bg-white font-mono"
          />

          {/* Format button */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">Select text, then use toolbar to format</p>
            <button
              onClick={handleFormat}
              disabled={!input.trim()}
              className="bg-linkedin-blue text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-linkedin-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
            >
              ✦ Format My Post
            </button>
          </div>
        </div>

        {/* ── RIGHT: LinkedIn Preview ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">LinkedIn Preview</label>
            {output && <span className="text-xs text-green-600 font-medium">✓ Ready to post</span>}
          </div>

          {/* LinkedIn post card — pixel-accurate */}
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm font-sans">

            {/* Top bar */}
            <div className="flex items-start justify-between px-4 pt-4 pb-2">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-linkedin-blue to-linkedin-dark flex items-center justify-center text-white font-bold text-lg shrink-0">
                  A
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900 leading-tight">Anshuman Mishra</p>
                  <p className="text-[12px] text-gray-500 leading-tight">LinkedIn Creator · Content Strategist</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="text-[11px] text-gray-400">Just now ·</p>
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5A6.5 6.5 0 118 1.5a6.5 6.5 0 010 13z"/>
                      <path d="M8 3.5a.75.75 0 01.75.75v3.69l2.28 2.28a.75.75 0 11-1.06 1.06l-2.5-2.5A.75.75 0 017.25 8V4.25A.75.75 0 018 3.5z"/>
                    </svg>
                  </div>
                </div>
              </div>
              {/* Follow button */}
              <button className="text-linkedin-blue text-[13px] font-semibold border border-linkedin-blue rounded-full px-3 py-0.5 hover:bg-linkedin-light transition-colors">
                + Follow
              </button>
            </div>

            {/* Post content */}
            <div className="px-4 pb-2 text-[15px] leading-[1.6] text-gray-800">
              {output ? (
                <div>
                  {/* Show/hide logic like real LinkedIn */}
                  <div className={expanded ? '' : 'line-clamp-[8]'}>
                    {renderPreview(output)}
                  </div>
                  {!expanded && output.split('\n').length > 8 && (
                    <button
                      onClick={() => setExpanded(true)}
                      className="text-gray-500 font-semibold text-[14px] hover:underline mt-1"
                    >
                      …see more
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-4">Your formatted post will appear here...</p>
              )}
            </div>

            {/* Reaction bar */}
            <div className="px-4 py-1 flex items-center justify-between border-t border-gray-100 mt-1">
              <div className="flex items-center gap-1">
                <span className="text-base">👍</span><span className="text-base">❤️</span><span className="text-base">🎉</span>
                <span className="text-[12px] text-gray-500 ml-1">247</span>
              </div>
              <span className="text-[12px] text-gray-400">18 comments · 5 reposts</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-around px-2 py-1 border-t border-gray-100">
              {[
                { icon: '👍', label: 'Like' },
                { icon: '💬', label: 'Comment' },
                { icon: '🔁', label: 'Repost' },
                { icon: '📤', label: 'Send' },
              ].map((a) => (
                <button key={a.label} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                  <span className="text-base">{a.icon}</span>
                  <span className="text-[13px] font-medium hidden sm:block">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Output controls */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex-1 border border-linkedin-blue text-linkedin-blue text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-linkedin-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!output}
              className="flex-1 bg-linkedin-blue text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-linkedin-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Download Post
            </button>
          </div>
        </div>
      </div>

      {/* Improve Hook teaser */}
      <div className="mt-10 border border-dashed border-linkedin-blue/40 rounded-2xl p-6 bg-linkedin-light/30 text-center">
        <span className="inline-block bg-linkedin-blue/10 text-linkedin-blue text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">Coming Soon</span>
        <p className="text-gray-700 font-semibold mb-1">✨ Improve Hook</p>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">Rewrites your opening line into something people can't scroll past.</p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <span className="text-gray-400 italic">"Networking is important."</span>
          <span className="text-gray-300 hidden sm:block">→</span>
          <span className="text-linkedin-blue font-semibold">"Networking changed my career. But not the way people think."</span>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-gray-400">✍️ Formatted using AnshuPostCraft</footer>
    </main>
  )
}
