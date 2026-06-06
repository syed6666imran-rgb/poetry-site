// src/app/api/poems/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Poem from '@/lib/models/Poem'
import { getAdminFromRequest } from '@/lib/auth'
import { calculateReadingTime, generateExcerpt } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '12')
    const featured = searchParams.get('featured')
    const isAdmin = !!getAdminFromRequest(req)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {}
    if (!isAdmin) query.isPrivate = false
    if (category && category !== 'All') query.category = category
    if (featured === 'true') query.isFeatured = true
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ]
    }

    const total = await Poem.countDocuments(query)
    const poems = await Poem.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: {
        items: poems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('[POEMS GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const body = await req.json()
    const { title, category, lines, isFeatured, isPrivate } = body

    if (!title || !category || !lines?.length) {
      return NextResponse.json({ error: 'title, category and lines are required' }, { status: 400 })
    }

    // Only one poem can be featured
    if (isFeatured) {
      await Poem.updateMany({ isFeatured: true }, { isFeatured: false })
    }

    const poem = await Poem.create({
      title,
      category,
      lines,
      excerpt: generateExcerpt(lines),
      isFeatured: isFeatured ?? false,
      isPrivate: isPrivate ?? false,
      readingTime: calculateReadingTime(lines),
    })

    return NextResponse.json({ success: true, data: poem }, { status: 201 })
  } catch (err) {
    console.error('[POEMS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
