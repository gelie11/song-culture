// app/new-page/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NewPage() {
  const router = useRouter()

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src="/porcelain/new-background1.jpg" // 替换为你的背景图路径

        alt="新页面背景"
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

      {/* 主按钮（居中底部） */}
      <div className="absolute bottom-[18%] left-1/2 transform -translate-x-1/2 z-20">
        <button 
          onClick={() => router.push('/next-page')} // 设置跳转目标
          className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
          aria-label="主按钮"
        >
          <Image
            src="/porcelain/按钮.png" // 替换为你的按钮图片

            alt=""
            width={150}  // 根据图片调整
            height={140} // 根据图片调整
            quality={100}
            priority
            className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95 drop-shadow-xl"
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold tracking-wider group-hover:text-amber-200 transition-colors">
            
          </span>
        </button>
      </div>

      {/* 底部装饰元素（可选） */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  )
}