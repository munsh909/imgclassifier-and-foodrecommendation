import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) alert(error.message)
    if (!session) alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={{...styles.verticallySpaced, ...styles.mt20}}>
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email@address.com"
        />
      </div>
      <div style={styles.verticallySpaced}>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
        />
      </div>
      <div style={{...styles.verticallySpaced, ...styles.mt20}}>
        <button disabled={loading} onClick={() => signInWithEmail()}>
          Sign in
        </button>
      </div>
      <div style={styles.verticallySpaced}>
        <button disabled={loading} onClick={() => signUpWithEmail()}>
          Sign up
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
}