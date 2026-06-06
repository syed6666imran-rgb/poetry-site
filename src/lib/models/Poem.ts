// src/lib/models/Poem.ts
import mongoose, { Schema, Document, Model } from 'mongoose'
import type { PoemCategory } from '@/types'

export interface PoemDocument extends Document {
  title: string
  category: PoemCategory
  lines: string[]
  excerpt: string
  isFeatured: boolean
  isPrivate: boolean
  readingTime: number
  views: number
  favourites: number
  createdAt: Date
  updatedAt: Date
}

const PoemSchema = new Schema<PoemDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Love', 'Longing', 'Happiness', 'Missing You', 'Dreams', 'Forever'],
    },
    lines: [{ type: String }],
    excerpt: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    favourites: { type: Number, default: 0 },
  },
  { timestamps: true }
)

PoemSchema.index({ category: 1 })
PoemSchema.index({ isFeatured: 1 })
PoemSchema.index({ createdAt: -1 })

const Poem: Model<PoemDocument> =
  mongoose.models.Poem ?? mongoose.model<PoemDocument>('Poem', PoemSchema)

export default Poem
