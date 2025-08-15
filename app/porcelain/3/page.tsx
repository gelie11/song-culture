// app/new-page/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function NewPage() {
  const router = useRouter()
  const [ventPosition, setVentPosition] = useState(50) // 通风控制位置(0-100)
  const [isDragging, setIsDragging] = useState(false)
  const [temperature, setTemperature] = useState(0) // 当前窑温
  const [isFiring, setIsFiring] = useState(false) // 是否正在烧制
  const sliderContainerRef = useRef<HTMLDivElement>(null)  // 容器ref
  const sliderButtonRef = useRef<HTMLDivElement>(null)     // 按钮ref
  const targetTemperature = 1280 // 目标温度

  // 拖拽逻辑（参考gallery页面优化）
  const handleMove = (clientY: number) => {
    if (!sliderContainerRef.current || !sliderButtonRef.current) return

    const containerRect = sliderContainerRef.current.getBoundingClientRect()
    const buttonHeight = sliderButtonRef.current.offsetHeight
    
    // 计算新位置（限制在容器内）
    let newY = clientY - containerRect.top - (buttonHeight / 2)
    newY = Math.max(0, Math.min(newY, containerRect.height - buttonHeight))

    // 转换为百分比
    const newPosition = (newY / (containerRect.height - buttonHeight)) * 100
    setVentPosition(newPosition)
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

  // 统一处理鼠标和触摸事件
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

  // 烧制过程模拟
  useEffect(() => {
    if (!isFiring) return

    const interval = setInterval(() => {
      setTemperature(prev => {
        // 温度变化率受通风控制影响
        // 通风越大(ventPosition越小)，温度上升越慢
        const heatingRate = (5 - (ventPosition / 25)) * 2 // 调整系数控制速率
        const newTemp = prev + heatingRate
        
        // 检查是否达到目标温度
        if (newTemp >= targetTemperature) {
          clearInterval(interval)
          setTimeout(() => router.push('/porcelain/4'), 1000) // 1秒后跳转
          return targetTemperature
        }
        
        return newTemp
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isFiring, ventPosition, router])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src="/porcelain/new-background.png"
        alt="新页面背景"
        fill
        priority
        quality={100}
        className="object-cover brightness-100"
        sizes="100vw"
      />
      
      {/* 在背景Image组件下方，Back按钮上方添加 */}
      <div className="absolute top-6 left-0 right-0 z-20 text-center">
        <h1 className="text-3xl font-bold ancient-title text-ink-black">青瓷雅韵</h1>
        <p className="text-sm text-ancient-gold ancient-text">宋窑神工</p>
      </div>
      {/* 返回按钮（左上角） */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 p-2 text-black hover:text-gray-700 transition-colors bg-transparent border-none focus:outline-none"
        aria-label="返回"
      >
        <Image
      src="/return.png"   // 确保 return.png 放在 public 目录
      alt="返回"
      width={40}          // 这里可以调大小，例如 40
      height={40}
      className="object-contain"
      style={{ opacity: 0.8 }}   // 调整透明度
    />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </button>

      {/* 通风控制滑块（右侧）- 优化后版本 */}
      <div 
        ref={sliderContainerRef}
        className="absolute right-7 top-[40%] transform -translate-y-1/2 h-64 w-10 bg-gray-800/50 rounded-full z-20"
      >
        <div 
          ref={sliderButtonRef}
          style={{
            top: `${ventPosition}%`,
            transform: 'translate(-50%, -50%)',
            transition: isDragging ? 'none' : 'top 0.2s ease-out',
            pointerEvents: 'none',  // 禁止鼠标事件，避免干扰拖拽
            width: 'fit-content',  // 确保容器自适应内容
          }}
          className="absolute left-1/2"
        >
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="cursor-grab active:cursor-grabbing"
            style={{ pointerEvents: 'auto' }}
          >
            <Image
              src="/porcelain/32.png"
              alt="通风控制"
              width={12}
              height={12}
              className="select-none !w-[48px] !h-[32px]"  // 强制覆盖样式
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
        <div 
  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-black text-sm whitespace-nowrap"
>
  <div className="flex flex-col items-center">  {/* 改为横排两行 */}
    <span>通风</span>
    <span>控制</span>
  </div>
</div>
      </div>

      {/* 跑道型窑温显示器（主按钮上方） */}
<div className="absolute bottom-[40%] left-1/2 transform -translate-x-1/2 w-64 h-12 bg-gray-800/70 rounded-full z-20 overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 transition-all duration-300"
    style={{
      width: `${Math.min(100, (temperature / targetTemperature) * 100)}%`
    }}
  />
  <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold whitespace-nowrap text-center"
  >
    {Math.round(temperature)}°C / {targetTemperature}°C
  </div>
</div>

      {/* 主按钮（居中底部） */}
      <div className="absolute bottom-[18%] left-1/2 transform -translate-x-1/2 z-20">
        <button 
          onClick={() => {
            if (!isFiring) {
              setIsFiring(true)
              setTemperature(0)
            }
          }}
          className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
          aria-label="开始烧制"
          disabled={isFiring}
        >
          <Image
            src="/porcelain/按钮.png"
            alt="开始烧制"
            width={150}
            height={140}
            quality={100}
            priority
            className={`transition-transform duration-300 group-hover:scale-110 group-active:scale-95 drop-shadow-xl ${
              isFiring ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold tracking-wider group-hover:text-amber-200 transition-colors">
            {isFiring ? '烧制中...' : ''}
          </span>
        </button>
      </div>

      {/* 底部装饰元素 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  )
}