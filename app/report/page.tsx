"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Award, Star, Download, Share } from "lucide-react"

export default function ReportPage() {
  const [achievements, setAchievements] = useState({
    porcelain: 85,
    tea: 92,
    silk: 78,
    poetry: 95,
    drama: 88,
  })

  const achievementData = [
    {
      id: "porcelain",
      name: "青瓷雅韵",
      icon: "🏺",
      description: "掌握宋代青瓷制作工艺",
      progress: achievements.porcelain,
      color: "from-jade-green to-deep-jade",
      ancientName: "瓷艺精通",
    },
    {
      id: "tea",
      name: "茶禅一味",
      icon: "🍵",
      description: "体验宋代炒茶与茶文化",
      progress: achievements.tea,
      color: "from-bamboo-green to-jade-green",
      ancientName: "茶道大师",
    },
    {
      id: "silk",
      name: "锦绣华章",
      icon: "🧵",
      description: "创作宋代风格华美服饰",
      progress: achievements.silk,
      color: "from-plum-purple to-cinnabar-red",
      ancientName: "织锦名家",
    },
    {
      id: "poetry",
      name: "诗词风雅",
      icon: "📜",
      description: "感悟东坡诗词的深邃意境",
      progress: achievements.poetry,
      color: "from-ink-black to-deep-ink",
      ancientName: "文墨大儒",
    },
    {
      id: "drama",
      name: "梨园春秋",
      icon: "🎭",
      description: "体验传统戏曲脸谱艺术",
      progress: achievements.drama,
      color: "from-cinnabar-red to-deep-red",
      ancientName: "戏曲名角",
    },
  ]

  const totalProgress = Math.round(Object.values(achievements).reduce((sum, val) => sum + val, 0) / 5)

  const getTitle = (progress: number) => {
    if (progress >= 90) return "宋韵大师"
    if (progress >= 80) return "文化传承者"
    if (progress >= 70) return "宋韵学者"
    if (progress >= 60) return "文化探索者"
    return "初学者"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-ancient-gold/10 relative overflow-hidden">
      {/* 古卷轴背景 */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 430 800" fill="none">
          <path
            d="M20,50 Q215,30 410,50 L410,750 Q215,770 20,750 Z"
            fill="url(#scroll-gradient)"
            stroke="#d4af37"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#faf6f0" />
              <stop offset="50%" stopColor="#f5f1e8" />
              <stop offset="100%" stopColor="#faf6f0" />
            </linearGradient>
          </defs>
        </svg>
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
            <h1 className="text-2xl font-bold ancient-title text-ink-black">宋韵成就</h1>
            <p className="text-sm text-ancient-gold ancient-text">文化传承录</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-ancient-gold hover:bg-ancient-gold/10">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-ancient-gold hover:bg-ancient-gold/10">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 px-6">
        {/* 总体成就 */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-ancient-gold to-bronze-gold rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-12 h-12 text-ink-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-cinnabar-red to-deep-red rounded-full flex items-center justify-center border-2 border-ivory-white">
                <Star className="w-4 h-4 text-ivory-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold ancient-title text-ink-black mb-2">{getTitle(totalProgress)}</h2>
            <p className="text-lg text-ancient-gold ancient-text mb-4">综合成就度：{totalProgress}%</p>

            <div className="w-full ancient-progress h-3 mb-4 relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-ancient-gold to-cinnabar-red rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </div>

            <p className="ancient-text text-deep-ink leading-relaxed text-sm">
              恭喜您完成宋韵文化之旅！您已深度体验了宋代的瓷器、茶道、丝绸、诗词和戏曲文化，成为了一位真正的宋韵文化传承者。
            </p>
          </Card>
        </motion.div>

        {/* 各项成就 */}
        <div className="space-y-4 mb-6">
          {achievementData.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + 1, duration: 0.6 }}
            >
              <Card className="ancient-card p-4 bg-gradient-to-br from-ivory-white to-rice-paper">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center text-xl shadow-lg`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold ancient-title text-ink-black">{achievement.name}</h4>
                    <p className="text-xs text-ancient-gold ancient-text mb-1">{achievement.ancientName}</p>
                    <p className="text-sm ancient-text text-deep-ink mb-2">{achievement.description}</p>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs ancient-text text-deep-ink">完成度</span>
                      <span className="text-sm font-bold text-ink-black">{achievement.progress}%</span>
                    </div>

                    <div className="w-full ancient-progress h-2 relative">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${achievement.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1.5, delay: index * 0.3 + 1.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <motion.div
                        key={starIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: starIndex < Math.floor(achievement.progress / 20) ? 1 : 0.3,
                          scale: 1,
                        }}
                        transition={{ delay: index * 0.3 + 2 + starIndex * 0.1 }}
                      >
                        <Star
                          className={`w-3 h-3 ${
                            starIndex < Math.floor(achievement.progress / 20)
                              ? "text-ancient-gold fill-ancient-gold"
                              : "text-gray-300"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 东坡寄语 */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}>
          <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ancient-gold/10 to-jade-green/10">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-ink-black to-deep-ink rounded-full flex items-center justify-center text-ancient-gold text-lg font-bold ancient-title border-2 border-ancient-gold">
                  苏轼
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold ancient-title text-ink-black mb-3">东坡寄语</h3>
                <div className="space-y-3 ancient-text text-deep-ink text-sm leading-relaxed">
                  <p className="text-base ancient-title text-cinnabar-red">"人生如逆旅，我亦是行人。"</p>
                  <p>
                    在这次宋韵文化之旅中，您不仅体验了宋代的物质文化，更重要的是感受到了那个时代的精神风貌。
                    从青瓷的温润如玉，到茶香的清雅淡远；从丝绸的华美精致，到诗词的深邃意境；
                    从戏曲的生动表达，到文化的传承创新。
                  </p>
                  <p>
                    愿您能将这份宋韵之美带入现代生活，让千年文化在新时代绽放光彩。
                    正如我所言："但愿人长久，千里共婵娟。"文化的传承，正是这样的美好愿景。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="space-y-3 mb-8"
        >
          <Link href="/">
            <Button className="w-full ancient-button text-lg py-3">重新体验宋韵之旅</Button>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-ancient-gold text-ancient-gold bg-transparent">
              分享成就
            </Button>
            <Button variant="outline" className="border-jade-green text-jade-green bg-transparent">
              了解更多
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
