// src/app/api/photos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Photo from '@/lib/models/Photo'
import { getAdminFromRequest } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function GET() {
  try {
    await connectDB()
    const photos = await Photo.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: photos })
  } catch (err) {
    console.error('[PHOTOS GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const caption = formData.get('caption') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const { url, publicId, width, height } = await uploadImage(buffer)

    const photo = await Photo.create({ url, publicId, width, height, caption: caption ?? '' })
    return NextResponse.json({ success: true, data: photo }, { status: 201 })
  } catch (err) {
    console.error('[PHOTOS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
