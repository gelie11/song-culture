"use client"; // 标记为客户端组件

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
// Card
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
/**  
 * 应用主页组件
 * 该组件会根据用户登录状态进行渲染，未登录时重定向到认证页面。
 */
export default function HomePage() {
  const [currentPoetry, setCurrentPoetry] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [inkDrops, setInkDrops] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
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
      // subtitle: "宋窑神工",
      icon: "🏺",
      image: "/culturalModel/porcelain.png",
      path: "/porcelain",
      color: "from-jade-green to-deep-jade",
      description: "体验宋代制瓷工艺的精妙",
    },
    {
      id: "tea",
      title: "茶禅一味",
      // subtitle: "东坡品茗",
      icon: "🍵",
      image: "/culturalModel/tea.png",
      path: "/tea",
      color: "from-bamboo-green to-jade-green",
      description: "感受宋代茶文化的深邃",
    },
    {
      id: "silk",
      title: "锦绣华章",
      // subtitle: "丝路织梦",
      icon: "🧵",
      image: "/culturalModel/silk.png",
      path: "/silk",
      color: "from-plum-purple to-cinnabar-red",
      description: "领略宋代织锦的华美",
    },
    {
      id: "poetry",
      title: "诗词风雅",
      // subtitle: "墨韵千秋",
      icon: "📜",
      image: "/culturalModel/poetry.png",
      path: "/poetry",
      color: "from-ink-black to-deep-ink",
      description: "品味宋词的韵律之美",
    },
    {
      id: "drama",
      title: "梨园春秋",
      // subtitle: "脸谱传神",
      icon: "🎭",
      path: "/drama",
      image: "/culturalModel/drama.png",
      color: "from-cinnabar-red to-deep-red",
      description: "探索戏曲艺术的魅力",
    },
    {
      id: "report",
      title: "宋韵报告",
      subtitle: "解锁成就",
      icon: "🔒",
      path: "/report",
      image: "/culturalModel/report.png",
      color: "from-gray-400 to-gray-500",
      description: "完成全部体验后解锁",
      locked: true,
    },
  ]
  // 记录已点击模块
  const [clickedModules, setClickedModules] = useState<Set<string>>(new Set());
  const [reportUnlocked, setReportUnlocked] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
      // 如果已登录，跳过欢迎动画
      setShowWelcome(false);
    } else {
      // 如果未登录，在欢迎动画结束后重定向到认证页面
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false);
        router.push("/login"); // 重定向到新的登录页面
      }, 2000); // 欢迎动画持续 2 秒
      return () => clearTimeout(welcomeTimer);
    }
    // 诗词轮播
    const poetryTimer = setInterval(() => {
      setCurrentPoetry((prev) => (prev + 1) % poetryLines.length);
    }, 3000)

    // 生成水墨滴落效果
    const drops = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setInkDrops(drops)

    return () => {
      clearInterval(poetryTimer)
    }
  }, [router]);
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser"); // 清除登录状态
    router.push("/login"); // 重定向到登录页面
  };
  // 处理模块点击
  const handleModuleClick = (id: string, path: string, locked?: boolean) => {
    if (id === "report" && !reportUnlocked) return;
    if (id !== "report") {
      setClickedModules((prev) => {
        const next = new Set(prev);
        next.add(id);
        // 如果五个模块都点过，解锁 report
        if (next.size === 5) setReportUnlocked(true);
        return next;
      });
    }
    router.push(path);
  };
  // 如果未登录，显示加载或欢迎动画
  if (!loggedInUser && showWelcome) {
    return (
      // 欢迎动画模块
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative flex min-h-screen items-center justify-center bg-cover bg-center font-inter p-4"
          style={{
            backgroundImage: "url('wel.png')",
          }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl font-bold text-ancient-gold 
              tracking-wide font-['KaiTi']"
            >
              臨安錄
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl font-bold ancient-title mb-2"
            >
              宋韵漫游
            </motion.h1>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!loggedInUser) {
    // 欢迎动画结束后但未登录时，不渲染任何内容，等待重定向
    return null;
  }
  // 正常主页内容
  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center font-inter bg-gray-50" // 使用更柔和的背景色，模拟背景图的浅色调
      // 使用占位符图片作为背景，以更好地适应不同屏幕
      style={{ backgroundImage: `url('chushijiemian.jpg')` }}
    >
      <style jsx global>{`
        .ancient-pattern {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNjAiIGN5PSI2MC41IiByPSIxMS41IiBmaWxsPSIjRERERUREMyIvPgo8cGF0aCBkPSJNNCA2MC41VjcySDIxLjVWNjAuNUgxOFY1NkgyOVY0Ni41SDE0VjQySDEwVjQ2LjVIMlY1Nkg3VjYwLjVIMTRWNjZIN1Y2OC41SDRWNjAuNVoiIGZpbGw9IiNERERFRDMiLz4KPC9zdmc+');
          opacity: 0.1;
          pointer-events: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
      <div className="absolute inset-0 ancient-pattern" />

      {/* 水墨滴落效果 */}
      {inkDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-3 h-3 rounded-full bg-slate-300 opacity-20 ink-drop" // 将水墨滴落效果颜色调整为更浅的灰色
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
      <div className="relative z-10 p-6">
        {/*顶部用户信息 */}
        <div className="flex justify-between items-center mb-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-bold ancient-title text-black" // 文字颜色改为黑色，以便在亮背景上可见
          >
            你好，{loggedInUser}
          </motion.div>
          <motion.button
            onClick={handleLogout}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-all shadow-md hover:shadow-lg"
          >
            退出
          </motion.button>
        </div>

        {/* 顶部标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="relative badge-container">
            {/* 模拟复古标签背景 */}
            <div className="badge-background" />
            <h2 className="text-3xl font-bold ancient-title text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              宋韵漫游
            </h2>
          </div>
        </motion.div>
        {/* 诗词轮播区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <Card className="p-6 text-center max-w-md mx-auto bg-transparent border-none"
            style={{
              maxWidth: "400px",
              margin: "0 auto",
              maxHeight: "80px",
            }}
          > {/* 修改为更透明的背景 */}
            <div className="h-10 flex items-center justify-center">
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
                  className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${index === currentPoetry ? "bg-ancient-gold" : "bg-ancient-gold/30"
                    }`}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 文化模块网格：三行两列布局，report初始锁定，全部一屏展示 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" // 用gap-4更宽松
          style={{ maxWidth: "800px", margin: "0 auto", minHeight: "10vh" }} // 宽度加大到800px
        >
          {culturalModules.map((module, index) => {
            const isReport = module.id === "report";
            const unlocked = reportUnlocked;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                <div
                  className={`ancient-card p-4 flex min-h-[140px] flex-col gap-2 cursor-pointer group bg-white/10 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-300
    ${isReport && !unlocked ? "opacity-60 bg-gray-200 cursor-not-allowed" : "hover:shadow-xl"}`}
                  onClick={() => handleModuleClick(module.id, module.path, isReport && !unlocked)}
                  style={{ pointerEvents: isReport && !unlocked ? "none" : "auto" }}
                >
                  {/* 标题单独占一行 */}
                  <h3 className={`text-center text-lg font-bold ${isReport && !unlocked ? "text-gray-500" : "text-ink-black"}`}>
                    {module.title}
                  </h3>

                  {/* 图标 + 副标题 + 描述 一行 */}
                  <div className="flex items-center gap-3">
                    {/* 主页模块背景图代码*/}
                    <div
                      className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center
    ${isReport && !unlocked ? "from-gray-400 to-gray-500" : module.color}`}
                      style={{ minWidth: 48, minHeight: 48 }}
                    >
                      {isReport && !unlocked ? (
                        // 报告锁定时显示锁（保持原来行为）
                        <span className="text-2xl">🔒</span>
                      ) : module.image ? (
                        // 有 image 时显示图片（object-cover 保证不会变形，居中裁切）
                        <img
                          src={module.image}
                          alt={module.title}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        // 回退：没有 image 时显示原来的 icon（emoji）
                        <span className="text-2xl">{module.icon}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isReport && !unlocked ? "text-gray-400" : "text-ancient-gold"}`}>
                        {module.subtitle}
                      </p>
                      <p className={`text-sm ${isReport && !unlocked ? "text-gray-400" : "text-deep-ink"}`}>
                        {module.description}
                      </p>
                    </div>
                    <div className={`transition-transform duration-300 ${isReport && !unlocked ? "text-gray-400" : "text-ancient-gold group-hover:translate-x-2"}`}>
                      {isReport && !unlocked ? "" : "→"}
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  )

  
}
