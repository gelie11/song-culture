"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Leaf, Flame, Coffee, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

// 照片URL - 实际应用中替换为真实图片
const TEA_PHOTOS = [
  "/tea-photos/1.jpg", "/tea-photos/2.jpg", "/tea-photos/3.jpg",
  "/tea-photos/4.jpg", "/tea-photos/5.jpg", "/tea-photos/6.jpg",
  "/tea-photos/7.jpg", "/tea-photos/8.jpg", "/tea-photos/9.jpg",
];

// 炒茶熔炉状态照片
const ROASTING_FURNACE_PHOTOS = [
  "/tea-photos/cool.png",    // 冷炉状态
  "/tea-photos/warm.png",    // 温热状态
  "/tea-photos/hot.png",     // 高温状态
  "/tea-photos/optimal.png"  // 最佳温度状态
];

export default function TeaPage() {
  // 游戏核心状态
  const [gameStage, setGameStage] = useState<'picking' | 'roasting' | 'brewing' | 'finished'>('picking');
  const [teaQuality, setTeaQuality] = useState({ picking: 0, roasting: 0, brewing: 0 });
  
  // 照片浏览状态
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // 炒茶阶段状态
  const [roastingProgress, setRoastingProgress] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [temperature, setTemperature] = useState(20); // 初始温度20°C
  const [perfectSeconds, setPerfectSeconds] = useState(0);
  const totalRoastSeconds = 12; // 延长总炒制时间至12秒，确保有足够时间达到理想温度
  
  // 温度控制参数 - 加快升温速度
  const HEAT_RATE = 8;  // 每秒升温8°C
  const COOL_RATE = 4;  // 每秒降温4°C
  
  // 定时器引用
  const temperatureInterval = useRef<NodeJS.Timeout | null>(null);
  const roastTimer = useRef<NodeJS.Timeout | null>(null);
  const tempCheckTimer = useRef<NodeJS.Timeout | null>(null);
  
  // 火焰效果状态
  const [fireParticles, setFireParticles] = useState<number[]>([]);
  
  // 泡茶阶段状态
  const [waterLevel, setWaterLevel] = useState(0);
  const [brewingProgress, setBrewingProgress] = useState(0);
  const brewTimer = useRef<NodeJS.Timeout | null>(null);
  
  // 最终评分和诗句
  const [finalScore, setFinalScore] = useState(0);
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  
  // 游戏配置常量
  const IDEAL_TEMP_MIN = 50;    // 理想温度区间最小值
  const IDEAL_TEMP_MAX = 90;    // 理想温度区间最大值
  const OPTIMAL_WATER_LEVEL = 75;
  
  // 茶诗数据
  const teaPoetry = [
    { text: "从来佳茗似佳人", author: "苏轼" },
    { text: "休对故人思故国，且将新火试新茶", author: "苏轼" },
    { text: "分无玉碗捧峨眉，且尽卢仝七碗茶", author: "苏轼" },
    { text: "茶敬客来茶当酒，云山云去云作车", author: "苏轼" },
    { text: "坐酌泠泠水，看煎瑟瑟尘", author: "白居易" },
    { text: "春风解恼撩诗客，新火来烹第一茶", author: "陆游" },
  ];

  // 照片浏览逻辑
  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % TEA_PHOTOS.length);
  };

  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + TEA_PHOTOS.length) % TEA_PHOTOS.length);
  };

  // 根据温度获取对应的熔炉照片
  const getFurnacePhoto = () => {
    if (temperature >= IDEAL_TEMP_MIN && temperature <= IDEAL_TEMP_MAX) {
      return ROASTING_FURNACE_PHOTOS[3]; // 最佳温度
    } else if (temperature > IDEAL_TEMP_MAX) {
      return ROASTING_FURNACE_PHOTOS[2]; // 高温
    } else if (temperature > 30) {
      return ROASTING_FURNACE_PHOTOS[1]; // 温热
    }
    return ROASTING_FURNACE_PHOTOS[0]; // 冷炉
  };

  // =========================================================================
  // 炒茶阶段核心逻辑
  // =========================================================================

  // 开始加热（升温）
  const startHeating = () => {
    setIsHeating(true);
    
    // 清除任何现有温度定时器
    if (temperatureInterval.current) {
      clearInterval(temperatureInterval.current);
    }
    
    // 设置升温定时器 - 更快的升温速度
    temperatureInterval.current = setInterval(() => {
      setTemperature(prev => {
        const newTemp = prev + HEAT_RATE * 0.1; // 每100ms按比例上升
        return Math.min(100, newTemp);
      });
    }, 100);
    
    // 如果尚未开始炒制计时，则启动
    if (!roastTimer.current) {
      startRoastingProcess();
    }
  };

  // 停止加热（降温）
  const stopHeating = () => {
    setIsHeating(false);
    
    // 清除任何现有温度定时器
    if (temperatureInterval.current) {
      clearInterval(temperatureInterval.current);
    }
    
    // 设置降温定时器
    temperatureInterval.current = setInterval(() => {
      setTemperature(prev => {
        const newTemp = prev - COOL_RATE * 0.1; // 每100ms按比例下降
        return Math.max(20, newTemp); // 最低温度保持在20°C
      });
    }, 100);
  };

  // 开始整个炒制过程
  const startRoastingProcess = () => {
    // 重置进度
    setRoastingProgress(0);
    setPerfectSeconds(0);
    
    // 启动主计时器 - 每100ms更新一次进度
    let elapsedSeconds = 0;
    roastTimer.current = setInterval(() => {
      elapsedSeconds += 0.1; // 每次增加0.1秒
      const progress = Math.min(100, (elapsedSeconds / totalRoastSeconds) * 100);
      setRoastingProgress(progress);
      
      // 炒制完成
      if (elapsedSeconds >= totalRoastSeconds) {
        finishRoasting();
      }
    }, 100);
    
    // 启动温度检查器 - 每100ms检查一次温度是否在理想区间
    tempCheckTimer.current = setInterval(() => {
      // 直接使用当前状态值检查
      if (temperature >= IDEAL_TEMP_MIN && temperature <= IDEAL_TEMP_MAX) {
        // 每100ms增加0.1秒完美时间
        setPerfectSeconds(prev => prev + 0.1);
      }
    }, 100);
  };

  // 完成炒制过程
  const finishRoasting = () => {
    // 清除所有定时器
    if (temperatureInterval.current) {
      clearInterval(temperatureInterval.current);
      temperatureInterval.current = null;
    }
    if (roastTimer.current) {
      clearInterval(roastTimer.current);
      roastTimer.current = null;
    }
    if (tempCheckTimer.current) {
      clearInterval(tempCheckTimer.current);
      tempCheckTimer.current = null;
    }
    
    // 计算炒茶评分 (0-100)
    const roastScore = Math.min(100, Math.round((perfectSeconds / totalRoastSeconds) * 100));
    
    // 更新评分并进入下一阶段
    setTeaQuality(prev => ({ ...prev, roasting: roastScore }));
    setGameStage('brewing');
  };

  // 火焰粒子效果
  useEffect(() => {
    if (isHeating) {
      setFireParticles(Array.from({ length: 30 }, (_, i) => i));
    } else {
      setFireParticles([]);
    }
  }, [isHeating]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (temperatureInterval.current) clearInterval(temperatureInterval.current);
      if (roastTimer.current) clearInterval(roastTimer.current);
      if (tempCheckTimer.current) clearInterval(tempCheckTimer.current);
      if (brewTimer.current) clearInterval(brewTimer.current);
    };
  }, []);

  // 定时切换诗句
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoetryIndex(prev => (prev + 1) % teaPoetry.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // =========================================================================
  // 泡茶阶段逻辑
  // =========================================================================

  const addWater = () => {
    if (waterLevel < 100) {
      const addAmount = Math.floor(Math.random() * 5) + 5; // 5-9之间的随机数
      setWaterLevel(prev => Math.min(100, prev + addAmount));
    }
  };

  const startBrewing = () => {
    if (brewTimer.current) return;
    
    setBrewingProgress(0);
    brewTimer.current = setInterval(() => {
      setBrewingProgress(prev => {
        if (prev >= 100) {
          clearInterval(brewTimer.current!);
          setGameStage('finished');
          // 计算泡茶评分
          const waterScore = 100 - Math.min(100, Math.abs(waterLevel - OPTIMAL_WATER_LEVEL) * 2);
          setTeaQuality(prev => ({ ...prev, brewing: waterScore }));
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  // =========================================================================
  // 游戏结束评分计算
  // =========================================================================
  useEffect(() => {
    if (gameStage === 'finished') {
      // 计算最终得分（权重分配）
      const finalScore = Math.round(
        teaQuality.picking * 0.4 + 
        teaQuality.roasting * 0.4 + 
        teaQuality.brewing * 0.2
      );
      setFinalScore(finalScore);
    }
  }, [gameStage, teaQuality]);

  // 重置游戏
  const resetGame = () => {
    // 清理所有定时器
    if (temperatureInterval.current) clearInterval(temperatureInterval.current);
    if (roastTimer.current) clearInterval(roastTimer.current);
    if (tempCheckTimer.current) clearInterval(tempCheckTimer.current);
    if (brewTimer.current) clearInterval(brewTimer.current);
    
    // 重置所有状态
    setGameStage('picking');
    setRoastingProgress(0);
    setTemperature(20);
    setWaterLevel(0);
    setBrewingProgress(0);
    setFinalScore(0);
    setTeaQuality({ picking: 0, roasting: 0, brewing: 0 });
    setCurrentPhotoIndex(0);
    setPerfectSeconds(0);
    setIsHeating(false);
    setFireParticles([]);
  };

  // 渲染当前游戏阶段
  const renderCurrentStage = () => {
    switch (gameStage) {
      case 'picking':
        return (
          <motion.div
            key="picking"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-4">
                <Leaf className="w-12 h-12 text-bamboo-green mx-auto mb-2" />
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">茶文化之旅</h2>
                <p className="ancient-text text-deep-ink leading-relaxed text-sm">
                  请滑动浏览宋代茶文化图片，了解传统制茶工艺
                </p>
              </div>
              
              {/* 照片浏览区域 */}
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <div className="relative w-full h-full">
                  <img 
                    src={TEA_PHOTOS[currentPhotoIndex]} 
                    className="w-full h-full object-cover transition-opacity duration-300"
                    alt={`茶文化图片 ${currentPhotoIndex + 1}`}
                  />
                  
                  {/* 导航按钮 */}
                  <button 
                    onClick={goToPrevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button 
                    onClick={goToNextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* 照片指示器 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {TEA_PHOTOS.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentPhotoIndex ? 'bg-bamboo-green' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm text-deep-ink">
                {currentPhotoIndex + 1} / {TEA_PHOTOS.length}
              </div>
              
              <Button
                onClick={() => {
                  setTeaQuality(prev => ({ ...prev, picking: 100 }));
                  setGameStage('roasting');
                }}
                className="w-full mt-6 ancient-button text-lg"
              >
                继续炒茶 →
              </Button>
            </Card>
          </motion.div>
        );
        
      case 'roasting':
        return (
          <motion.div
            key="roasting"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-4">
                <Flame className="w-12 h-12 text-cinnabar-red mx-auto mb-2" />
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">文火炒制</h2>
                <p className="ancient-text text-deep-ink leading-relaxed text-sm">
                  按住按钮加热，将温度维持在<strong className="text-cinnabar-red">{IDEAL_TEMP_MIN}°C - {IDEAL_TEMP_MAX}°C</strong>区间内，持续{totalRoastSeconds}秒。
                </p>
              </div>
              
              {/* 炒茶区域 */}
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md mx-auto">
                  {/* 熔炉照片 */}
                  <img 
                    src={getFurnacePhoto()} 
                    className="w-full h-full object-cover rounded-lg shadow-md"
                    alt={`炒茶熔炉 (${temperature.toFixed(1)}°C)`}
                  />
                  
                  {/* 火焰效果 */}
                  {isHeating && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-24 pointer-events-none">
                      {fireParticles.map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-6 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full"
                          style={{ left: `${randFloat(-40, 40)}px`, bottom: "0px" }}
                          animate={{ 
                            height: [8, 24, 8], 
                            opacity: [0.8, 0.3, 0.8], 
                            y: [0, -randFloat(10, 30), 0] 
                          }}
                          transition={{ 
                            duration: randFloat(1, 2.5), 
                            repeat: Number.POSITIVE_INFINITY, 
                            delay: i * randFloat(0.1, 0.4) 
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* 温度计 */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-gray-200 rounded-full flex items-center overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transition-all duration-300" style={{ 
                      width: `${IDEAL_TEMP_MAX - IDEAL_TEMP_MIN}%`, 
                      marginLeft: `${IDEAL_TEMP_MIN}%` 
                    }}></div>
                    <div className="absolute h-full bg-gradient-to-r from-blue-400 via-yellow-500 to-red-600 rounded-full transition-all duration-300" style={{ width: `${temperature}%` }}></div>
                    <p className="absolute left-1/2 -translate-x-1/2 text-sm text-white font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <Button
                  onMouseDown={startHeating}
                  onMouseUp={stopHeating}
                  onTouchStart={startHeating}
                  onTouchEnd={stopHeating}
                  disabled={roastingProgress >= 100}
                  className={`w-full ancient-button text-lg py-3 ${
                    isHeating ? 'bg-cinnabar-red hover:bg-red-700' : ''
                  }`}
                >
                  {roastingProgress >= 100 ? "炒制完成" : isHeating ? "加热中..." : "按住加热"}
                </Button>
                
                {/* 进度条 */}
                <div className="ancient-progress h-3 relative mt-4 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-bamboo-green to-jade-green rounded-full"
                    style={{ width: `${roastingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* 状态信息 */}
                <div className="flex justify-between text-xs mt-1 ancient-text text-deep-ink">
                  <span>炒制进度: {Math.round(roastingProgress)}%</span>
                  <span>完美时间: {perfectSeconds.toFixed(1)}s</span>
                </div>
              </div>
            </Card>
          </motion.div>
        );
        
      case 'brewing':
        return (
          <motion.div
            key="brewing"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-4">
                <Coffee className="w-12 h-12 text-bronze-gold mx-auto mb-2" />
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">品茗之乐</h2>
                <p className="ancient-text text-deep-ink leading-relaxed text-sm">
                  请按"加水"按钮，将水加到合适的位置（最佳水位: {OPTIMAL_WATER_LEVEL}%），然后点击"泡茶"。
                </p>
              </div>
              
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="relative w-36 h-40 bg-gray-100 rounded-b-full border-4 border-gray-400 overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 w-full"
                    style={{
                      height: `${waterLevel}%`,
                      background: `linear-gradient(to top, #5d4037, #8d6e63)`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute w-full h-1 bg-green-500" style={{ top: `${100 - OPTIMAL_WATER_LEVEL}%` }} />
                  <div className="absolute top-0 left-0 w-full h-8 bg-gray-300 rounded-t-full border-b-4 border-gray-400" />
                  <div className="absolute top-8 left-4 w-28 h-4 bg-gray-200 rounded-full" />
                  <div className="absolute top-0 left-8 w-2 h-8 bg-gray-400 rounded-t-full" />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  水位: {waterLevel}%
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <Button
                  onClick={addWater}
                  disabled={waterLevel >= 100}
                  className="w-full ancient-button text-lg py-3"
                >
                  加水
                </Button>
                <Button
                  onClick={startBrewing}
                  disabled={brewingProgress > 0 || waterLevel === 0}
                  className="w-full ancient-button text-lg py-3 bg-bamboo-green hover:bg-jade-green"
                >
                  {brewingProgress > 0 ? "泡茶中..." : "开始泡茶"}
                </Button>
              </div>
            </Card>
          </motion.div>
        );
        
      case 'finished':
        const pickingScore = 100;
        const roastingScore = Math.round(teaQuality.roasting);
        const brewingScore = Math.round(teaQuality.brewing);
        
        return (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 bg-gradient-to-br from-bamboo-green/10 to-ancient-gold/10">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-bamboo-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold ancient-title text-ink-black mb-2">茶道之旅，大功告成！</h3>
                <p className="ancient-text text-deep-ink mb-4">
                  恭喜您成功制作了宋代好茶，最终品质评分：
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="text-6xl font-extrabold text-ancient-gold my-4"
                >
                  {finalScore}
                </motion.div>
                <p className="ancient-text text-deep-ink mb-6">
                  {finalScore >= 80 ? "茶香四溢，妙手回春！" : 
                   finalScore >= 60 ? "滋味尚可，再接再厉！" : 
                   "茶汤略淡，仍需钻研。"}
                </p>
                
                {/* 详细评分 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                    <div className="text-bamboo-green font-bold">文化学习</div>
                    <div className="text-2xl font-bold">{pickingScore}</div>
                    <div className="text-xs text-gray-600">满分</div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                    <div className="text-cinnabar-red font-bold">炒制</div>
                    <div className="text-2xl font-bold">{roastingScore}</div>
                    <div className="text-xs text-gray-600">完美时间: {perfectSeconds.toFixed(1)}s</div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                    <div className="text-bronze-gold font-bold">冲泡</div>
                    <div className="text-2xl font-bold">{brewingScore}</div>
                    <div className="text-xs text-gray-600">水位: {waterLevel}%</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={resetGame} className="w-full ancient-button text-lg">
                      重新体验
                  </Button>
                  <Link href="/silk">
                    <Button className="w-full ancient-button text-lg">
                      下一站：锦绣华章 →
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full border-bamboo-green text-bamboo-green bg-transparent hover:bg-bamboo-green/10">
                      返回首页
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-bamboo-green/10 relative overflow-hidden">
      <style jsx global>{`
        .ancient-progress {
          background-color: #e6d9c9;
          border-radius: 9999px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .ancient-button {
          background: linear-gradient(to bottom, #d4a017, #b8860b);
          color: white;
          border: none;
          border-radius: 9999px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .ancient-button:hover {
          background: linear-gradient(to bottom, #b8860b, #9a6d0a);
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        .ancient-button:active {
          transform: translateY(1px);
        }
        .ancient-card {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2d5c0;
        }
        .ancient-title {
          font-family: 'SimSun', serif;
          letter-spacing: 1px;
        }
        .ancient-text {
          font-family: 'KaiTi', serif;
        }
        /* 自定义颜色 */
        .bamboo-green {
          color: #2e7d32;
        }
        .jade-green {
          color: #00a86b;
        }
        .cinnabar-red {
          color: #c53030;
        }
        .bronze-gold {
          color: #cd7f32;
        }
        .ancient-gold {
          color: #d4af37;
        }
        .ink-black {
          color: #2d2d2d;
        }
        .deep-ink {
          color: #3d3d3d;
        }
        .ivory-white {
          color: #fffff0;
        }
        .rice-paper {
          color: #f5f5f0;
        }
      `}</style>
      <div className="absolute inset-0">
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
        <Card className="ancient-card p-4 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div className="text-center h-20 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPoetryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <p className="text-lg ancient-text text-deep-ink mb-1">{teaPoetry[currentPoetryIndex].text}</p>
                <p className="text-xs text-ancient-gold ancient-text">—— {teaPoetry[currentPoetryIndex].author}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>

      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          {renderCurrentStage()}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 辅助函数
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
    