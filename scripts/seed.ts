// scripts/seed.ts
// Run with: npm run seed
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'changeme'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

const PoemSchema = new mongoose.Schema({
  title: String, category: String, lines: [String],
  excerpt: String, isFeatured: Boolean, isPrivate: Boolean,
  readingTime: Number, views: { type: Number, default: 0 },
  favourites: { type: Number, default: 0 },
}, { timestamps: true })

const Admin = mongoose.models.Admin ?? mongoose.model('Admin', AdminSchema)
const Poem = mongoose.models.Poem ?? mongoose.model('Poem', PoemSchema)

const SEED_POEMS = [
  {
    title: 'The Architecture of Your Smile',
    category: 'Forever',
    isFeatured: true,
    isPrivate: false,
    lines: [
      'I have memorized the geography of your face',
      'the way cartographers memorize continents—',
      'with reverence, and a fear of ever forgetting.',
      '',
      'Your smile is a country I discovered',
      'in the middle of an ordinary Tuesday,',
      'and I have been an immigrant there ever since.',
      '',
      'Tell me — do you know what you did',
      'to the ordinary calendar of my days',
      'the moment you became the season?',
      '',
      'You are not just someone I love.',
      'You are the reason I learned',
      'what the word meant.',
    ],
  },
  {
    title: 'What the Rain Remembered',
    category: 'Longing',
    isFeatured: false,
    isPrivate: false,
    lines: [
      'Even the rain knows to fall slowly',
      'when it reaches the window',
      'you used to stand at.',
      '',
      'There is a particular kind of silence',
      'that lives in the shape of your absence—',
      'not empty, but full',
      'of everything you left behind.',
      '',
      'I water the plant you forgot',
      'and think about how growing',
      'is also a form of waiting.',
    ],
  },
  {
    title: 'First Morning',
    category: 'Love',
    isFeatured: false,
    isPrivate: false,
    lines: [
      'You are the kind of morning',
      'that makes a person forget',
      'every complicated thing they ever believed',
      'about the world.',
      '',
      'Golden. Uncomplicated. Unannounced.',
      '',
      'I did not know I had been waiting for you',
      'until I was not waiting anymore.',
      '',
      'Now I make coffee for two',
      'and smile at nothing',
      'and everything',
      'and you.',
    ],
  },
  {
    title: 'Missing You Is a Whole Language',
    category: 'Missing You',
    isFeatured: false,
    isPrivate: false,
    lines: [
      'I have learned to speak fluently',
      'in the grammar of your absence.',
      '',
      'Noun: the shirt you left.',
      'Verb: reaching for you in the dark.',
      'Adjective: every colour, slightly less.',
      '',
      'I did not ask to become fluent.',
      'But here I am—',
      'composing whole paragraphs',
      'from the silence you left',
      'where you used to be.',
    ],
  },
  {
    title: 'For You Only',
    category: 'Love',
    isFeatured: false,
    isPrivate: true,
    lines: [
      'This was always meant for you.',
      '',
      'In every syllable I ever wrote,',
      'in every line break and every pause,',
      'I was practicing how to say your name',
      'without trembling.',
      '',
      'I never quite managed.',
      '',
      'I never wanted to.',
    ],
  },
]

async function seed() {
  console.log('🌹 Connecting to MongoDB…')
  await mongoose.connect(MONGODB_URI)
  console.log('✓ Connected')

  // Admin
  const existing = await Admin.findOne({ email: ADMIN_EMAIL })
  if (!existing) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await Admin.create({ email: ADMIN_EMAIL, passwordHash })
    console.log(`✓ Admin created: ${ADMIN_EMAIL}`)
  } else {
    console.log(`ℹ  Admin already exists: ${ADMIN_EMAIL}`)
  }

  // Poems
  const poemCount = await Poem.countDocuments()
  if (poemCount === 0) {
    for (const p of SEED_POEMS) {
      const wordCount = p.lines.join(' ').split(/\s+/).filter(Boolean).length
      const text = p.lines.filter(Boolean).join(' ')
      await Poem.create({
        ...p,
        excerpt: text.slice(0, 120) + (text.length > 120 ? '…' : ''),
        readingTime: Math.max(1, Math.ceil(wordCount / 200)),
      })
    }
    console.log(`✓ ${SEED_POEMS.length} poems seeded`)
  } else {
    console.log(`ℹ  Poems already exist (${poemCount}), skipping`)
  }

  await mongoose.disconnect()
  console.log('🌹 Done!')
}

seed().catch(err => { console.error(err); process.exit(1) })
