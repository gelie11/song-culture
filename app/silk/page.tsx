"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Palette, Sparkles, Coins, Gem, User, Home, Factory } from "lucide-react";


// 导入透明PNG图案
import CloudPattern from "@/public/silk/1.png";
import PhoenixPattern from "@/public/silk/2.png";
import PeonyPattern from "@/public/silk/3.png";
import DragonPattern from "@/public/silk/4.png";
import BackgroundImage from "@/public/silk/background2.png";

export default function SilkPage() {
  const [currentStep, setCurrentStep] = useState("weaving");
  const [weavingProgress, setWeavingProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [selectedColor, setSelectedColor] = useState("from-red-400 to-red-600");
  const [isWeaving, setIsWeaving] = useState(false);
  const [showFinalDesign, setShowFinalDesign] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 纹样配置 - 使用透明PNG图片
  const patterns = [
    {
      name: "云纹",
      description: "祥云缭绕，寓意吉祥如意",
      ancientName: "祥云纹",
      image: CloudPattern,
      bgColor: "bg-blue-100/30"
    },
    {
      name: "凤凰",
      description: "凤凰于飞，象征高贵典雅",
      ancientName: "凤鸟纹",
      image: PhoenixPattern,
      bgColor: "bg-red-100/30"
    },
    {
      name: "牡丹",
      description: "花开富贵，寓意繁荣昌盛",
      ancientName: "富贵花",
      image: PeonyPattern,
      bgColor: "bg-pink-100/30"
    },
    {
      name: "龙纹",
      description: "龙腾四海，威严神圣之象",
      ancientName: "应龙纹",
      image: DragonPattern,
      bgColor: "bg-yellow-100/30"
    },
  ];

  // 颜色配置
  const colors = [
    { name: "朱红", value: "from-red-400 to-red-600" },
    { name: "金黄", value: "from-yellow-400 to-yellow-600" },
    { name: "碧绿", value: "from-green-400 to-green-600" },
    { name: "天青", value: "from-blue-400 to-blue-600" },
    { name: "绛紫", value: "from-purple-400 to-purple-600" },
    { name: "墨黑", value: "from-gray-700 to-gray-900" },
    { name: "雪白", value: "from-gray-100 to-gray-300" },
    { name: "橙黄", value: "from-orange-400 to-orange-600" },
  ];

  const handleWeaving = () => {
    if (weavingProgress >= 100) {
      setWeavingProgress(0);
      setShowFinalDesign(false);
    }
    
    setIsWeaving(true);
    const interval = setInterval(() => {
      setWeavingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWeaving(false);
          return 100;
        }
        return prev + 3;
      });
    }, 100);
  };

  const handleDesignComplete = () => {
    setShowFinalDesign(true);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
    
      {/* 丝绸纹理背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-plum-purple/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cinnabar-red/20 to-transparent" />
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
                      className={`absolute w-full h-1 bg-gradient-to-r ${selectedColor} rounded-full`}
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
              
              {/* 四个正方形纹样按钮 - 使用透明PNG图片 */}
              <div className="flex justify-between mb-6">
                {patterns.map((pattern, index) => (
                  <div key={index} className="flex flex-col items-center w-1/4 px-1">
                    <button
                      onClick={() => setSelectedPattern(index)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all relative overflow-hidden ${
                        selectedPattern === index
                          ? "border-ancient-gold"
                          : "border-gray-200 hover:border-ancient-gold/50"
                      } ${pattern.bgColor}`}
                      aria-label={`选择${pattern.name}图案`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <img 
                          src={pattern.image.src} 
                          alt={pattern.name}
                          className="w-full h-full object-contain"
                          style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.2))" }}
                        />
                      </div>
                    </button>
                    <p className="text-xs font-bold ancient-title text-ink-black mt-2 text-center">
                      {pattern.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* 独立颜色选择器 */}
              <div className="mb-6">
                <div className="flex justify-center mb-2">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`w-64 h-8 rounded-full transition-all bg-gradient-to-r ${selectedColor} shadow-md hover:scale-105 flex items-center justify-center`}
                    aria-label="选择颜色"
                  >
                    <span className="text-xs text-white font-bold ancient-text">
                      当前颜色: {colors.find(c => c.value === selectedColor)?.name}
                    </span>
                  </button>
                </div>

                {/* 颜色选择面板 */}
                {showColorPicker && (
                  <div className="grid grid-cols-4 gap-2 p-3 bg-white/30 rounded-lg">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className={`h-8 rounded-full bg-gradient-to-r ${color.value} ${
                          selectedColor === color.value ? "ring-2 ring-offset-2 ring-ancient-gold" : ""
                        }`}
                        aria-label={`选择${color.name}颜色`}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 纹样描述 */}
              <div className="mb-6 p-3 bg-white/30 rounded-lg">
                <p className="text-xs ancient-text text-deep-ink">
                  <span className="font-bold">{patterns[selectedPattern].ancientName}</span>:{" "}
                  {patterns[selectedPattern].description}
                </p>
              </div>

              <Button
                onClick={handleWeaving}
                disabled={isWeaving}
                className="w-full ancient-button text-lg py-3 mb-4"
              >
                {isWeaving ? "织造中..." : weavingProgress >= 100 ? "再次织造" : "开始织造"}
              </Button>

              {/* 新增底部导航 */}
              <div className="flex flex-wrap justify-between gap-4 mt-4">
                <Link href="/">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Home className="w-4 h-4" />
                    返回首页
                  </Button>
                </Link>
                <Link href="/silk/2">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Factory className="w-4 h-4" />
                    前往罗锦铺
                  </Button>
                </Link>
              </div>
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
                  基于您选择的{patterns[selectedPattern].ancientName}纹样和{colors.find(c => c.value === selectedColor)?.name}颜色，为您设计宋代风格华服
                </p>
              </div>

              {/* 服饰设计预览 */}
              <div className="relative w-48 h-64 mx-auto mb-6 bg-gradient-to-b from-ivory-white to-rice-paper rounded-lg border-4 border-ancient-gold/30 shadow-lg">
                <div
                  className={`absolute inset-4 bg-gradient-to-b ${selectedColor} rounded-lg opacity-80`}
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
                  className={`absolute -left-6 top-12 w-12 h-24 bg-gradient-to-b ${selectedColor} rounded-l-full opacity-80`}
                />
                <div
                  className={`absolute -right-6 top-12 w-12 h-24 bg-gradient-to-b ${selectedColor} rounded-r-full opacity-80`}
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
                  className={`w-full h-full bg-gradient-to-b ${selectedColor} rounded-full relative shadow-lg`}
                >
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-ivory-white rounded-full" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs">😊</div>
                  <div className="absolute inset-2 border border-white/30 rounded-full" />
                </motion.div>
              </div>

              <p className="ancient-text text-deep-ink mb-6">
                恭喜您成功创作出精美的{patterns[selectedPattern].ancientName}纹样{colors.find(c => c.value === selectedColor)?.name}华服！
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
  );
}