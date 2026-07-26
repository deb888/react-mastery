import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import TopicViewer from './components/TopicViewer'
import topics from './topics'

export default function App() {
  return (
    <Layout topics={topics}>
      <Routes>
        <Route path="/" element={<Navigate to={`/topic/${topics[0].id}`} replace />} />
        <Route path="/topic/:topicId" element={<TopicViewer topics={topics} />} />
      </Routes>
    </Layout>
  )
}
