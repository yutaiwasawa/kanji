import { createRoot } from 'react-dom/client'
import '../style.css'
import { KanjiApp } from './KanjiApp'

createRoot(document.getElementById('app')!).render(<KanjiApp />)
