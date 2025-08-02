"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Palette, Sparkles } from "lucide-react"

export default function SilkPage() {
  const [currentStep, setCurrentStep] = useState("weaving")
  const [weavingProgress, setWeavingProgress] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [isWeaving, setIsWeaving] = useState(false)
  const [showFinalDesign, setShowFinalDesign] = useState(false)

  const patterns = [
    {
      name: "云纹",
      color: "from-blue-300 to-blue-500",
      description: "祥云缭绕，寓意吉祥如意",
      ancientName: "祥云纹",
    },
    {
      name: "凤凰",
      color: "from-red-300 to-red-500",
      description: "凤凰于飞，象征高贵典雅",
      ancientName: "凤鸟纹",
    },
    {
      name: "牡丹",
      color: "from-pink-300 to-pink-500",
      description: "花开富贵，寓意繁荣昌盛",
      ancientName: "富贵花",
    },
    {
      name: "龙纹",
      color: "from-yellow-300 to-yellow-500",
      description: "龙腾四海，威严神圣之象",
      ancientName: "应龙纹",
    },
  ]

  const handleWeaving = () => {
    setIsWeaving(true)
    const interval = setInterval(() => {
      setWeavingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsWeaving(false)
          setCurrentStep("design")
          return 100
        }
        return prev + 3
      })
    }, 100)
  }

  const handleDesignComplete = () => {
    setShowFinalDesign(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-plum-purple/10 relative overflow-hidden">
      {/* 丝绸纹理背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-plum-purple/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cinnabar-red/20 to-transparent" />

        {/* 织锦纹样背景 */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(139, 38, 53, 0.3) 25%, transparent 25%),
                             linear-gradient(-45deg, rgba(139, 38, 53, 0.3) 25%, transparent 25%),
                             linear-gradient(45deg, transparent 75%, rgba(139, 38, 53, 0.3) 75%),
                             linear-gradient(-45deg, transparent 75%, rgba(139, 38, 53, 0.3) 75%)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />
        </div>
      </div>

      {/* 飘动的丝线 */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-16 bg-gradient-to-b from-transparent via-cinnabar-red/30 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 顶部导航 */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-ink-black hover:bg-ancient-gold/10 ancient-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold ancient-title text-ink-black">锦绣华章</h1>
            <p className="text-sm text-ancient-gold ancient-text">丝路织梦</p>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 px-6">
        {currentStep === "weaving" && (
          <>
            {/* 织机可视化区域 */}
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="relative w-full h-64">
                {/* 织机框架 */}
                <div className="absolute inset-4 border-4 border-bronze-gold rounded-lg shadow-lg" />

                {/* 经线 */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-4 bottom-4 w-px bg-gray-300"
                    style={{ left: `${20 + i * 3.75}%` }}
                  />
                ))}

                {/* 纬线织造 */}
                <div className="absolute inset-6 overflow-hidden">
                  {Array.from({ length: Math.floor(weavingProgress / 4) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={`absolute w-full h-1 bg-gradient-to-r ${patterns[selectedPattern].color} rounded-full`}
                      style={{ top: `${i * 2}px` }}
                    />
                  ))}
                </div>

                {/* 梭子 */}
                {isWeaving && (
                  <motion.div
                    className="absolute w-6 h-1 bg-bronze-gold rounded-full"
                    style={{ top: `${Math.floor(weavingProgress / 4) * 2 + 24}px` }}
                    animate={{
                      left: ["15%", "80%", "15%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* 进度显示 */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32">
                  <div className="ancient-progress h-2 relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cinnabar-red to-plum-purple rounded-full"
                      style={{ width: `${weavingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-center text-xs mt-1 ancient-text text-deep-ink">织造: {weavingProgress}%</p>
                </div>
              </div>
            </Card>

            {/* 纹样选择区域 */}
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">选择纹样</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {patterns.map((pattern, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPattern(index)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPattern === index
                        ? "border-ancient-gold bg-ancient-gold/10"
                        : "border-gray-200 hover:border-ancient-gold/50"
                    }`}
                  >
                    <div className={`w-full h-6 bg-gradient-to-r ${pattern.color} rounded mb-2`} />
                    <p className="text-sm font-bold ancient-title text-ink-black">{pattern.name}</p>
                    <p className="text-xs text-ancient-gold ancient-text">{pattern.ancientName}</p>
                    <p className="text-xs ancient-text text-deep-ink mt-1">{pattern.description}</p>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleWeaving}
                disabled={isWeaving || weavingProgress >= 100}
                className="w-full ancient-button text-lg py-3"
              >
                {isWeaving ? "织造中..." : weavingProgress >= 100 ? "织造完成" : "开始织造"}
              </Button>
            </Card>
          </>
        )}

        {currentStep === "design" && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-plum-purple to-cinnabar-red rounded-full flex items-center justify-center">
                  <Palette className="w-8 h-8 text-ivory-white" />
                </div>
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">华服设计</h2>
                <p className="ancient-text text-deep-ink text-sm">
                  基于您选择的{patterns[selectedPattern].ancientName}，为您设计宋代风格华服
                </p>
              </div>

              {/* 服饰设计预览 */}
              <div className="relative w-48 h-64 mx-auto mb-6 bg-gradient-to-b from-ivory-white to-rice-paper rounded-lg border-4 border-ancient-gold/30 shadow-lg">
                <div
                  className={`absolute inset-4 bg-gradient-to-b ${patterns[selectedPattern].color} rounded-lg opacity-80`}
                >
                  {/* 纹样细节 */}
                  <div className="absolute inset-2 border border-white/30 rounded">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-6 h-6 border border-white/50 rounded-full"
                        style={{
                          left: `${20 + (i % 3) * 30}%`,
                          top: `${20 + Math.floor(i / 3) * 40}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 袖子 */}
                <div
                  className={`absolute -left-6 top-12 w-12 h-24 bg-gradient-to-b ${patterns[selectedPattern].color} rounded-l-full opacity-80`}
                />
                <div
                  className={`absolute -right-6 top-12 w-12 h-24 bg-gradient-to-b ${patterns[selectedPattern].color} rounded-r-full opacity-80`}
                />
              </div>

              <Button onClick={handleDesignComplete} className="w-full ancient-button text-lg py-3">
                <Sparkles className="w-4 h-4 mr-2" />
                查看穿着效果
              </Button>
            </Card>
          </motion.div>
        )}

        {showFinalDesign && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <Card className="ancient-card p-6 bg-gradient-to-br from-plum-purple/10 to-ancient-gold/10">
              <h3 className="text-xl font-bold ancient-title text-ink-black mb-4">华服设计完成！</h3>

              {/* 动态人物展示 */}
              <div className="relative w-24 h-36 mx-auto mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`w-full h-full bg-gradient-to-b ${patterns[selectedPattern].color} rounded-full relative shadow-lg`}
                >
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-ivory-white rounded-full" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs">😊</div>

                  {/* 装饰纹样 */}
                  <div className="absolute inset-2 border border-white/30 rounded-full" />
                </motion.div>
              </div>

              <p className="ancient-text text-deep-ink mb-6">
                恭喜您成功掌握宋代织锦工艺，创作出精美的{patterns[selectedPattern].ancientName}华服！
                此服饰融合了宋代织锦的精湛技艺与传统文化的深厚底蕴。
              </p>

              <div className="space-y-3">
                <Link href="/poetry">
                  <Button className="w-full ancient-button">下一站：诗词风雅 →</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-plum-purple text-plum-purple bg-transparent">
                    返回首页
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 丝绸文化知识 */}
        <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h4 className="text-lg font-bold ancient-title text-ink-black mb-3 text-center">🧵 宋代织锦文化</h4>
          <div className="space-y-2 ancient-text text-deep-ink text-sm">
            <p>• 宋代织锦工艺达到历史巅峰</p>
            <p>• 《蚕织图》记录了完整的制丝过程</p>
            <p>• 宋锦以其精美的纹样闻名于世</p>
            <p>• 丝绸之路促进了织锦技艺的传播</p>
            <p>• 宋代服饰追求"雅致"与"含蓄"之美</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
