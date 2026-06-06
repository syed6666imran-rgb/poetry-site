// src/lib/models/Note.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface NoteDocument extends Document {
  text: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

const NoteSchema = new Schema<NoteDocument>(
  {
    text: { type: String, required: true, maxlength: 500, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
)

const Note: Model<NoteDocument> =
  mongoose.models.Note ?? mongoose.model<NoteDocument>('Note', NoteSchema)

export default Note
