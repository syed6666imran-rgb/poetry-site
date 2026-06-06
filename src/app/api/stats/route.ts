// src/app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Poem from '@/lib/models/Poem'
import Note from '@/lib/models/Note'
import Photo from '@/lib/models/Photo'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()

    const [
      totalPoems,
      totalNotes,
      pendingNotes,
      totalPhotos,
      viewsAgg,
      favsAgg,
      recentPoems,
      categoryAgg,
    ] = await Promise.all([
      Poem.countDocuments(),
      Note.countDocuments(),
      Note.countDocuments({ status: 'pending' }),
      Photo.countDocuments(),
      Poem.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Poem.aggregate([{ $group: { _id: null, total: { $sum: '$favourites' } } }]),
      Poem.find().sort({ createdAt: -1 }).limit(5).lean(),
      Poem.aggregate([
        { $group: { _id: '$category', views: { $sum: '$views' } } },
        { $project: { _id: 0, category: '$_id', views: 1 } },
        { $sort: { views: -1 } },
      ]),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalPoems,
        totalNotes,
        pendingNotes,
        totalPhotos,
        totalViews: viewsAgg[0]?.total ?? 0,
        totalFavourites: favsAgg[0]?.total ?? 0,
        recentPoems,
        viewsByCategory: categoryAgg,
      },
    })
  } catch (err) {
    console.error('[STATS GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
