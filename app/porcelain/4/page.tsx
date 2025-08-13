// app/artwork-display/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
interface ArtworkData {
  imageData: string
  paintedPoints: Array<{x: number, y: number, color: string, size: number}>
  clayShape: Array<{x: number, y: number, z: number}>
  color: string
  timestamp: number
}

export default function ArtworkDisplayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [artwork, setArtwork] = useState<ArtworkData | null>(null)

  // 修改展示页面的useEffect部分
useEffect(() => {
  // 优先从URL参数获取
  const dataParam = searchParams.get('data')
  
  if (dataParam) {
    try {
      setArtwork(JSON.parse(decodeURIComponent(dataParam)))
    } catch (e) {
      console.error('URL参数解析失败', e)
      // 尝试从sessionStorage获取
      checkSessionStorage()
    }
  } else {
    checkSessionStorage()
  }

  function checkSessionStorage() {
    const sessionData = sessionStorage.getItem('tempArtwork')
    if (sessionData) {
      try {
        setArtwork(JSON.parse(sessionData))
        sessionStorage.removeItem('tempArtwork') // 清除临时数据
      } catch (e) {
        console.error('sessionStorage解析失败', e)
        
      }
    } 
  }
}, [searchParams, router])

  if (!artwork) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">加载作品...</p>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-amber-50 to-amber-100">
      {/* 全屏背景图 */}
            <Image
              src="/porcelain/背景4.png"
              alt="新页面背景"
              fill
              priority
              quality={100}
              className="object-cover brightness-100"
              sizes="100vw"
            />
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 p-2 text-black hover:text-gray-700 transition-colors bg-transparent border-none focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-lg font-medium">返回</span>
      </button>

      {/* 作品展示卡片 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4">
        <Card className="ancient-card p-2 bg-gradient-to-br from-rice-paper/90 to-ivory-white/90 backdrop-blur-sm shadow-xl">

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">作品展示</h2>
            
            {/* 作品图像 */}
            <div className="w-full h-96 relative mb-6 border-2 border-amber-200 rounded-lg overflow-hidden bg-white">
              <img 
                src={artwork.imageData} 
                alt="完成的瓷器作品"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* 创作信息 */}
            <div className="w-full grid grid-cols-3 gap-4 text-amber-900 mb-6">
              <div className="bg-amber-50/50 p-3 rounded-lg">
                <h3 className="font-bold mb-1 text-sm">釉色</h3>
                <div 
                  className="w-8 h-8 rounded-full mx-auto border border-amber-200"
                  style={{ backgroundColor: artwork.color }}
                />
              </div>
              <div className="bg-amber-50/50 p-3 rounded-lg">
                <h3 className="font-bold mb-1 text-sm">笔触数</h3>
                <p className="text-center">{artwork.paintedPoints.length}</p>
              </div>
              <div className="bg-amber-50/50 p-3 rounded-lg">
                <h3 className="font-bold mb-1 text-sm">创作时间</h3>
                <p className="text-center text-sm">
                  {new Date(artwork.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
            <p className="text-stone-600"></p>
            
              <div className="space-y-3">
                <Link href="/tea">
                  <Button className="w-full ancient-button">下一站：茶禅一味 →</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-bamboo-green text-bamboo-green bg-transparent">
                    返回首页
                  </Button>
                </Link>
              </div>
           
          </div>
          </div>
        </Card>
      </div>
    </div>
  )
}