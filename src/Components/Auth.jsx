import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#000' }}>
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#121914', color: '#fff', borderColor: '#14532d' }}>
        <h1 className="mb-3 text-center" style={{ color: '#a5d6a7' }}>Supabase + React</h1>
        <p className="mb-4 text-center">Sign in via magic link with your email below</p>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: '#1e2a1e', color: '#fff', borderColor: '#14532d' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
            style={{ backgroundColor: '#14532d', borderColor: '#14532d' }}
          >
            {loading ? 'Loading...' : 'Send magic link'}
          </button>
        </form>
      </div>
    </div>
  )
}