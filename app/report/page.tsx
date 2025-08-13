"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ReportScrollPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 展开动画结束后显示按钮
    const timer = setTimeout(() => setShowButton(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/chushijiemian.jpg')" }}
    >
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{ maxWidth: "600px", minHeight: "60vh" }}
      >
        {/* 卷轴容器 */}
        <div
          style={{
            overflow: "hidden",
            position: "relative",
            borderRadius: "1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
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
          <motion.img
            src="/report/画卷.png"
            alt="画卷"
            initial={{ height: 0 }}
            animate={{ height: 1340 }} // 这里用画卷的实际高度
            transition={{ duration: 3, ease: "easeInOut" }}
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />

          {/* 卷轴下端 */}
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 0,
              zIndex: 10,
            }}
            initial={{ y: 0 }}
            animate={{ y: 1340 }} // 跟随展开高度
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

        {showButton && (
          <button
            onClick={() => router.push("/report/1")}
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-lg font-bold text-white shadow hover:scale-105 transition"
          >
            进入成就报告
          </button>
        )}
      </div>
    </div>
  );
}
