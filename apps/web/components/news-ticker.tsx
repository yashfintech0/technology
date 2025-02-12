"use client"

import { useEffect, useState } from "react"

const news = [
  "Stay ahead with the latest business insights: comprehensive analysis, real-time updates on breaking news, and in-depth coverage of current market trends...",
  "Global markets respond to latest economic data as investors watch key indicators...",
  "Technology sector sees major breakthroughs in artificial intelligence development...",
]

export function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-black text-white px-4 py-2 flex items-center overflow-hidden">
      <span className="text-red-500 font-bold whitespace-nowrap mr-2">Breaking News:</span>
      <div className="flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">{news[currentIndex]}</div>
      </div>
    </div>
  )
}

