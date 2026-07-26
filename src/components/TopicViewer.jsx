import { useEffect, useState, Suspense, lazy } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './TopicViewer.css'

const playgrounds = {
  '01-jsx-basics': lazy(() => import('../playgrounds/JsxBasics')),
  '02-components': lazy(() => import('../playgrounds/Components')),
  '03-props': lazy(() => import('../playgrounds/Props')),
  '04-state': lazy(() => import('../playgrounds/StateDemo')),
  '05-effects': lazy(() => import('../playgrounds/Effects')),
  '06-context': lazy(() => import('../playgrounds/ContextDemo')),
  '07-reducers': lazy(() => import('../playgrounds/Reducers')),
  '08-refs': lazy(() => import('../playgrounds/Refs')),
  '09-memo': lazy(() => import('../playgrounds/MemoCallback')),
  '10-custom-hooks': lazy(() => import('../playgrounds/CustomHooks')),
  '11-hoc': lazy(() => import('../playgrounds/Hoc')),
  '12-render-props': lazy(() => import('../playgrounds/RenderProps')),
  '13-error-boundaries': lazy(() => import('../playgrounds/ErrorBoundaries')),
  '14-suspense': lazy(() => import('../playgrounds/SuspenseDemo')),
  '15-portals': lazy(() => import('../playgrounds/Portals')),
  '16-forms': lazy(() => import('../playgrounds/Forms')),
  '17-lists-keys': lazy(() => import('../playgrounds/ListsKeys')),
  '18-events': lazy(() => import('../playgrounds/Events')),
  '19-conditional': lazy(() => import('../playgrounds/ConditionalRendering')),
  '20-composition': lazy(() => import('../playgrounds/Composition')),
  '21-data-fetching': lazy(() => import('../playgrounds/DataFetching')),
  '22-routing': lazy(() => import('../playgrounds/RoutingDemo')),
  '23-performance': lazy(() => import('../playgrounds/Performance')),
}

function LoadingPlaceholder() {
  return <div className="playground-loading">Loading interactive example...</div>
}

export default function TopicViewer({ topics }) {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = topics.find(t => t.id === topicId)
  const [mdContent, setMdContent] = useState('')
  const idx = topics.findIndex(t => t.id === topicId)
  const prevTopic = idx > 0 ? topics[idx - 1] : null
  const nextTopic = idx < topics.length - 1 ? topics[idx + 1] : null
  const Playground = playgrounds[topicId]

  useEffect(() => {
    if (!topic) { navigate('/', { replace: true }); return }
    setMdContent('')
    fetch(`/topics/${topicId}.md`)
      .then(r => r.text())
      .then(setMdContent)
      .catch(() => setMdContent('*Content not found*'))
    window.scrollTo(0, 0)
  }, [topicId, topic, navigate])

  if (!topic) return null

  const renderMarkdown = (text) => {
    const lines = text.split('\n')
    let html = ''
    let inCode = false
    let codeContent = ''
    let codeLang = ''

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCode) {
          html += `<pre><code class="language-${codeLang}">${escapeHtml(codeContent.trim())}</code></pre>\n`
          codeContent = ''
          codeLang = ''
          inCode = false
          continue
        }
        inCode = true
        codeLang = line.slice(3).trim()
        continue
      }
      if (inCode) { codeContent += line + '\n'; continue }
      if (line.startsWith('# ')) html += `<h1>${escapeHtml(line.slice(2))}</h1>\n`
      else if (line.startsWith('## ')) html += `<h2>${escapeHtml(line.slice(3))}</h2>\n`
      else if (line.startsWith('### ')) html += `<h3>${escapeHtml(line.slice(4))}</h3>\n`
      else if (line.startsWith('- ')) html += `<li>${renderInline(line.slice(2))}</li>\n`
      else if (line.startsWith('> ')) html += `<blockquote>${renderInline(line.slice(2))}</blockquote>\n`
      else if (line.trim() === '') html += '<br/>\n'
      else html += `<p>${renderInline(line)}</p>\n`
    }
    return html
  }

  const escapeHtml = (str) => str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const renderInline = (text) => {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  }

  return (
    <div className="topic-viewer">
      <div className="topic-header">
        <div className="topic-meta">
          <span className="topic-category">{topic.category}</span>
          <span className="topic-number">#{String(idx + 1).padStart(2, '0')}</span>
        </div>
        <h1 className="topic-title"><span className="topic-icon">{topic.icon}</span> {topic.title}</h1>
      </div>

      <div className="topic-navigation top-nav">
        {prevTopic && <button className="nav-btn prev" onClick={() => navigate(`/topic/${prevTopic.id}`)}>← {prevTopic.title}</button>}
        <span></span>
        {nextTopic && <button className="nav-btn next" onClick={() => navigate(`/topic/${nextTopic.id}`)}>{nextTopic.title} →</button>}
      </div>

      <article className="md-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(mdContent) }} />

      {Playground && (
        <section className="playground-section">
          <h2 className="playground-title">▶ Live Playground</h2>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Playground />
          </Suspense>
        </section>
      )}

      <div className="topic-navigation bottom-nav">
        {prevTopic && <button className="nav-btn prev" onClick={() => navigate(`/topic/${prevTopic.id}`)}>← {prevTopic.title}</button>}
        <span></span>
        {nextTopic && <button className="nav-btn next" onClick={() => navigate(`/topic/${nextTopic.id}`)}>{nextTopic.title} →</button>}
      </div>
    </div>
  )
}
