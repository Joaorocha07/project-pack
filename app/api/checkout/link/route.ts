import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BACKEND_API_URL = (process.env.BACKEND_API_URL ?? 'https://pack-do-criador-back-end-production.up.railway.app').replace(/\/$/, '')
const CHECKOUT_LINK_ENDPOINT = `${BACKEND_API_URL}/checkout/link`

export async function GET() {
  try {
    const response = await fetch(CHECKOUT_LINK_ENDPOINT, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Nao foi possivel buscar o link de checkout.' },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data?.url || typeof data.url !== 'string') {
      return NextResponse.json(
        { error: 'Link de checkout invalido.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { url: data.url },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Nao foi possivel buscar o link de checkout.' },
      { status: 500 }
    )
  }
}
