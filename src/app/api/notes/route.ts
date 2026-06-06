// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Note from '@/lib/models/Note'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const admin = getAdminFromRequest(req)
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    // Public only sees approved notes; admin sees all
    const query = admin
      ? status ? { status } : {}
      : { status: 'approved' }

    const notes = await Note.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: notes })
  } catch (err) {
    console.error('[NOTES GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { text } = await req.json()
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Note text required' }, { status: 400 })
    }
    if (text.length > 500) {
      return NextResponse.json({ error: 'Note too long (max 500 chars)' }, { status: 400 })
    }

    const note = await Note.create({ text: text.trim() })
    return NextResponse.json({ success: true, data: note, message: 'Note submitted for review' }, { status: 201 })
  } catch (err) {
    console.error('[NOTES POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
