"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Camera, Palette, Music, Upload } from "lucide-react"

export default function DramaFacePage() {
  const [currentStep, setCurrentStep] = useState("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedMask, setSelectedMask] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maskTemplates = [
    {
      name: "生角",
      color: "from-red-400 to-red-600",
      description: "正面男性角色，忠勇刚直",
      ancientName: "正生",
    },
    {
      name: "旦角",
      color: "from-pink-300 to-pink-500",
      description: "女性角色，温婉贤淑",
      ancientName: "青衣",
    },
    {
      name: "净角",
      color: "from-blue-400 to-blue-600",
      description: "性格刚烈威武的男性",
      ancientName: "花脸",
    },
    {
      name: "丑角",
      color: "from-yellow-300 to-yellow-500",
      description: "滑稽幽默的角色",
      ancientName: "小丑",
    },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setCurrentStep("select")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCurrentStep("result")
    }, 3000)
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-cinnabar-red/10 relative overflow-hidden">
      {/* 顶部导航 */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/drama">
            <Button variant="ghost" className="text-ink-black hover:bg-ancient-gold/10 ancient-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold ancient-title text-ink-black">生成戏曲脸谱</h1>
            <p className="text-sm text-ancient-gold ancient-text">上传照片，体验戏曲之美</p>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 px-6">
        {currentStep === "upload" && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cinnabar-red to-ancient-gold rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-ivory-white" />
                </div>
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">上传照片</h2>
                <p className="ancient-text text-deep-ink text-sm leading-relaxed">
                  上传您的照片，我们将为您生成独特的戏曲脸谱形象，融合东坡诗词的文化韵味
                </p>
              </div>

              <div
                onClick={triggerUpload}
                className="border-2 border-dashed border-ancient-gold/30 rounded-lg p-8 cursor-pointer hover:border-ancient-gold/50 transition-colors text-center"
              >
                <Upload className="w-12 h-12 text-ancient-gold/50 mx-auto mb-3" />
                <p className="ancient-text text-deep-ink mb-1">点击上传照片</p>
                <p className="text-xs ancient-text text-deep-ink/70">支持 JPG、PNG 格式</p>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </Card>
          </motion.div>
        )}

        {currentStep === "select" && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            {/* 照片预览 */}
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">您的照片</h3>
              {uploadedImage && (
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border-4 border-ancient-gold/30 shadow-lg">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </Card>

            {/* 脸谱类型选择 */}
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">选择脸谱类型</h3>

              <div className="space-y-3 mb-6">
                {maskTemplates.map((mask, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMask(index)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedMask === index
                        ? "border-ancient-gold bg-ancient-gold/10"
                        : "border-gray-200 hover:border-ancient-gold/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${mask.color} flex items-center justify-center mr-4 border-2 border-white shadow-lg`}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold ancient-title text-ink-black">{mask.name}</h4>
                        <p className="text-xs text-ancient-gold ancient-text mb-1">{mask.ancientName}</p>
                        <p className="text-sm ancient-text text-deep-ink">{mask.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Button onClick={handleGenerate} className="w-full ancient-button text-lg py-3">
                <Palette className="w-4 h-4 mr-2" />
                生成脸谱
              </Button>
            </Card>
          </motion.div>
        )}

        {currentStep === "result" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cinnabar-red to-ancient-gold rounded-full flex items-center justify-center">
                  <Music className="w-8 h-8 text-ivory-white" />
                </div>
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">您的专属脸谱</h2>
              </div>

              {/* 生成的脸谱效果 */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                {uploadedImage && (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-ancient-gold/30 shadow-lg">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Face painting result"
                      className="w-full h-full object-cover"
                    />

                    {/* 脸谱叠加效果 */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${maskTemplates[selectedMask].color} opacity-60 mix-blend-multiply`}
                    />

                    {/* 传统纹样 */}
                    <div className="absolute inset-0">
                      {/* 额头纹样 */}
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-6 border-4 border-white rounded-full opacity-80" />

                      {/* 脸颊纹样 */}
                      <div className="absolute top-1/2 left-6 w-6 h-6 border-4 border-white rounded-full opacity-80" />
                      <div className="absolute top-1/2 right-6 w-6 h-6 border-4 border-white rounded-full opacity-80" />

                      {/* 下巴纹样 */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-4 border-4 border-white rounded-full opacity-80" />
                    </div>
                  </div>
                )}
              </div>

              {/* 诗词融入 */}
              <Card className="p-4 bg-ancient-gold/5 border-ancient-gold/20 mb-6">
                <h4 className="font-bold ancient-title text-ink-black mb-2 text-center">东坡诗韵融入</h4>
                <p className="ancient-text text-deep-ink text-center mb-2">"人生如戏，戏如人生"</p>
                <p className="text-sm ancient-text text-deep-ink text-center">
                  您的{maskTemplates[selectedMask].ancientName}脸谱融合了苏东坡的人生哲学，展现了宋代文人的风雅与豪放
                </p>
              </Card>

              {/* 动态效果 */}
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-center mb-6"
              >
                <div className="text-6xl">🎭</div>
              </motion.div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setCurrentStep("upload")
                    setUploadedImage(null)
                  }}
                  variant="outline"
                  className="w-full border-cinnabar-red text-cinnabar-red bg-transparent"
                >
                  重新制作
                </Button>
                <Link href="/report">
                  <Button className="w-full ancient-button">查看成就报告 →</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 加载状态 */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="ancient-card p-8 text-center bg-ivory-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-16 h-16 border-4 border-ancient-gold border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="ancient-text text-deep-ink">正在生成您的专属脸谱...</p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
