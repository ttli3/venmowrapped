import { NextResponse } from 'next/server'
import { analyzeVenmoStatement } from '@/app/utils/analysis'
import { decodeData } from '@/app/utils/encryption'

export const runtime = 'edge'

// In-memory store for development
const DEV_STORE = new Map<string, any>()

const generateId = () => Math.random().toString(36).substring(2, 15)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file uploaded')
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Please upload a CSV file')
    }
    
    let csvContent = await file.text()
    
    // Try to decode if it's encoded
    try {
      csvContent = decodeData(csvContent)
    } catch (e) {
      // If decoding fails, assume it wasn't encoded
      console.log('Content not encoded, using raw content')
    }
    
    const lines = csvContent.split('\n')
    console.log('CSV Lines:', lines.length)
    console.log('First 3 lines:', lines.slice(0, 3))
    
    const insights = await analyzeVenmoStatement(csvContent)
    console.log('Analysis complete')
    
    const id = generateId()

    // Store insights in dev store
    DEV_STORE.set(`insights:${id}`, insights)
    setTimeout(() => DEV_STORE.delete(`insights:${id}`), 24 * 60 * 60 * 1000)
    console.log('Stored in DEV_STORE')
    
    return NextResponse.json({ id, insights })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze CSV' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      throw new Error('No ID provided')
    }
    
    const insights = DEV_STORE.get(`insights:${id}`)
    
    if (!insights) {
      throw new Error('No insights found for this ID')
    }
    
    return NextResponse.json(insights)
  } catch (error) {
    console.error('Retrieval error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve insights' },
      { status: 500 }
    )
  }
}
