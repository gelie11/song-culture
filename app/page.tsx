"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [currentPoetry, setCurrentPoetry] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [inkDrops, setInkDrops] = useState<Array<{ id: number; x: number; y: number }>>([])
  const router = useRouter()

  const poetryLines = [
    "明月几时有，把酒问青天",
    "不知天上宫阙，今夕是何年",
    "我欲乘风归去，又恐琼楼玉宇",
    "高处不胜寒，起舞弄清影",
    "何似在人间",
  ]

  const culturalModules = [
    {
      id: "porcelain",
      title: "青瓷雅韵",
      subtitle: "宋窑神工",
      icon: "🏺",
      path: "/porcelain",
      color: "from-jade-green to-deep-jade",
      description: "体验宋代制瓷工艺的精妙",
    },
    {
      id: "tea",
      title: "茶禅一味",
      subtitle: "东坡品茗",
      icon: "🍵",
      path: "/tea",
      color: "from-bamboo-green to-jade-green",
      description: "感受宋代茶文化的深邃",
    },
    {
      id: "silk",
      title: "锦绣华章",
      subtitle: "丝路织梦",
      icon: "🧵",
      path: "/silk",
      color: "from-plum-purple to-cinnabar-red",
      description: "领略宋代织锦的华美",
    },
    {
      id: "poetry",
      title: "诗词风雅",
      subtitle: "墨韵千秋",
      icon: "📜",
      path: "/poetry",
      color: "from-ink-black to-deep-ink",
      description: "品味宋词的韵律之美",
    },
    {
      id: "drama",
      title: "梨园春秋",
      subtitle: "脸谱传神",
      icon: "🎭",
      path: "/drama",
      color: "from-cinnabar-red to-deep-red",
      description: "探索戏曲艺术的魅力",
    },
  ]

  // 检查是否是从登录页面返回的
  const [isFromLogin, setIsFromLogin] = useState(false)

  useEffect(() => {
    // 检查是否是从登录页面返回的
    const fromLogin = sessionStorage.getItem('fromLogin')
    if (fromLogin === 'true') {
      setShowWelcome(false)
      setIsFromLogin(true)
      sessionStorage.removeItem('fromLogin') // 清除标记
    }

    // 诗词轮播
    const poetryTimer = setInterval(() => {
      setCurrentPoetry((prev) => (prev + 1) % poetryLines.length)
    }, 3000)

    // 生成水墨滴落效果
    const drops = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setInkDrops(drops)

    // 欢迎页面自动消失并跳转到登录页面
    // 只有不是从登录页面返回时才执行欢迎动画和跳转
    let welcomeTimer: NodeJS.Timeout | null = null
    if (!isFromLogin) {
      welcomeTimer = setTimeout(() => {
        setShowWelcome(false)
        // 跳转到登录页面
        router.push("/login")
      }, 2000)
    }

    return () => {
      clearInterval(poetryTimer)
      if (welcomeTimer) clearTimeout(welcomeTimer)
    }
  }, [isFromLogin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-rice-paper relative overflow-hidden">
      {/* 古风背景纹样 */}
      <div className="absolute inset-0 ancient-pattern" />

      {/* 水墨滴落效果 */}
      {inkDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-3 h-3 rounded-full bg-ink-black opacity-20 ink-drop"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
          }}
          animate={{
            scale: [0, 1, 1.5],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: drop.id * 0.5,
          }}
        />
      ))}

      {/* 欢迎动画 */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-ink-black via-deep-ink to-jade-green z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-ancient-gold to-bronze-gold rounded-full flex items-center justify-center text-4xl font-bold"
                >
                临安录
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl font-bold text-ancient-gold ancient-title mb-2"
              >
                宋韵漫游
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-ivory-white ancient-text"
              >
                穿越千年，品味宋韵之美
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要内容 */}
      <div className="relative z-10 p-6">
        {/* 顶部标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="relative">
            <h1 className="text-4xl font-bold ancient-title mb-4 text-ink-black">宋韵漫游</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-bronze-gold mx-auto rounded-full" />
          </div>
        </motion.div>

        {/* 诗词轮播区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="mb-8"
        >
          <Card className="ancient-card p-6 text-center bg-gradient-to-br from-ivory-white to-rice-paper">
            <div className="h-16 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPoetry}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="text-lg ancient-text text-deep-ink"
                >
                  {poetryLines[currentPoetry]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex justify-center mt-4">
              {poetryLines.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                    index === currentPoetry ? "bg-ancient-gold" : "bg-ancient-gold/30"
                  }`}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 文化模块网格 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          {culturalModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3 + index * 0.2, duration: 0.6 }}
            >
              <Link href={module.path}>
                <Card className="ancient-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold ancient-title text-ink-black mb-1">{module.title}</h3>
                      <p className="text-sm text-ancient-gold font-medium mb-2">{module.subtitle}</p>
                      <p className="text-sm ancient-text text-deep-ink">{module.description}</p>
                    </div>
                    <div className="text-ancient-gold group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 东坡形象区域 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 0.8 }}
          className="text-center mb-8"
        >
          <Card className="ancient-card p-6 bg-gradient-to-br from-jade-green/10 to-ancient-gold/10">
            <div className="relative inline-block mb-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="w-20 h-20 bg-gradient-to-br from-ink-black to-deep-ink rounded-full flex items-center justify-center text-ancient-gold text-2xl font-bold ancient-title border-4 border-ancient-gold"
              >
                苏轼
              </motion.div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-ancient-gold to-bronze-gold rounded-full flex items-center justify-center text-xs">
                ✨
              </div>
            </div>
            <motion.p
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="ancient-text text-deep-ink"
            >
              "欢迎来到宋韵漫游，与东坡一同品味千年文化"
            </motion.p>
          </Card>
        </motion.div>

        {/* 底部导航提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-deep-ink/70">
            <span className="text-sm ancient-text">点击体验各个文化模块</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-ancient-gold"
            >
              ↑
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-jade-green/20 to-transparent" />
      <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 430 64" fill="none">
        <path d="M0,64 Q107.5,40 215,48 T430,44 L430,64 Z" fill="url(#mountain-gradient)" />
        <defs>
          <linearGradient id="mountain-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a2e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f2419" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
