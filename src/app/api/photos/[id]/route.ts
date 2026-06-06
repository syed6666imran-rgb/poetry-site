// src/app/api/photos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Photo from '@/lib/models/Photo'
import { getAdminFromRequest } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await params
    const photo = await Photo.findById(id)
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await deleteImage(photo.publicId)
    await Photo.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: 'Photo deleted' })
  } catch (err) {
    console.error('[PHOTO DELETE]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { id } = await params
    const { caption } = await req.json()
    const photo = await Photo.findByIdAndUpdate(id, { caption }, { new: true })
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: photo })
  } catch (err) {
    console.error('[PHOTO PATCH]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
