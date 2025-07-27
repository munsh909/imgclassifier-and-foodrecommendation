import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Components/Auth'
import Account from './Pages/Account'
import MainApp from './MainApp'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ minHeight: '100vh', padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <MainApp session={ session } />}
    </div>
  )
}

export default App