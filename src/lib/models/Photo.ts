// src/lib/models/Photo.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface PhotoDocument extends Document {
  url: string
  publicId: string
  caption?: string
  width: number
  height: number
  createdAt: Date
}

const PhotoSchema = new Schema<PhotoDocument>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, trim: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { timestamps: true }
)

const Photo: Model<PhotoDocument> =
  mongoose.models.Photo ?? mongoose.model<PhotoDocument>('Photo', PhotoSchema)

export default Photo
