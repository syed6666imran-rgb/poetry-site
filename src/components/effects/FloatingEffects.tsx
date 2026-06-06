'use client'
// src/components/effects/FloatingEffects.tsx
import { useEffect } from 'react'

export default function FloatingEffects() {
  useEffect(() => {
    // Create petals
    const container = document.getElementById('petals-root')
    if (container) {
      for (let i = 0; i < 10; i++) {
        const p = document.createElement('div')
        p.className = 'petal'
        p.style.left = `${Math.random() * 100}%`
        p.style.animationDuration = `${6 + Math.random() * 8}s`
        p.style.animationDelay = `${Math.random() * 12}s`
        p.style.transform = `rotate(${Math.random() * 360}deg)`
        container.appendChild(p)
      }
    }

    // Sparkle cursor
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.88) {
        const spark = document.createElement('div')
        spark.style.cssText = `
          position:fixed;left:${e.clientX}px;top:${e.clientY}px;
          width:4px;height:4px;background:#E6C068;border-radius:50%;
          pointer-events:none;z-index:9997;
          transform:translate(-50%,-50%);
          animation:sparkFade 0.6s ease forwards;
        `
        document.body.appendChild(spark)
        setTimeout(() => spark.remove(), 620)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <div id="petals-root" className="fixed inset-0 pointer-events-none z-[1]" />
    </>
  )
}
