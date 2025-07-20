'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [loadingPrice, setLoadingPrice] = useState(true)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [address, setAddress] = useState<null | {
    street: string
    city: string
    region: string
    postalCode: string
  }>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchPrice = async () => {
      setLoadingPrice(true)
      const res = await fetch('/api/price-check', { method: 'POST' })
      const data = await res.json()
      setLoadingPrice(false)

      if (res.ok && data.success) {
        setPrice(data.price)
        setAddress(data.deliveryAddress)
      } else {
        setMessage(`❌ Failed to get price: ${data.error || 'Unknown error'}`)
      }
    }

    fetchPrice()
  }, [])

  const handleOrder = async () => {
    setLoadingOrder(true)
    setMessage('')
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    setLoadingOrder(false)

    if (res.ok && data.success) {
      setMessage('✅ Order placed successfully! Enjoy your pizza 🍕')
    } else {
      setMessage(`❌ Failed to place order: ${data.error || 'Unknown error'}`)
    }
  }

  return (
    <main
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f6f6f6',
        fontFamily: 'sans-serif',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '2rem 3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          color: '#222', // improved text contrast
        }}
      >
        <h1 style={{ marginBottom: 24, color: '#111' }}>🍕 Schleder Pizza Order 🍕</h1>

        {loadingPrice && <p style={{ color: '#333' }}>Checking price...</p>}

        {!loadingPrice && address && price !== null && (
          <>
            <p style={{ marginBottom: 12, color: '#222' }}>
              <strong>Delivery to:</strong><br />
              {address.street}<br />
              {address.city}, {address.region} {address.postalCode}
            </p>

            <p style={{ marginBottom: 24, color: '#222' }}>
              <strong>Total (incl. tax):</strong> ${price.toFixed(2)}
            </p>

            <button
              onClick={handleOrder}
              disabled={loadingOrder}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#006491',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {loadingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </>
        )}

        {message && (
          <p style={{
            marginTop: 24,
            whiteSpace: 'pre-line',
            color: message.includes('✅') ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
