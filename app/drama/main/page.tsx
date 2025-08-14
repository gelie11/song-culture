"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Camera, Palette, Music, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

// 统一风格
  const titleFont =
    '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';
  const accent = "#a94438";

export default function DramaPage() {
  const router = useRouter()
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
      img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Zhuge+Liang+blue+white+scholar&sign=5507d55ae217d163bc8283c67f4f718a",
    },
    {
      name: "旦角",
      color: "from-pink-300 to-pink-500",
      description: "女性角色，温婉贤淑",
      ancientName: "青衣",
      img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Yang+Guifei+pink+white+beauty&sign=6148742b3f62416ddc4dde68e5eda1f8",
    },
    {
      name: "净角",
      color: "from-blue-400 to-blue-600",
      description: "性格刚烈威武的男性",
      ancientName: "花脸",
      img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Guan+Yu+red+white+black+%E4%B8%83%E6%98%9F%E7%97%A3&sign=b14740b3c0f5253b85df870bc64bb16f",
    },
    {
      name: "末角",
      color: "from-yellow-400 to-yellow-600",
      description: "年长沉稳的男性，领导者形象",
      ancientName: "末老",
      img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Song+Jiang+yellow+black+leader&sign=efb561559d70a5be6c700e54a4717b8a",
    },
    {
      name: "丑角",
      color: "from-yellow-300 to-yellow-500",
      description: "滑稽幽默的角色",
      ancientName: "小丑",
      img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Shi+Qian+white+black+comic&sign=2f5e34ac57b6",
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

  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // 所有类型都直接显示专属脸谱图片
      setGeneratedImg(maskTemplates[selectedMask].img);
      setCurrentStep("result");
    }, 1200);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-cover bg-center min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-cinnabar-red/10 flex flex-col relative"
		    style={{ backgroundImage: "url(/drama/bcg.png)", backgroundColor: "#f5f5ef" }}>
      {/* 返回按钮（透明背景，无外框） */}
      <div className="relative z-10 w-full max-w-3xl px-4 pt-6">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-black text-base"
          style={{ fontFamily: titleFont, letterSpacing: "0.04em" }}
          aria-label="返回上一页"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="10" x2="4" y2="10" />
            <polyline points="11 17 4 10 11 3" />
          </svg>
          返回
        </button>
      </div>
				<div className="flex-1 text-center">
					{/* 居中标题 —— 纯白 */}
      <h1
        className="text-center text-[36px] md:text-[44px] font-bold tracking-widest text-white"
        style={{
          fontFamily: titleFont,
          letterSpacing: "0.06em",
          color: "#ffffff", // 直接强制纯白
          textShadow:
            "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
        }}
      >
        梨园春秋
      </h1>
      <p
        className="text-center text-[24px] md:text-[24px] font-bold tracking-widest text-white"
        style={{
          fontFamily: titleFont,
          letterSpacing: "0.06em",
          color: "#ffffff", // 直接强制纯白
          textShadow:
            "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
        }}
      >
        脸谱传神
      </p>
          </div>
      {/* 主要内容区域 */}
      <div className="mt-4 relative z-10 px-6">
        {currentStep === "upload" && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-6">
                <div className="-mt-4 w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cinnabar-red to-ancient-gold rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-ivory-white" />
                </div>
                <h2 className="-mt-6 text-xl font-bold ancient-title text-ink-black mb-2">上传照片</h2>
                <p className="ancient-text text-deep-ink text-sm leading-relaxed">
                  上传您的照片，我们将为您生成独特的戏曲脸谱形象，融合东坡诗词的文化韵味
                </p>
              </div>
              <div
                onClick={triggerUpload}
                className="-mt-4 border-2 border-dashed border-ancient-gold/30 rounded-lg p-8 cursor-pointer hover:border-ancient-gold/50 transition-colors text-center"
              >
                <Upload className="w-12 h-12 text-ancient-gold/50 mx-auto mb-3" />
                <p className="ancient-text text-deep-ink mb-1">点击上传照片</p>
                <p className="text-xs ancient-text text-deep-ink/70">支持 JPG、PNG 格式</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </Card>
            <Card className="-mt-4 p-4 bg-ancient-gold border-ancient-gold/20 mb-6 bg-white/60 backdrop-blur-sm border border-black/10">
              <div className="-mt-2 flex items-center mb-2">
                <span className="text-2xl mr-2">🎭</span>
                <h4 className="font-bold ancient-title text-ink-black">宋代戏曲文化</h4>
              </div>
              <ul className="-mt-2 ancient-text text-deep-ink text-sm list-disc pl-5 space-y-1">
                <li>宋代是中国戏曲艺术的重要发展期</li>
                <li>脸谱艺术体现了中国传统美学</li>
                <li>不同脸谱代表不同的性格特征</li>
                <li>戏曲融合了诗词、音乐、舞蹈等艺术</li>
                <li>梨园文化承载深厚的历史底蕴</li>
              </ul>
            </Card>
          </motion.div>
        )}
        {currentStep === "select" && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
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
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">选择脸谱类型</h3>
              <div className="space-y-3 mb-6">
                {maskTemplates.map((mask, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMask(index)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left select-none focus:outline-none ${
                      selectedMask === index
                        ? "border-cinnabar-red bg-ancient-gold/10 shadow-lg scale-105"
                        : "border-gray-200 hover:border-ancient-gold/50 hover:scale-105"
                    }`}
                    style={{ boxShadow: selectedMask === index ? '0 0 0 2px #d7262b' : undefined, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(.4,2,.6,1)' }}
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
            <Card className="-mt-2 ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-6">
                <h2 className="-mt-2 text-xl font-bold ancient-title text-ink-black mb-2">您的专属脸谱</h2>
              </div>
              <div className="-mt-3 relative w-64 h-64 mx-auto mb-6">
                {generatedImg && (
                  <img
                    src={generatedImg}
                    alt="Face painting result"
                    className="w-full h-full object-cover rounded-lg border-4 border-ancient-gold/30 shadow-lg"
                  />
                )}
              </div>
              <Card className="-mt-2 p-4 bg-ancient-gold/5 border-ancient-gold/20 mb-6">
                <h4 className="font-bold ancient-title text-ink-black mb-2 text-center">东坡诗韵融入</h4>
                <p className="-mt-2 ancient-text text-deep-ink text-center mb-2">"人生如戏，戏如人生"</p>
                <p className="-mt-2 text-sm ancient-text text-deep-ink text-center">
                  您的{maskTemplates[selectedMask].ancientName}脸谱融合了苏东坡的人生哲学，展现了宋代文人的风雅与豪放
                </p>
              </Card>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="text-center mb-6"
              >
              </motion.div>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setCurrentStep("upload")
                    setUploadedImage(null)
                    setGeneratedImg(null)
                  }}
                  variant="outline"
                  className="-mt-2 w-full border-cinnabar-red text-cinnabar-red bg-transparent"
                >
                  重新制作
                </Button>
                <Link href="/report">
                  <Button className="mt-4 w-full ancient-button">查看成就报告 →</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
