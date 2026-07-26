import { useNavigate, useLocation } from 'react-router-dom'
import { categories } from '../topics'
import './Sidebar.css'

export default function Sidebar({ topics, isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Topics</h2>
          <span className="topic-count">{topics.length} lessons</span>
        </div>
        <nav className="sidebar-nav">
          {categories.map(cat => (
            <div key={cat} className="nav-category">
              <h3 className="category-title">{cat}</h3>
              {topics.filter(t => t.category === cat).map(topic => (
                <button
                  key={topic.id}
                  className={`nav-item ${location.pathname === `/topic/${topic.id}` ? 'active' : ''}`}
                  onClick={() => { navigate(`/topic/${topic.id}`); onClose() }}
                >
                  <span className="nav-icon">{topic.icon}</span>
                  <span className="nav-label">{topic.title}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
