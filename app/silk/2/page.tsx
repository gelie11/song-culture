"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Coins, Gem, User, Home, Factory } from "lucide-react";
import BackgroundImage from "@/public/silk/background2.png"; // 假设图片路径
import Image from "next/image"; // 导入 Image 组件

type Pattern = {
  name: string;
  ancientName: string;
  description: string;
};

type Fabric = {
  pattern: Pattern;
  color: string;
  colorName: string;
};

type Customer = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  preferredPatterns: string[];
  preferredColors: string[];
  dialogue: {
    satisfied: string;
    neutral: string;
    unsatisfied: string;
  };
};

export default function LuoJinShop() {
  // 店铺状态
  const [reputation, setReputation] = useState(0);
  const [inventory, setInventory] = useState<Fabric[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);

  // 交易状态
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [transactionResult, setTransactionResult] = useState("");
  const [recentTransactions, setRecentTransactions] = useState<string[]>([]);

  // 客户配置
  const customerTypes: Customer[] = [
    {
      id: "scholar",
      name: "士大夫",
      description: "偏好典雅含蓄的纹样",
      icon: <User className="w-5 h-5" />,
      preferredPatterns: ["云纹", "牡丹"],
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
      preferredPatterns: ["凤凰", "龙纹"],
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
      preferredPatterns: ["牡丹", "云纹"],
      preferredColors: ["from-purple-400 to-purple-600", "from-orange-400 to-orange-600"],
      dialogue: {
        satisfied: "好！此等好货必能卖个好价钱！",
        neutral: "马马虎虎，价钱可不能太高。",
        unsatisfied: "这种货色，卖不出去的！"
      }
    }
  ];

  // 初始化示例库存
  useEffect(() => {
    const exampleInventory: Fabric[] = [
      //   {
      //     pattern: {
      //       name: "云纹",
      //       ancientName: "祥云纹",
      //       description: "祥云缭绕，寓意吉祥如意"
      //     },
      //     color: "from-blue-400 to-blue-600",
      //     colorName: "天青"
      //   },
      //   {
      //     pattern: {
      //       name: "凤凰",
      //       ancientName: "凤鸟纹",
      //       description: "凤凰于飞，象征高贵典雅"
      //     },
      //     color: "from-red-400 to-red-600",
      //     colorName: "朱红"
      //   },
      //   {
      //     pattern: {
      //       name: "牡丹",
      //       ancientName: "富贵花",
      //       description: "花开富贵，寓意繁荣昌盛"
      //     },
      //     color: "from-purple-400 to-purple-600",
      //     colorName: "绛紫"
      //   },
      //   {
      //     pattern: {
      //       name: "龙纹",
      //       ancientName: "应龙纹",
      //       description: "龙腾四海，威严神圣之象"
      //     },
      //     color: "from-yellow-400 to-yellow-600",
      //     colorName: "金黄"
      //   }
    ];

    setInventory(exampleInventory);

    // 加载本地存储数据
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

  // 接待客户
  const greetCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setSelectedFabric(null);
    setTransactionResult("");
  };

  // 进行交易
  const attemptTransaction = () => {
    if (!currentCustomer || !selectedFabric) return;

    const isPatternMatch = currentCustomer.preferredPatterns.includes(selectedFabric.pattern.name);
    const isColorMatch = currentCustomer.preferredColors.includes(selectedFabric.color);

    let result = "";
    let repChange = 0;

    if (isPatternMatch && isColorMatch) {
      repChange = 3;
      result = `${currentCustomer.dialogue.satisfied} (声望+3)`;
    } else if (isPatternMatch || isColorMatch) {
      repChange = 1;
      result = `${currentCustomer.dialogue.neutral} (声望+1)`;
    } else {
      result = currentCustomer.dialogue.unsatisfied;
    }

    setReputation(prev => prev + repChange);
    setTransactionResult(result);
    setRecentTransactions(prev => [result, ...prev.slice(0, 3)]);

    if (repChange > 0) {
      setInventory(prev => prev.filter(item => item !== selectedFabric));
    }

    setSelectedFabric(null);
  };

  // 关闭教程
  const closeTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src="/silk/background3.png" // 替换为你的背景图路径
        alt="丝绸店铺背景"
        fill
        priority
        quality={100}
        className="object-cover brightness-100"
        sizes="100vw"
      />
      {/* 直接删除遮罩层div */}

      {/* 内容容器 - 移除backdrop-blur等效果 */}
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
            <div className="absolute bottom-0 right-[40%]">
              <div className="bg-black/30 px-4 py-2 rounded-full text-white backdrop-blur-sm border border-white/20">
                <Factory className="w-4 h-4 inline mr-2" />
                声望: <span className="font-bold">{reputation}</span>
              </div>
            </div>
            {/* <div className="bg-black/30 px-4 py-2 rounded-full text-white backdrop-blur-sm border border-white/20">
              <Coins className="w-4 h-4 inline mr-2" />
              库存布料: <span className="font-bold">{inventory.length}匹</span>
            </div> */}
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

        {/* 客户选择区 - 修改为横向布局 */}
        <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h2 className="text-lg font-bold text-stone-800 mb-3">接待顾客</h2>
          <div className="flex justify-between gap-2">
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

        {/* 库存展示 - 横向排列 */}
        <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h2 className="text-lg font-bold text-stone-800 mb-3">库存布料</h2>
          {inventory.length === 0 ? (
            <div className="text-center py-4 text-stone-500">
              暂无库存，请先织造布料
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {inventory.map((fabric, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${selectedFabric === fabric
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-200 bg-white"
                    }`}
                >
                  <div
                    className={`w-24 h-24 rounded mb-2 ${fabric.color}`}
                    onClick={() => setSelectedFabric(fabric)}
                  />
                  <p className="text-sm font-medium text-center">{fabric.pattern.name}</p>
                  <p className="text-xs text-stone-600 text-center">{fabric.colorName}</p>
                </div>
              ))}
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
                <div className="bg-stone-100 p-4 rounded-lg">
                  <h3 className="font-medium text-stone-800 mb-2">交易评估</h3>
                  <div className="flex gap-4">
                    <div className={`p-2 rounded ${currentCustomer.preferredPatterns.includes(selectedFabric.pattern.name)
                        ? "bg-green-100 text-green-800"
                        : "bg-stone-200 text-stone-800"
                      }`}>
                      {currentCustomer.preferredPatterns.includes(selectedFabric.pattern.name) ? "✓" : "✗"} 纹样
                    </div>
                    <div className={`p-2 rounded ${currentCustomer.preferredColors.includes(selectedFabric.color)
                        ? "bg-green-100 text-green-800"
                        : "bg-stone-200 text-stone-800"
                      }`}>
                      {currentCustomer.preferredColors.includes(selectedFabric.color) ? "✓" : "✗"} 颜色
                    </div>
                  </div>
                </div>

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

        {/* 交易结果 */}
        {transactionResult && (
          <Card className={`mb-6 ${transactionResult.includes("+3")
              ? "bg-green-50 border-green-200"
              : transactionResult.includes("+1")
                ? "bg-amber-50 border-amber-200"
                : "bg-stone-100 border-stone-200"
            }`}>
            <div className="p-4">
              <h3 className="font-bold mb-1">交易结果</h3>
              <p>{transactionResult}</p>
            </div>
          </Card>
        )}

        {/* 底部导航 */}
        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
          <Link href="/silk">
            <Button variant="outline" className="gap-2">
              <Factory className="w-4 h-4" />
              前往织造工坊
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}