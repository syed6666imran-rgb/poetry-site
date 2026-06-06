// src/app/api/poems/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Poem from '@/lib/models/Poem'
import { getAdminFromRequest } from '@/lib/auth'
import { calculateReadingTime, generateExcerpt } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const admin = getAdminFromRequest(req)
    const poem = await Poem.findById(id).lean()

    if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (poem.isPrivate && !admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Increment views
    await Poem.findByIdAndUpdate(id, { $inc: { views: 1 } })

    return NextResponse.json({ success: true, data: poem })
  } catch (err) {
    console.error('[POEM GET ID]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    if (body.lines) {
      body.excerpt = generateExcerpt(body.lines)
      body.readingTime = calculateReadingTime(body.lines)
    }

    if (body.isFeatured) {
      await Poem.updateMany({ _id: { $ne: id }, isFeatured: true }, { isFeatured: false })
    }

    const poem = await Poem.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: poem })
  } catch (err) {
    console.error('[POEM PATCH]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await params
    await Poem.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Poem deleted' })
  } catch (err) {
    console.error('[POEM DELETE]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
