import { createRoot } from 'react-dom/client'
import '../style.css'
import { VoteApp } from './VoteApp'

createRoot(document.getElementById('app')!).render(<VoteApp />)
