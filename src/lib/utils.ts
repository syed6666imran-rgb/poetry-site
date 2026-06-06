// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  // Simple className merge without clsx dependency
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function calculateReadingTime(lines: string[]): number {
  const wordCount = lines.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export function generateExcerpt(lines: string[], maxChars = 120): string {
  const text = lines.filter(Boolean).join(' ')
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).trim() + '…'
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const POEM_CATEGORIES = [
  'Love',
  'Longing',
  'Happiness',
  'Missing You',
  'Dreams',
  'Forever',
] as const

export const DAILY_QUOTES = [
  'To love is to recognize yourself in another.',
  'I love you not only for what you are, but for what I am when I am with you.',
  'You are my today and all of my tomorrows.',
  'In you, I found the home I did not know I was looking for.',
  'Every love story is beautiful, but ours is my favourite.',
  'You are the poem I never knew how to write.',
  'My heart talks about nothing but you.',
  'Whatever our souls are made of, yours and mine are the same.',
] as const
