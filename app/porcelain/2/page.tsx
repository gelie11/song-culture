// app/gallery/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

export default function GalleryPage() {
  const router = useRouter()
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [currentBtnIndex, setCurrentBtnIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  // 按钮图片数组（三张透明PNG）
  const buttonImages = [
    "/porcelain/33.png", // 第一张按钮图片
    "/button2.png", // 第二张按钮图片
    "/button3.png"  // 第三张按钮图片
  ]

  // 切换按钮图片
  const switchButtonImage = () => {
    setCurrentBtnIndex((prev) => (prev + 1) % buttonImages.length)
  }

  // 拖拽逻辑保持不变...
  const handleMove = (clientY: number) => {
    if (!containerRef.current || !buttonRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonHeight = buttonRef.current.offsetHeight
    const minY = 110
    const maxY = containerRect.height - buttonHeight - 400

    let newY = clientY - containerRect.top - (buttonHeight / 2)
    newY = Math.max(minY, Math.min(newY, maxY))

    const newPosition = (newY / (containerRect.height - buttonHeight)) * 100
    setPosition(newPosition)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault()
        handleMove(e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src="/porcelain/背景1.jpg"

        alt="瓷器藏品展示厅"
        fill
        priority
        quality={100}
        className="object-cover brightness-100"
        sizes="100vw"
      />

      {/* 返回按钮（左上角） */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 p-2 text-black hover:text-gray-700 transition-colors bg-transparent border-none focus:outline-none"
        aria-label="返回"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-lg font-medium">返回</span>
      </button>

      {/* 新增的图片切换按钮（左上角，返回按钮下方） */}
      <button
        onClick={switchButtonImage}
        className="absolute left-[66%] top-[57%] transform -translate-x-1/2 -translate-y-1/2"
        aria-label="切换按钮图片"
      >
        <Image
          src={buttonImages[currentBtnIndex]} // 动态切换按钮图片
          alt="切换按钮"
          width={90}
          height={100}
          className="transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-lg"
          draggable="false"
        />
      </button>

      {/* 可滑动透明PNG按钮（右侧） */}
      <div
        ref={containerRef}
        className="absolute right-4 top-0 h-full w-16 z-20"
      >
        <div
          ref={buttonRef}
          style={{
            top: `${position}%`,
            transform: 'translateY(-50%)',
            transition: isDragging ? 'none' : 'top 0.2s ease-out',
            pointerEvents: 'none'
          }}
          className="absolute left-0"
        >
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="cursor-grab active:cursor-grabbing"
            style={{ pointerEvents: 'auto' }}
          >
            <Image
              src="/porcelain/32.png"

              alt="滑动控制按钮"
              width={40}
              height={40}
              className="drop-shadow-lg select-none"
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>

      {/* 主按钮（居中底部） */}
      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => router.push('/porcelain/3')}
          className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
          aria-label="查看藏品详情"
        >
          <Image
            src="/porcelain/图片3.png"

            alt=""
            width={280}
            height={140}
            quality={100}
            priority
            className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95 drop-shadow-xl"
          />
        </button>
      </div>

      {/* 底部装饰元素 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />

      {/* 当前按钮图片指示器（可选） */}
      {/* <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {buttonImages.map((_, index) => (
          <div 
            key={index}
            className={`w-3 h-3 rounded-full ${currentBtnIndex === index ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div> */}
    </div>
  )
}