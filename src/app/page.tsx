// src/app/page.tsx
import { Suspense } from 'react'
import { connectDB } from '@/lib/mongodb'
import Poem from '@/lib/models/Poem'
import Note from '@/lib/models/Note'
import Photo from '@/lib/models/Photo'
import HeroSection from '@/components/poems/HeroSection'
import QuoteSection from '@/components/poems/QuoteSection'
import FeaturedPoem from '@/components/poems/FeaturedPoem'
import PoetryLibrary from '@/components/poems/PoetryLibrary'
import StoryTimeline from '@/components/poems/StoryTimeline'
import LoveNotes from '@/components/poems/LoveNotes'
import PhotoGallery from '@/components/poems/PhotoGallery'
import SiteFooter from '@/components/ui/SiteFooter'
import MusicPlayer from '@/components/ui/MusicPlayer'
import SiteNav from '@/components/ui/SiteNav'
import FloatingEffects from '@/components/effects/FloatingEffects'
import EnvelopeIntro from '@/components/effects/EnvelopeIntro'
import type { IPoem, INote, IPhoto } from '@/types'

async function getHomeData() {
  await connectDB()
  const [featuredPoem, poems, notes, photos] = await Promise.all([
    Poem.findOne({ isFeatured: true, isPrivate: false }).lean(),
    Poem.find({ isPrivate: false }).sort({ createdAt: -1 }).limit(12).lean(),
    Note.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(9).lean(),
    Photo.find().sort({ createdAt: -1 }).limit(12).lean(),
  ])
  return { featuredPoem, poems, notes, photos }
}

export default async function HomePage() {
  const { featuredPoem, poems, notes, photos } = await getHomeData()

  return (
    <>
      <EnvelopeIntro />
      <FloatingEffects />
      <SiteNav />
      <main>
        <HeroSection />
        <QuoteSection />
        {featuredPoem && (
          <FeaturedPoem poem={featuredPoem as unknown as IPoem} />
        )}
        <PoetryLibrary initialPoems={poems as unknown as IPoem[]} />
        <StoryTimeline />
        <LoveNotes initialNotes={notes as unknown as INote[]} />
        {photos.length > 0 && (
          <PhotoGallery photos={photos as unknown as IPhoto[]} />
        )}
      </main>
      <SiteFooter />
      <MusicPlayer />
    </>
  )
}
