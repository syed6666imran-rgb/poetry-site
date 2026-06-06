// src/app/api/poems/[id]/favourite/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Poem from '@/lib/models/Poem'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const poem = await Poem.findByIdAndUpdate(id, { $inc: { favourites: 1 } }, { new: true })
    if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, favourites: poem.favourites })
  } catch (err) {
    console.error('[POEM FAVOURITE]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
