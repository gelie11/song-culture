// app/porcelain1/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import PotteryGame from '@/components/PotteryGame'; // 导入拉胚游戏组件

export default function PorcelainPage() {
  const router = useRouter()

  // 左侧四个按钮配置
  const leftSideButtons = [
    {
      id: 1,
      imgSrc: "/porcelain/21.png",
      label: "",
      action: () => router.push('/history')
    },
    {
      id: 2,
      imgSrc: "/porcelain/22.png",
      label: "",
      action: () => router.push('/craft')
    },
    {
      id: 3,
      imgSrc: "/porcelain/23.png",
      label: "",
      action: () => router.push('/masterpieces')
    },
    {
      id: 4,
      imgSrc: "/porcelain/24.png",
      label: "",
      action: () => router.push('/guide')
    }
  ]

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src="/porcelain/1.png"
        alt="瓷器文化展厅背景"
        fill
        priority
        quality={100}
        className="object-cover brightness-100"
        sizes="100vw"
      />

      {/* 返回首页按钮（左上角） */}
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

      {/* 左侧四个按钮（垂直排列） */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2">
        {leftSideButtons.map((button) => (
          <button
            key={button.id}
            onClick={button.action}
            className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
            aria-label={button.label}
          >
            <Image
              src={button.imgSrc}
              alt=""
              width={100}
              height={60}
              quality={100}
              className="transition-transform duration-300 hover:scale-105 active:scale-95 drop-shadow-lg"
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-bold tracking-wide group-hover:text-amber-200">
              {button.label}
            </span>
          </button>
        ))}
      </div>

      {/* 包含拉胚游戏的卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-[18%] left-[27%] transform -translate-x-1/2 -translate-y-1/2 z-20 w-[65%] max-w-md px-4"
      >
        <Card className="ancient-card p-6 bg-gradient-to-br from-rice-paper/90 to-ivory-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-amber-900 mb-4">瓷器拉胚体验</h2>
            <div className="w-full h-[250px] flex justify-center items-center">
              <PotteryGame />
            </div>
            <p className="mt-4 text-sm text-amber-800 text-center">
              上下滑动改变高度，左右滑动改变宽度
              点击底部转盘并拖动可以旋转黏土
            </p>
          </div>
        </Card>
      </motion.div>
      
      {/* 底部主按钮 */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => router.push('/porcelain/2')}
          className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
          aria-label="浏览瓷器藏品"
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
          <span className="absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold tracking-wider group-hover:text-amber-200 transition-colors">
          </span>
        </button>
      </div>

      {/* 底部装饰元素 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  )
}