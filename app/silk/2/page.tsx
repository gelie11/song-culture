"use client"

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card } from "@/components/ui/card"; // 引入Card组件
import Link from "next/link"

// 假设这是你的背景图，请替换为实际路径
import EndPageBackground from "@/public/silk/background5.png";

export default function SilkEndPage() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/poetry"); // 替换为你的诗词页面路径
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景图 */}
      <Image
        src={EndPageBackground}
        alt="织造成就背景"
        fill
        priority
        quality={100}
        className="object-cover brightness-90"
        sizes="100vw"
      />

      

      {/* 主要内容容器 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
        {/* 成就标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold tracking-wider text-stone-800 md:text-5xl">
            锦绣天成 · 织造圆满
          </h1>
          <p className="mt-2 text-lg text-stone-600">
            声望已超过 10，你已成为宋代织造名家！
          </p>
        </motion.div>

        

        {/* 总结文案卡片 (仿罗锦铺样式) */}
        <Card className="ancient-card mb-8 w-full max-w-2xl bg-gradient-to-br from-ivory-white to-rice-paper p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
            className="space-y-4 text-stone-700"
          >
            {[
              "采桑养蚕，缫丝织锦——",
              "你已完整体验宋代丝绸的华美技艺。",
              "从经纬交织到纹样设计，",
              "每一匹罗锦都承载着千年匠心。",
            ].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg md:text-xl"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        </Card>

        {/* 下一站卡片 */}
        <Card className="ancient-card w-full max-w-md bg-gradient-to-br from-ivory-white to-rice-paper p-6">
          <div className="space-y-4">
            <p className="text-stone-600">继续你的文化探索之旅</p>
            
              <div className="space-y-3">
                <Link href="/poetry">
                  <Button className="w-full ancient-button">下一站：诗词风雅 →</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-bamboo-green text-bamboo-green bg-transparent">
                    返回首页
                  </Button>
                </Link>
              </div>
           
          </div>
        </Card>

        {/* 底部装饰文字 */}
        <div className="absolute bottom-6 left-0 right-0">
          <p className="text-sm text-stone-500">丝绸之路 · 文化传承</p>
          <div className="mx-auto mt-2 h-px w-32 bg-stone-400/30" />
        </div>
      </div>
    </div>
  );
}