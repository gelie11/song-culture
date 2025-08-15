"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ReportScrollPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollHeight = 1100; // 画卷实际高度

  return (
    <div
      className="bg-cover bg-center min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-cinnabar-red/10 flex flex-col relative"
      style={{ backgroundImage: "url('/report/画卷背景.png')",
        backgroundRepeat: "no-repeat", // 新增：背景不重复
        backgroundSize: "cover" // 新增：保持背景图比例覆盖容器
      }}
    >
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{ maxWidth: "600px", minHeight: "60vh" }}
      >
        {/* 卷轴外层固定容器 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: `${scrollHeight}px`, // 固定高度，防止背景被拉长
            borderRadius: "1.5rem",
            overflow: "hidden",
          }}
        >
          {/* 卷轴上端 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <Image
              src="/scroll-top.png"
              alt="卷轴上端"
              width={600}
              height={40}
            />
          </div>

          {/* 画卷本体 */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              overflow: "hidden",
            }}
            initial={{ height: 0 }}
            animate={{ height: scrollHeight }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <Image
              src="/report/画卷3.png"
              alt="画卷"
              width={600}
              height={scrollHeight}
              style={{ display: "block" }}
            />
          </motion.div>

          {/* 卷轴下端 */}
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
            initial={{ top: 0 }}
            animate={{ top: scrollHeight }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <Image
              src="/report/scroll-bottom.png"
              alt="卷轴下端"
              width={600}
              height={40}
            />
          </motion.div>
        </div>
      {/* 按钮槽位：固定高度，不变动布局 */}
<div className="w-full" style={{ height: 116, marginTop: 32, position: "relative" }}>
  <button
    onClick={() => router.push("/report/1")}
    aria-label="进入成就报告"
    className="flex items-center justify-center p-0 border-none outline-none shadow-none
               hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed
               absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    style={{
      width: 300,
      height: 100,
      background: "center / 110% no-repeat url('/login-dl.png')",
      backgroundColor: "transparent",
      boxShadow: "none",
      cursor: "pointer",
      // 初始隐藏，只改变透明度，不改变布局
      opacity: showButton ? 1 : 0,
      pointerEvents: showButton ? "auto" : "none",
      transition: "opacity .35s ease",
    }}
  >
    <span
      className="font-bold text-3xl tracking-wider"
      style={{
        fontFamily: "'KaiTi','STKaiti',serif",
        color: "#5B4636",
        textShadow: "0 1px 1px rgba(255,255,255,.6)",
      }}
    >
      进入成就报告
    </span>
  </button>
</div>

      </div>
    </div>
  );
}
