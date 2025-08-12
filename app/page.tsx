"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

<<<<<<< HEAD
=======
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
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
export default function HomePage() {
  const [currentPoetry, setCurrentPoetry] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [inkDrops, setInkDrops] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [userData, setUserData] = useState<{ username: string; account: string; avatar: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const poetryLines = [
    "明月几时有，把酒问青天",
    "不知天上宫阙，今夕是何年",
    "我欲乘风归去，又恐琼楼玉宇",
    "高处不胜寒，起舞弄清影",
    "何似在人间",
  ];

  const culturalModules = [
    {
      id: "porcelain",
      title: "青瓷雅韵",
      subtitle: "宋窑神工",
      icon: "🏺",
      image: "/culturalModel/porcelain.png",
      path: "/porcelain",
      color: "from-jade-green to-deep-jade",
      description: "体验宋代制瓷工艺的精妙",
    },
    {
      id: "tea",
      title: "茶禅一味",
      subtitle: "东坡品茗",
      icon: "🍵",
      image: "/culturalModel/tea.png",
      path: "/tea",
      color: "from-bamboo-green to-jade-green",
      description: "感受宋代茶文化的深邃",
    },
    {
      id: "silk",
      title: "锦绣华章",
      subtitle: "丝路织梦",
      icon: "🧵",
      image: "/culturalModel/silk.png",
      path: "/silk",
      color: "from-plum-purple to-cinnabar-red",
      description: "领略宋代织锦的华美",
    },
    {
      id: "poetry",
      title: "诗词风雅",
      subtitle: "墨韵千秋",
      icon: "📜",
      image: "/culturalModel/poetry.png",
      path: "/poetry",
      color: "from-ink-black to-deep-ink",
      description: "品味宋词的韵律之美",
    },
    {
      id: "drama",
      title: "梨园春秋",
      subtitle: "脸谱传神",
      icon: "🎭",
      path: "/drama",
      image: "/culturalModel/drama.png",
      color: "from-cinnabar-red to-deep-red",
      description: "探索戏曲艺术的魅力",
    },
<<<<<<< HEAD
  ];
=======
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
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6

  useEffect(() => {
    const userJson = localStorage.getItem("loggedInUser");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserData(user);
        setShowWelcome(false);
      } catch (error) {
        console.error("解析用户数据失败:", error);
        router.push("/login");
      }
    } else {
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false);
        router.push("/login");
      }, 2000);
      return () => clearTimeout(welcomeTimer);
    }
<<<<<<< HEAD

=======
    // 诗词轮播
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
    const poetryTimer = setInterval(() => {
      setCurrentPoetry((prev) => (prev + 1) % poetryLines.length);
    }, 3000);

    const drops = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setInkDrops(drops);

    return () => {
      clearInterval(poetryTimer);
    };
  }, [router]);
<<<<<<< HEAD

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

=======
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  // 修改头像功能
  const handleAvatarChange = (selectedAvatar: string) => {
    if (userData) {
      // 创建新的用户对象，保留其他数据
      const updatedUser = {
        ...userData,
        avatar: selectedAvatar
      };
      
      // 更新状态和本地存储
      setUserData(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      
      setShowAvatarModal(false);
    }
  };

  // 生成随机头像
  const generateRandomAvatar = (): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `https://i.pravatar.cc/150?u=${timestamp}-${randomString}`;
  };

  // 欢迎动画
  if (!userData && showWelcome) {
    return (
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
<<<<<<< HEAD
=======
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl font-bold text-ancient-gold 
              tracking-wide font-['KaiTi']"
            >
              臨安錄
            </motion.div>
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
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

<<<<<<< HEAD
  if (!userData) {
    return null;
  }

=======
  if (!loggedInUser) {
    // 欢迎动画结束后但未登录时，不渲染任何内容，等待重定向
    return null;
  }
  // 正常主页内容
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center font-inter bg-gray-50"
      style={{ backgroundImage: `url('chushijiemian.jpg')` }}
    >
      <style jsx global>{`
        .ancient-pattern {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNjAiIGN5PSI2MC41IiByPSIxMS41IiBmaWxsPSIjRERERUREMyIvPgo8cGF0aCBkPSJNNCA2MC41VjcySDIxLjVWNjAuNUgxOFY1NkgyOVY0Ni41SDE0VjQySDEwVjQ2LjVIMlY1Nkg3VjYwLjVIMTRWNjZIN1Y2OC41SDRWNjAuNVoiIGZpbGw9IiNERERFRDMiLz4KPC9zdmc+');
          opacity: 0.1;
          pointer-events: none;
        }
      `}</style>
      <div className="absolute inset-0 ancient-pattern" />

      {inkDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-3 h-3 rounded-full bg-slate-300 opacity-20 ink-drop"
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
<<<<<<< HEAD

      {/* 内容区域 */}
      <div className="relative z-10 p-6 min-h-screen flex flex-col">
        {/* 顶部头像和账号信息 */}
        <div className="mb-8 flex justify-between items-center">
=======
      <div className="relative z-10 p-6">
        {/*顶部用户信息 */}
        <div className="flex justify-between items-center mb-1">
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center"
          >
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt="用户头像"
                className="w-12 h-12 rounded-full border-2 border-ancient-gold object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ancient-gold to-bronze-gold flex items-center justify-center text-white text-xl font-bold">
                {userData.username?.charAt(0)}
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm text-gray-700">{userData.username}</p>
              <p className="text-xs text-gray-500">账号: {userData.account}</p>
            </div>
          </motion.div>
        </div>

<<<<<<< HEAD
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
=======
        {/* 顶部标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
<<<<<<< HEAD
          <div className="relative">
            <h1 className="text-4xl font-bold ancient-title mb-4 text-black">宋韵漫游</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-bronze-gold mx-auto rounded-full" />
          </div>
        </motion.div>

        {/* 诗词轮播 */}
=======
          <div className="relative badge-container">
            {/* 模拟复古标签背景 */}
            <div className="badge-background" />
            <h2 className="text-3xl font-bold ancient-title text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              宋韵漫游
            </h2>
          </div>
        </motion.div>
        {/* 诗词轮播区域 */}
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
<<<<<<< HEAD
          <Card className="ancient-card p-6 text-center bg-white/20 backdrop-blur-sm shadow-lg border border-white/30">
            <div className="h-16 flex items-center justify-center">
=======
          <Card className="p-6 text-center max-w-md mx-auto bg-transparent border-none"
            style={{
              maxWidth: "400px",
              margin: "0 auto",
              maxHeight: "80px",
            }}
          > {/* 修改为更透明的背景 */}
            <div className="h-10 flex items-center justify-center">
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
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

        {/* 文化模块 */}
        <motion.div
<<<<<<< HEAD
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          {culturalModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
            >
              <Link href={module.path}>
                <Card className="ancient-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/20 backdrop-blur-sm shadow-lg border border-white/30">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold ancient-title text-ink-black mb-1">{module.title}</h3>
                      <p className="text-sm text-ancient-gold font-medium mb-2">{module.subtitle}</p>
                      <p className="text-sm ancient-text text-deep-ink">{module.description}</p>
                    </div>
                    <div className="text-ancient-gold group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 东坡形象 */}
        <motion.div
=======
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" // 用gap-4更宽松
          style={{ maxWidth: "800px", margin: "0 auto", minHeight: "10vh" }} // 宽度加大到800px
        >
<<<<<<< HEAD
          <Card className="ancient-card p-6 bg-white/20 backdrop-blur-sm shadow-lg border border-white/30">
            <div className="relative inline-block mb-4">
=======
          {culturalModules.map((module, index) => {
            const isReport = module.id === "report";
            const unlocked = reportUnlocked;
            return (
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
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

<<<<<<< HEAD
        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-black/70">
            <span className="text-sm ancient-text">点击体验各个文化模块</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-ancient-gold"
            >
              ↑
            </motion.div>
          </div>
=======
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
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
        </motion.div>

        {/* 内容区域右下角设置按钮 */}
        <div className="mt-auto flex justify-end">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
            onClick={() => setShowSettings(!showSettings)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 设置菜单 - 移除了修改名字选项 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            ref={settingsRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-white/80 backdrop-blur-lg rounded-t-2xl shadow-lg p-4 max-w-sm mx-auto"
          >
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAvatarModal(true);
                  setShowSettings(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg bg-white/90 hover:bg-gray-100 transition-all shadow-sm"
              >
                更换头像
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 rounded-lg bg-white/90 hover:bg-red-50 text-red-500 transition-all shadow-sm"
              >
                退出登录
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 更换头像模态框 */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-5 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-3">更换头像</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`cursor-pointer w-14 h-14 rounded-full overflow-hidden border-2 ${
                      userData.avatar === `/avatar${num}.jpg`
                        ? "border-ancient-gold"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleAvatarChange(`/avatar${num}.jpg`)}
                  >
                    <img
                      src={`/avatar${num}.jpg`}
                      alt={`头像 ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div
                  className={`cursor-pointer w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                    userData.avatar && userData.avatar.startsWith("https://")
                      ? "border-ancient-gold"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleAvatarChange(generateRandomAvatar())}
                >
                  <span className="text-xs text-gray-600">随机</span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
<<<<<<< HEAD
  );
}
=======
  )

  
}
>>>>>>> a1df47dfa5971ed52cd6542d0ee04a73178584f6
