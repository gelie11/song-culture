"use client"

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Palette, Sparkles, Coins, Gem, User, Home, Factory } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation'  // 不是 'next/router'


// 导入透明PNG图案
import BackgroundImage from "@/public/silk/background2.png";
import BackgroundImage3 from "@/public/silk/background3.png";
import Pattern1 from "@/public/silk/1/stripe_0_style_0.png";
import Pattern2 from "@/public/silk/1/stripe_0_style_1.png";
import Pattern3 from "@/public/silk/1/stripe_0_style_2.png";
import Pattern4 from "@/public/silk/1/stripe_0_style_3.png";
import Pattern5 from "@/public/silk/1/stripe_0_style_4.png";
import Pattern6 from "@/public/silk/1/stripe_1_style_0.png";
import Pattern7 from "@/public/silk/1/stripe_1_style_1.png";
import Pattern8 from "@/public/silk/1/stripe_1_style_2.png";
import Pattern9 from "@/public/silk/1/stripe_1_style_3.png";
import Pattern10 from "@/public/silk/1/stripe_1_style_4.png";
import Pattern11 from "@/public/silk/1/stripe_2_style_0.png";
import Pattern12 from "@/public/silk/1/stripe_2_style_1.png";
import Pattern13 from "@/public/silk/1/stripe_2_style_2.png";
import Pattern14 from "@/public/silk/1/stripe_2_style_3.png";
import Pattern15 from "@/public/silk/1/stripe_2_style_4.png";
import Pattern16 from "@/public/silk/1/stripe_3_style_0.png";
import Pattern17 from "@/public/silk/1/stripe_3_style_1.png";
import Pattern18 from "@/public/silk/1/stripe_3_style_2.png";
import Pattern19 from "@/public/silk/1/stripe_3_style_3.png";
import Pattern20 from "@/public/silk/1/stripe_3_style_4.png";
import Pattern21 from "@/public/silk/1/stripe_4_style_0.png";
import Pattern22 from "@/public/silk/1/stripe_4_style_1.png";
import Pattern23 from "@/public/silk/1/stripe_4_style_2.png";
import Pattern24 from "@/public/silk/1/stripe_4_style_3.png";
import Pattern25 from "@/public/silk/1/stripe_4_style_4.png";

type Pattern = {
  name: string;
  ancientName: string;
  description: string;
};

type Fabric = {
  pattern: Pattern;

  count: number; // 新增数量字段
};

type Customer = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  likedPatternIds: number[];  // 改为使用ID并重命名
  dislikedPatternIds: number[]; // 新增不喜欢纹样
  preferredColors: string[];
  dialogue: {
    satisfied: string;
    neutral: string;
    unsatisfied: string;
  };
};

export default function SilkPage() {
  const router = useRouter();
  // 添加状态来控制是否跳转
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showTransactionResult, setShowTransactionResult] = useState(false);
  // 添加滑动控制函数
  const scrollShop = (direction: 'left' | 'right') => {
    if (!shopScrollRef.current) return;
    const container = shopScrollRef.current;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const shopScrollRef = useRef<HTMLDivElement>(null);
  const clearInventory = () => {
    setInventory([]); // 清空库存
    localStorage.removeItem("luojinShopData"); // 同时清除本地存储
  };
  const isAddingRef = useRef(false); // 添加一个标记防止重复增加

  const intervalRef = useRef<NodeJS.Timeout>(); // 将ref移到组件顶层
  // 织造工坊状态
  const [currentStep, setCurrentStep] = useState("weaving");
  const [weavingProgress, setWeavingProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);

  const [isWeaving, setIsWeaving] = useState(false);
  const [showFinalDesign, setShowFinalDesign] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternImgRef = useRef<HTMLImageElement>(null);
  const [patternSlices, setPatternSlices] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [patternSize, setPatternSize] = useState({ width: 300, height: 300 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 罗锦铺状态
  const [reputation, setReputation] = useState(0);
  const [inventory, setInventory] = useState<Fabric[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [transactionResult, setTransactionResult] = useState("");
  const [recentTransactions, setRecentTransactions] = useState<string[]>([]);

  const patterns = [
    { id: 1, image: Pattern1, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
    { id: 2, image: Pattern2, name: "凤凰", ancientName: "凤鸟纹", description: "凤凰于飞，象征高贵典雅" },
    { id: 3, image: Pattern3, name: "牡丹", ancientName: "富贵花", description: "花开富贵，寓意繁荣昌盛" },
    { id: 4, image: Pattern4, name: "龙纹", ancientName: "应龙纹", description: "龙腾四海，威严神圣之象" },
    { id: 5, image: Pattern5, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
    { id: 6, image: Pattern6, name: "凤凰", ancientName: "凤鸟纹", description: "凤凰于飞，象征高贵典雅" },
    { id: 7, image: Pattern7, name: "牡丹", ancientName: "富贵花", description: "花开富贵，寓意繁荣昌盛" },
    { id: 8, image: Pattern8, name: "龙纹", ancientName: "应龙纹", description: "龙腾四海，威严神圣之象" },
    { id: 9, image: Pattern9, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
    { id: 10, image: Pattern10, name: "凤凰", ancientName: "凤鸟纹", description: "凤凰于飞，象征高贵典雅" },
    { id: 11, image: Pattern11, name: "牡丹", ancientName: "富贵花", description: "花开富贵，寓意繁荣昌盛" },
    { id: 12, image: Pattern12, name: "龙纹", ancientName: "应龙纹", description: "龙腾四海，威严神圣之象" },
    { id: 13, image: Pattern13, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
    { id: 14, image: Pattern14, name: "凤凰", ancientName: "凤鸟纹", description: "凤凰于飞，象征高贵典雅" },
    { id: 15, image: Pattern15, name: "牡丹", ancientName: "富贵花", description: "花开富贵，寓意繁荣昌盛" },
    { id: 16, image: Pattern16, name: "龙纹", ancientName: "应龙纹", description: "龙腾四海，威严神圣之象" },
    { id: 17, image: Pattern17, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
    { id: 18, image: Pattern18, name: "凤凰", ancientName: "凤鸟纹", description: "凤凰于飞，象征高贵典雅" },
    { id: 19, image: Pattern19, name: "牡丹", ancientName: "富贵花", description: "花开富贵，寓意繁荣昌盛" },
    { id: 20, image: Pattern20, name: "龙纹", ancientName: "应龙纹", description: "龙腾四海，威严神圣之象" },
    { id: 21, image: Pattern21, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
    { id: 22, image: Pattern22, name: "凤凰", ancientName: "凤鸟纹", description: "凤凰于飞，象征高贵典雅" },
    { id: 23, image: Pattern23, name: "牡丹", ancientName: "富贵花", description: "花开富贵，寓意繁荣昌盛" },
    { id: 24, image: Pattern24, name: "龙纹", ancientName: "应龙纹", description: "龙腾四海，威严神圣之象" },
    { id: 25, image: Pattern25, name: "云纹", ancientName: "祥云纹", description: "祥云缭绕，寓意吉祥如意" },
  ];



  // 客户配置
  const customerTypes: Customer[] = [
    {
      id: "scholar",
      name: "士大夫",
      description: "偏好典雅含蓄的纹样",
      icon: <User className="w-5 h-5" />,
      likedPatternIds: [1, 3, 4, 5, 6, 8, 9, 11, 13, 14, 15, 21, 23, 24], // 喜欢云纹(id:1)和牡丹(id:3)
      dislikedPatternIds: [2, 7, 12, 17, 19, 20, 22], // 不喜欢凤凰(id:2)和龙纹(id:4)
      preferredColors: ["from-blue-400 to-blue-600", "from-gray-100 to-gray-300"],
      dialogue: {
        satisfied: "此等雅致纹样，正合吾心！",
        neutral: "尚可，然非上品。",
        unsatisfied: "此等俗物，岂能入眼？"
      }
    },
    {
      id: "palace",
      name: "宫廷",
      description: "偏好华丽贵气的纹样",
      icon: <Gem className="w-5 h-5" />,
      likedPatternIds: [2, 7, 12, 16, 17, 18, 19], // 喜欢云纹(id:1)和牡丹(id:3)
      dislikedPatternIds: [1, 3, 5, 6, 8, 10, 11, 13, 15, 21, 23, 25], // 不喜欢凤凰(id:2)和龙纹(id:4)
      preferredColors: ["from-red-400 to-red-600", "from-yellow-400 to-yellow-600"],
      dialogue: {
        satisfied: "此等华美锦缎，当献于圣上！",
        neutral: "可作常服之用。",
        unsatisfied: "如此粗劣，也敢呈上？"
      }
    },
    {
      id: "merchant",
      name: "商人",
      description: "偏好吉祥富贵的纹样",
      icon: <Coins className="w-5 h-5" />,
      likedPatternIds: [10, 22, 25], // 喜欢云纹(id:1)和牡丹(id:3)
      dislikedPatternIds: [4, 9, 14, 16, 18, 20, 24], // 不喜欢凤凰(id:2)和龙纹(id:4)
      preferredColors: ["from-purple-400 to-purple-600", "from-orange-400 to-orange-600"],
      dialogue: {
        satisfied: "好！此等好货必能卖个好价钱！",
        neutral: "马马虎虎，价钱可不能太高。",
        unsatisfied: "这种货色，卖不出去的！"
      }
    }
  ];

  const handleWeaving = () => {
    if (weavingProgress >= 100) {
      setWeavingProgress(0);
      setShowFinalDesign(false);
      return;
    }

    setIsWeaving(true);
    const interval = setInterval(() => {
      setWeavingProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 3, 100); // 确保不超过 100

        if (newProgress >= 100 && !isAddingRef.current) {
          clearInterval(interval);
          setIsWeaving(false);
          isAddingRef.current = true; // 标记为正在添加

          setInventory((prevInventory) => {
            const newPattern = patterns[selectedPattern];
            const existingIndex = prevInventory.findIndex(
              item => item.pattern.name === newPattern.name
            );

            const updatedInventory = existingIndex >= 0
              ? prevInventory.map((item, index) =>
                index === existingIndex
                  ? { ...item, count: item.count + 1 }
                  : item
              )
              : [
                ...prevInventory,
                {
                  pattern: {
                    name: newPattern.name,
                    ancientName: newPattern.ancientName,
                    description: newPattern.description
                  },
                  count: 1
                }
              ];

            isAddingRef.current = false; // 重置标记
            return updatedInventory;
          });

          return 100;
        }
        return newProgress;
      });
    }, 100);
  };
  // 清理effect
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleDesignComplete = () => {
    setShowFinalDesign(true);
  };

  // 监听声望变化
  useEffect(() => {
    if (reputation >= 10 && !shouldRedirect) {
      // 设置2秒延迟后跳转
      const timer = setTimeout(() => {
        router.push('/silk/2');  // 跳转到目标页
      clearInventory();        // 清空当前库存
      setShouldRedirect(true); // 标记已跳转（防止重复触发）
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [reputation, shouldRedirect, router]);

  // 修改图像加载部分的代码
  useEffect(() => {
    if (!canvasRef.current || !patterns[selectedPattern]?.image?.src) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 修改这里 - 使用浏览器原生的Image构造函数
    const img = document.createElement('img'); // 或者使用 new window.Image()
    img.src = patterns[selectedPattern].image.src;

    img.onload = () => {
      const originalRatio = img.width / img.height;
      const displayWidth = 300;
      const displayHeight = displayWidth / originalRatio;

      setPatternSize({ width: displayWidth, height: displayHeight });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const slices: string[] = [];
      const sliceHeight = img.height / 100;

      for (let i = 0; i < 100; i++) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = 1;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        tempCtx.drawImage(
          canvas,
          0, i * sliceHeight, img.width, 1,
          0, 0, img.width, 1
        );

        slices.push(tempCanvas.toDataURL());
      }

      setPatternSlices(slices);
    };

    // 添加错误处理
    img.onerror = () => {
      console.error('Failed to load image:', patterns[selectedPattern].image.src);
    };
  }, [selectedPattern]);

  const getPatternLineData = (progress: number) => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const yPos = Math.floor((progress / 100) * canvas.height);
    const imageData = ctx.getImageData(0, yPos, canvas.width, 1);
    return imageData;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  // 罗锦铺功能
  const greetCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setSelectedFabric(null);
    setTransactionResult("");
  };

  const attemptTransaction = () => {
    if (!currentCustomer || !selectedFabric) return;

    // 获取当前纹样ID
    const patternId = patterns.find(p => p.name === selectedFabric.pattern.name)?.id;
    if (!patternId) return;

    let result = "";
    let repChange = 0;

    // 判断喜好
    if (currentCustomer.likedPatternIds.includes(patternId)) {
      // 喜欢的情况
      repChange = 3;
      result = `${currentCustomer.dialogue.satisfied} (声望+3)`;
    } else if (currentCustomer.dislikedPatternIds.includes(patternId)) {
      // 不喜欢的情况
      repChange = -1; // 可以设置扣分
      result = `${currentCustomer.dialogue.unsatisfied} (声望-1)`;
    } else {
      // 中立情况
      repChange = 1;
      result = `${currentCustomer.dialogue.neutral} (声望+1)`;
    }

    setReputation(prev => Math.max(0, prev + repChange)); // 确保声望不低于0
    setTransactionResult(result);
    setShowTransactionResult(true); // 显示结果

    // 2秒后自动隐藏
    setTimeout(() => {
      setShowTransactionResult(false);
    }, 2000);
    setRecentTransactions(prev => [result, ...prev.slice(0, 3)]);

    // 交易成功才移除库存
    if (repChange > 0) {
      setInventory(prev =>
        prev.map(item =>
          item === selectedFabric
            ? { ...item, count: item.count - 1 }
            : item
        ).filter(item => item.count > 0)
      );
    }

    setSelectedFabric(null);
  };


  const closeTutorial = () => {
    setShowTutorial(false);
  };

  // 加载本地存储数据
  useEffect(() => {
    const savedData = localStorage.getItem("luojinShopData");
    if (savedData) {
      const { rep, inv } = JSON.parse(savedData);
      setReputation(rep);
      if (inv.length > 0) setInventory(inv);
      setShowTutorial(false);
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem(
      "luojinShopData",
      JSON.stringify({
        rep: reputation,
        inv: inventory
      })
    );
  }, [reputation, inventory]);

  // 渲染织造工坊页面
  const renderWeavingPage = () => (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 隐藏的canvas用于处理纹样数据 */}
      <canvas
        ref={canvasRef}
        className="hidden"
        style={{ display: 'none' }}
      />
      {/* 预加载纹样图片但隐藏 */}
      <img
        ref={patternImgRef}
        src={patterns[selectedPattern].image.src}
        alt="pattern-source"
        className="hidden"
      />
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
        {/* 织机可视化区域 */}
        <Card className="ancient-card p-3 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div
            ref={containerRef}
            className="relative mx-auto"
            style={{
              width: `${patternSize.width}px`,
              height: `${patternSize.height}px`
            }}
          >
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

            {/* 纬线织造 - 保持原始比例 */}
            <div className="absolute inset-6 overflow-hidden">
              <div className="absolute inset-0">
                {Array.from({ length: Math.min(weavingProgress, 100) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.01 }}
                    className="absolute w-full"
                    style={{
                      top: `${i}%`,
                      height: "1%",
                      backgroundImage: patternSlices[i] ? `url(${patternSlices[i]})` : "none",
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat"
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-70`}
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 梭子 */}
            {isWeaving && (
              <motion.div
                className="absolute w-6 h-1 bg-bronze-gold rounded-full z-10"
                style={{ top: `${Math.floor(weavingProgress / 4) * 4 + 24}px` }}
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
          {/* 新增的文字描述 */}
          <p className="text-center text-sm mt-4 ancient-text text-deep-ink">
            采棉纺纱成线，经线固定，<br></br>纬线穿梭交织，捶打紧实成布。
          </p>
        </Card>

        {/* 纹样选择区域 */}
        <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <h3 className="text-lg font-bold ancient-title text-ink-black mb-4 text-center">选择纹样</h3>

          <div className="relative">
            {/* 左滑动按钮 */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
            >
              &lt;
            </button>

            {/* 纹样滑动容器 */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide space-x-4 px-8 py-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="flex-shrink-0 w-20 h-20 relative"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <button
                    onClick={() => setSelectedPattern(pattern.id - 1)}
                    className={`w-full h-full rounded-lg border-2 transition-all ${selectedPattern === pattern.id - 1
                      ? "border-ancient-gold shadow-md"
                      : "border-gray-200 hover:border-ancient-gold/50"
                      }`}
                  >
                    <img
                      src={pattern.image.src}
                      alt={`纹样 ${pattern.id}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* 右滑动按钮 */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
            >
              &gt;
            </button>
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
              <Button
                variant="outline"
                className="gap-2 w-full sm:w-auto"
                onClick={clearInventory} // 添加点击事件
              >
                <Home className="w-4 h-4" />
                返回首页
              </Button>
            </Link>
            <Button
              onClick={() => setCurrentStep("shop")}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Factory className="w-4 h-4" />
              前往罗锦铺
            </Button>
          </div>
        </Card>

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

  // 渲染罗锦铺页面
  const renderShopPage = () => (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src={BackgroundImage3}
        alt="丝绸店铺背景"
        fill
        priority
        quality={100}
        className="object-cover brightness-100"
        sizes="100vw"
      />

      {/* 内容容器 */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {/* 店铺标题和状态 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black drop-shadow-lg">
              <span className="px-3 py-1 rounded-full"></span>
            </h1>
            <p className="text-black/80 drop-shadow-md">江南丝绸，天下闻名</p>
          </div>

          <div className="relativemin-h-[20px]">
            <div className="absolute top-19 right-[3%]">
              <div className="bg-black/30 px-4 py-2 rounded-full text-white backdrop-blur-sm border border-white/20">
                <Factory className="w-4 h-4 inline mr-2" />
                声望: <span className="font-bold">{reputation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 新手教程 */}
        {showTutorial && (
          <Card className="mb-6 bg-amber-50 border-amber-200 relative">
            <div className="p-4 md:p-6">
              <h2 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Gem className="w-5 h-5" />
                罗锦铺指南
              </h2>
              <div className="text-amber-900 space-y-2">
                <p>1. 选择不同类型的客户接待</p>
                <p>2. 从库存中选择合适的布料进行交易</p>
                <p>3. 匹配客户偏好可获得更高声望</p>
                <p>4. 声望提升将解锁更多特权</p>
              </div>
            </div>
            <Button
              onClick={closeTutorial}
              size="sm"
              className="absolute top-2 right-2 bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              知道了
            </Button>
          </Card>
        )}

        {/* 客户选择区 */}
        <Card className="ancient-card p-3 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h2 className="text-lg font-bold text-stone-800 mb-3">接待顾客</h2>
          <div className="flex justify-between gap-1">
            {customerTypes.map(customer => (
              <button
                key={customer.id}
                onClick={() => greetCustomer(customer)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${currentCustomer?.id === customer.id
                  ? "border-amber-500 bg-amber-100"
                  : "border-stone-200 hover:border-amber-300 bg-white"
                  }`}
              >
                <div className={`p-1 rounded-full ${currentCustomer?.id === customer.id
                  ? "text-amber-600"
                  : "text-stone-600"
                  }`}>
                  {customer.icon}
                </div>
                <span>{customer.name}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="ancient-card p-3 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h2 className="text-lg font-bold text-stone-800 mb-3">库存布料</h2>
          {inventory.length === 0 ? (
            <div className="text-center py-4 text-stone-500">
              暂无库存，请先织造布料
            </div>
          ) : (
            <div className="relative">
              {/* 左滑动按钮 */}
              <button
                onClick={() => scrollShop('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
              >
                &lt;
              </button>

              {/* 滑动容器 */}
              <div
                ref={shopScrollRef}
                className="flex overflow-x-auto scrollbar-hide space-x-4 px-8 py-2"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {inventory.map((fabric, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-24 relative"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div
                      className={`p-1 rounded-lg border-2 ${selectedFabric === fabric
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-200 bg-white"
                        }`}
                    >
                      <div
                        className="w-full h-24 rounded mb-2 bg-contain bg-center bg-no-repeat bg-white"
                        style={{
                          backgroundImage: `url(${patterns.find(p => p.name === fabric.pattern.name)?.image.src})`,
                          backgroundSize: '80%'
                        }}
                        onClick={() => setSelectedFabric(fabric)}
                      />

                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {fabric.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 右滑动按钮 */}
              <button
                onClick={() => scrollShop('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
              >
                &gt;
              </button>
            </div>
          )}
        </Card>

        {/* 交易区域 */}
        {currentCustomer && (
          <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                {currentCustomer.icon}
              </div>
              <div>
                <h2 className="font-bold text-stone-800">当前客户: {currentCustomer.name}</h2>
                <p className="text-sm text-stone-600">{currentCustomer.description}</p>
              </div>
            </div>

            {selectedFabric && (
              <div className="space-y-4">


                <Button
                  onClick={attemptTransaction}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  与{currentCustomer.name}交易
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 替换原有的交易结果显示部分 */}
        {showTransactionResult && transactionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-40 left-[42%] transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg ${transactionResult.includes("+3")
              ? "bg-green-100 border-green-200 text-green-800"
              : transactionResult.includes("-1")
                ? "bg-red-100 border-red-200 text-red-800"
                : "bg-amber-100 border-amber-200 text-amber-800"
              }`}
          >
            {transactionResult}
          </motion.div>
        )}

        {/* 底部导航 */}
        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={clearInventory} // 添加点击事件
            >
              <Home className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
          <Button
            onClick={() => setCurrentStep("weaving")}
            variant="outline"
            className="gap-2"
          >
            <Factory className="w-4 h-4" />
            前往织造工坊
          </Button>
        </div>
      </div>
    </div>
  );

  // 根据当前步骤渲染不同页面
  return currentStep === "weaving" ? renderWeavingPage() : renderShopPage();
}
