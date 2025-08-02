"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BookOpen, Volume2, HelpCircle } from "lucide-react"

export default function PoetryPage() {
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [grid, setGrid] = useState<string[]>(Array(9).fill(""))
  const [showHint, setShowHint] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const poemData = {
    title: "水调歌头",
    author: "苏轼",
    horizontal: ["明月几时有", "把酒问青天", "不知天上宫"],
    vertical: ["明把不", "月酒知", "几问天"],
    solution: ["明", "月", "几", "把", "酒", "问", "不", "知", "天"],
    annotation: "此词作于丙辰年中秋，表达了对弟弟苏辙的思念之情，体现了苏轼豁达的人生态度。",
  }

  const availableCharacters = ["明", "月", "几", "时", "有", "把", "酒", "问", "青", "天", "不", "知", "上", "宫", "阙"]

  const handleCellClick = (index: number) => {
    setSelectedCell(index)
  }

  const handleCharacterInput = (char: string) => {
    if (selectedCell !== null) {
      const newGrid = [...grid]
      newGrid[selectedCell] = char
      setGrid(newGrid)

      const isGridComplete = newGrid.every((cell, index) => cell === poemData.solution[index])
      if (isGridComplete) {
        setIsComplete(true)
      }
    }
  }

  const resetGrid = () => {
    setGrid(Array(9).fill(""))
    setIsComplete(false)
    setSelectedCell(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-ink-black/5 relative overflow-hidden">
      {/* 水墨背景 */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 430 800" fill="none">
          <circle cx="100" cy="120" r="60" fill="url(#ink-gradient-1)" />
          <circle cx="330" cy="250" r="80" fill="url(#ink-gradient-2)" />
          <circle cx="200" cy="500" r="50" fill="url(#ink-gradient-3)" />
          <defs>
            <radialGradient id="ink-gradient-1">
              <stop offset="0%" stopColor="#2c2c2c" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2c2c2c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ink-gradient-2">
              <stop offset="0%" stopColor="#1e3a2e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e3a2e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ink-gradient-3">
              <stop offset="0%" stopColor="#8b2635" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8b2635" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 飘浮的诗词字符 */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-ink-black/20 text-xl ancient-title"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
          >
            {availableCharacters[Math.floor(Math.random() * availableCharacters.length)]}
          </motion.div>
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
            <h1 className="text-2xl font-bold ancient-title text-ink-black">诗词风雅</h1>
            <p className="text-sm text-ancient-gold ancient-text">墨韵千秋</p>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 px-6">
        {/* 诗词信息卡片 */}
        <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div className="text-center">
            <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">{poemData.title}</h2>
            <p className="text-ancient-gold ancient-text mb-4">作者：{poemData.author}</p>

            <div className="flex justify-center gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="border-ancient-gold text-ancient-gold bg-transparent"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                {showHint ? "隐藏" : "提示"}
              </Button>

              <Button variant="outline" size="sm" className="border-ancient-gold text-ancient-gold bg-transparent">
                <Volume2 className="w-4 h-4 mr-1" />
                朗读
              </Button>
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-ancient-gold/5 rounded-lg"
              >
                <p className="text-sm ancient-text text-deep-ink leading-relaxed">
                  横向：{poemData.horizontal.join(" / ")}
                </p>
                <p className="text-sm ancient-text text-deep-ink leading-relaxed mt-2">
                  纵向：{poemData.vertical.join(" / ")}
                </p>
              </motion.div>
            )}
          </div>
        </Card>

        {/* 九宫格填字区域 */}
        <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">九宫格填字</h3>

          <div className="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
            {grid.map((char, index) => (
              <motion.button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-xl font-bold ancient-title transition-all ${
                  selectedCell === index
                    ? "border-ancient-gold bg-ancient-gold/10"
                    : "border-ancient-gold/30 hover:border-ancient-gold/50"
                } ${char === poemData.solution[index] && char !== "" ? "bg-jade-green/20 border-jade-green" : ""}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  key={char}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-ink-black"
                >
                  {char}
                </motion.span>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={resetGrid}
              variant="outline"
              size="sm"
              className="border-ancient-gold text-ancient-gold bg-transparent"
            >
              重新开始
            </Button>
          </div>
        </Card>

        {/* 字符选择区域 */}
        <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">选择字符</h3>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {availableCharacters.map((char, index) => (
              <motion.button
                key={index}
                onClick={() => handleCharacterInput(char)}
                disabled={selectedCell === null}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold ancient-title transition-all ${
                  selectedCell === null
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-ancient-gold/30 hover:border-ancient-gold hover:bg-ancient-gold/10 text-ink-black"
                }`}
                whileHover={selectedCell !== null ? { scale: 1.1 } : {}}
                whileTap={selectedCell !== null ? { scale: 0.9 } : {}}
              >
                {char}
              </motion.button>
            ))}
          </div>

          {selectedCell !== null && (
            <p className="text-center text-sm ancient-text text-deep-ink">
              已选择第 {selectedCell + 1} 个格子，点击字符填入
            </p>
          )}
        </Card>

        {/* 完成状态 */}
        {isComplete && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="ancient-card p-6 bg-gradient-to-br from-ancient-gold/10 to-jade-green/10 text-center">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-xl font-bold ancient-title text-ink-black mb-4">诗词填字完成！</h3>

              <div className="mb-6">
                <p className="text-lg ancient-title text-deep-ink mb-2">{poemData.horizontal[0]}</p>
                <p className="text-lg ancient-title text-deep-ink mb-2">{poemData.horizontal[1]}</p>
                <p className="text-lg ancient-title text-deep-ink mb-4">{poemData.horizontal[2]}</p>
              </div>

              <Card className="p-4 bg-ivory-white/50 border-ancient-gold/20 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-5 h-5 text-ancient-gold mr-2" />
                  <span className="font-bold ancient-text text-ancient-gold">诗词注释</span>
                </div>
                <p className="text-sm ancient-text text-deep-ink leading-relaxed">{poemData.annotation}</p>
              </Card>

              <div className="space-y-3">
                <Link href="/drama">
                  <Button className="w-full ancient-button">下一站：梨园春秋 →</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-ancient-gold text-ancient-gold bg-transparent">
                    返回首页
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 诗词文化知识 */}
        <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h4 className="text-lg font-bold ancient-title text-ink-black mb-3 text-center">📚 宋词文化</h4>
          <div className="space-y-2 ancient-text text-deep-ink text-sm">
            <p>• 宋词是中国古典文学的瑰宝</p>
            <p>• 苏轼开创了豪放派词风</p>
            <p>• 宋词讲究音律与意境的完美结合</p>
            <p>• 《水调歌头》是苏轼的代表作之一</p>
            <p>• 宋代文人以词抒怀，寄托人生感悟</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
