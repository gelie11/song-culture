"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Leaf } from "lucide-react"

export default function TeaPage() {
  const [isStirring, setIsStirring] = useState(false)
  const [teaProgress, setTeaProgress] = useState(0)
  const [currentPoetry, setCurrentPoetry] = useState(0)
  const [fallingLeaves, setFallingLeaves] = useState<Array<{ id: number; x: number; delay: number }>>([])

  const teaPoetry = [
    { text: "从来佳茗似佳人", author: "苏轼" },
    { text: "休对故人思故国，且将新火试新茶", author: "苏轼" },
    { text: "分无玉碗捧峨眉，且尽卢仝七碗茶", author: "苏轼" },
    { text: "茶敬客来茶当酒，云山云去云作车", author: "苏轼" },
  ]

  useEffect(() => {
    // 生成飘落的茶叶
    const leaves = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setFallingLeaves(leaves)

    // 诗词轮播
    const poetryInterval = setInterval(() => {
      setCurrentPoetry((prev) => (prev + 1) % teaPoetry.length)
    }, 4000)

    return () => clearInterval(poetryInterval)
  }, [])

  const handleStirTea = () => {
    setIsStirring(true)

    const progressInterval = setInterval(() => {
      setTeaProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsStirring(false)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const resetTea = () => {
    setTeaProgress(0)
    setIsStirring(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-bamboo-green/10 relative overflow-hidden">
      {/* 茶园背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-bamboo-green/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-jade-green/20 to-transparent" />

        {/* 山峦轮廓 */}
        <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 430 128" fill="none">
          <path d="M0,128 Q107.5,80 215,90 T430,85 L430,128 Z" fill="url(#tea-mountain-gradient)" />
          <path d="M0,128 Q150,100 300,105 T430,100 L430,128 Z" fill="url(#tea-mountain-gradient-2)" />
          <defs>
            <linearGradient id="tea-mountain-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5d23" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a2e" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="tea-mountain-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a2e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f2419" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 飘落的茶叶 */}
      {fallingLeaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-bamboo-green/40 text-xl"
          style={{ left: `${leaf.x}%`, top: "-5%" }}
          animate={{
            y: ["0vh", "105vh"],
            rotate: [0, 360, 720],
            x: [0, Math.sin(leaf.id) * 30],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: leaf.delay,
            ease: "linear",
          }}
        >
          🍃
        </motion.div>
      ))}

      {/* 顶部导航和诗词 */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-ink-black hover:bg-ancient-gold/10 ancient-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold ancient-title text-ink-black">茶禅一味</h1>
            <p className="text-sm text-ancient-gold ancient-text">东坡品茗</p>
          </div>
          <div className="w-16" />
        </div>

        {/* 诗词轮播区域 */}
        <Card className="ancient-card p-4 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div className="text-center h-20 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPoetry}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <p className="text-lg ancient-text text-deep-ink mb-1">{teaPoetry[currentPoetry].text}</p>
                <p className="text-xs text-ancient-gold ancient-text">—— {teaPoetry[currentPoetry].author}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 px-6">
        {/* 炒茶可视化区域 */}
        <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div className="relative w-full h-64 flex items-center justify-center">
            {/* 茶锅 */}
            <div className="absolute bottom-8 w-40 h-20 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full border-4 border-bronze-gold shadow-lg" />

            {/* 茶叶 */}
            <motion.div
              className="absolute bottom-12 w-32 h-16 flex items-center justify-center"
              animate={
                isStirring
                  ? {
                      rotate: [0, 360],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: isStirring ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-1 bg-bamboo-green rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={
                    isStirring
                      ? {
                          scale: [1, 0.8, 1],
                          rotate: [0, 180, 360],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: isStirring ? Number.POSITIVE_INFINITY : 0,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>

            {/* 蒸汽效果 */}
            {isStirring && (
              <div className="absolute bottom-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-6 bg-white/60 rounded-full"
                    style={{
                      left: `${i * 6 - 12}px`,
                      bottom: "0px",
                    }}
                    animate={{
                      height: [8, 24, 8],
                      opacity: [0.6, 0.2, 0.6],
                      y: [0, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            )}

            {/* 进度指示 */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32">
              <div className="ancient-progress h-3 relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-bamboo-green to-jade-green rounded-full"
                  style={{ width: `${teaProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-center text-xs mt-2 ancient-text text-deep-ink">炒制进度: {teaProgress}%</p>
            </div>
          </div>
        </Card>

        {/* 操作控制区域 */}
        <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-bamboo-green to-jade-green rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-ivory-white" />
            </div>
            <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">春茶炒制</h2>
            <p className="ancient-text text-deep-ink leading-relaxed text-sm">
              选用清明前嫩芽，以适当火候炒制，去青草味，激发茶香，此乃制茶之要诀。
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleStirTea}
              disabled={isStirring || teaProgress >= 100}
              className="w-full ancient-button text-lg py-3"
            >
              {isStirring ? "炒制中..." : teaProgress >= 100 ? "炒制完成" : "开始炒茶"}
            </Button>

            {teaProgress > 0 && (
              <Button
                onClick={resetTea}
                variant="outline"
                className="w-full border-bamboo-green text-bamboo-green bg-transparent"
              >
                重新开始
              </Button>
            )}
          </div>
        </Card>

        {/* 完成状态 */}
        {teaProgress >= 100 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <Card className="ancient-card p-6 bg-gradient-to-br from-bamboo-green/10 to-ancient-gold/10">
              <div className="text-6xl mb-4">🍵</div>
              <h3 className="text-xl font-bold ancient-title text-ink-black mb-2">茶香四溢，炒制成功！</h3>
              <p className="ancient-text text-deep-ink mb-4">恭喜您掌握了宋代炒茶工艺，清香淡雅的好茶已经制成。</p>

              <div className="space-y-3">
                <Link href="/silk">
                  <Button className="w-full ancient-button">下一站：锦绣华章 →</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-bamboo-green text-bamboo-green bg-transparent">
                    返回首页
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 茶文化知识 */}
        <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h4 className="text-lg font-bold ancient-title text-ink-black mb-3 text-center">🫖 宋代茶文化</h4>
          <div className="space-y-2 ancient-text text-deep-ink text-sm">
            <p>• 宋代茶文化达到历史巅峰</p>
            <p>• 苏东坡是著名的茶文化推广者</p>
            <p>• "点茶法"是宋代独特的饮茶方式</p>
            <p>• 建盏是宋代最珍贵的茶具</p>
            <p>• "茶禅一味"体现了宋人的生活哲学</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
