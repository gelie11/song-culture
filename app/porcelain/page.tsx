// app/porcelain1/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import PotteryGame from '@/components/PotteryGame';
import { useState } from 'react';


export default function PorcelainPage() {
  const [activeView, setActiveView] = useState<'main' | 'history' | 'craft' | 'masterpieces' | 'guide'>('main');
  const router = useRouter();
  const [clayShape, setClayShape] = useState<ClayPoint[]>([]);

  // Left side buttons configuration
  const leftSideButtons = [
    {
      id: 1,
      imgSrc: "/porcelain/21.png",
      label: "",
      action: () => setActiveView('history')
    },
    {
      id: 2,
      imgSrc: "/porcelain/22.png",
      label: "",
      action: () => setActiveView('craft')
    },
    {
      id: 3,
      imgSrc: "/porcelain/23.png",
      label: "",
      action: () => setActiveView('masterpieces')
    },
    {
      id: 4,
      imgSrc: "/porcelain/24.png",
      label: "",
      action: () => setActiveView('guide')
    }
  ]

  const viewContents = {
    history: {
      title: "瓶",
      content: "杭州宋朝瓷器瓶造型多样，如梅瓶优雅、琮式瓶古朴，釉色温润，尽显宋瓷简约之美 。"
    },
    craft: {
      title: "碗",
      content: "杭州宋朝瓷器碗造型多样，有莲瓣纹、荷叶纹等，釉色温润，工艺精湛，尽显宋瓷魅力 。"
    },
    masterpieces: {
      title: "炉",
      content: "杭州宋朝瓷器炉有簋式、鼎式、鬲式等，造型仿古，釉色温润，尽显宋代极简美学 。"
    },
    guide: {
      title: "盆",
      content: "杭州宋朝瓷器盆，有渣斗形、方形等多样造型，釉色温润，或现开片，尽显宋瓷独特韵味 。"
    }
  }
  // Handle navigation to next page with shape data
  const handleNextPage = () => {
    // 保存到 localStorage
    localStorage.setItem('potteryShape', JSON.stringify(clayShape));
    router.push('/porcelain/2'); // 不再需要 URL 参数
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fullscreen background image */}
      <Image
        src="/porcelain/1.png"
        alt="瓷器文化展厅背景"
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

      {/* Back button (top-left corner) */}
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
      </button>

      /* 左侧按钮组/卡片切换区 */
  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
    {/* 正常按钮状态 */}
    {activeView === 'main' && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-2"
      >
        {leftSideButtons.map((button) => (
          <button
            key={button.id}
            onClick={button.action}
            className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
            aria-label={ `查看${button.label}内容`} // 添加可访问性标签
          >
            <Image
              src={button.imgSrc}
              alt=""
              width={100}
              height={60}
              quality={100}
              className="transition-transform duration-300 hover:scale-105 active:scale-95 drop-shadow-lg"
            />
          </button>
        ))}
      </motion.div>
    )}

    {/* 卡片状态 */}
    {activeView !== 'main' && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-20"
      >
        <Card className="ancient-card p-4 bg-gradient-to-br from-rice-paper to-ivory-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-amber-900">
              {viewContents[activeView].title}
            </h3>
            <button
              onClick={() => setActiveView('main')}
              className="text-amber-700 hover:text-amber-900"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-amber-800">
            {viewContents[activeView].content}
          </p>
        </Card>
      </motion.div>
    )}
  </div>
      {/* Pottery game card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-[15%] left-[21%] transform -translate-x-1/2 -translate-y-1/2 z-20 w-[80%] max-w-md px-4"

      >
        <Card className="ancient-card p-6 bg-gradient-to-br from-rice-paper/90 to-ivory-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-amber-900 mb-4"></h2>
            <div className="w-full h-[400px] flex justify-center items-center">
              <PotteryGame onShapeChange={setClayShape} />
            </div>
            <p className="mt-4 text-sm text-amber-800 text-center">
              上下滑动改变高度，左右滑动改变宽度<br />
              点击底部转盘并拖动可以旋转黏土
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Main bottom button */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={handleNextPage}
          className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
          aria-label="浏览瓷器藏品"
        >
          <Image
            src="/porcelain/图片5.png"
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

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  )
}

interface ClayPoint {
  x: number;
  y: number;
  z: number;
}