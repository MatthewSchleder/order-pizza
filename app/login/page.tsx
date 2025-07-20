'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      setError('Invalid password')
    }
  }

  return (
    <main
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f6f6f6',
        fontFamily: 'sans-serif',
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem 3rem',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          width: '100%',
          maxWidth: 400,
          color: '#222',
        }}
      >
        <h1 style={{ marginBottom: 24, color: '#111' }}>🔐 Login</h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: 16,
            borderRadius: 6,
            border: '1px solid #ccc',
            marginBottom: 16,
          }}
        />

        <button
          type="submit"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#006491',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Log In
        </button>

        {error && (
          <p style={{ marginTop: 16, color: 'red', fontWeight: 'bold' }}>
            {error}
          </p>
        )}
      </form>
    </main>
  )
}
