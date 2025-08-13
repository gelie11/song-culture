"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const STORY_TEXT = `北宋元符三年，东坡自儋州北归，舟至扬子江头，忽见江心月碎如银，水面浮起一卷泛黄诗稿。墨迹漫漶处，竟透出微光 —— 那是他一生遍历的宋韵印记：密州出猎的弓影、黄州雪堂的灯痕、杭州西湖的雨丝…… 时光流转千年，这些印记渐次模糊，化作散落在时空中的碎片。

此刻，你手中的屏幕泛起涟漪，一封烫金邀请函缓缓展开：「吾尝谓世间至美，在诗酒茶瓷之间，在千年未变的匠心之中。今邀君踏月而来，循吾旧迹，拾掇风华，令宋韵重光。」

穿过水墨晕染的时空门，你将先至「宋修复坊」。案上青瓷待补，需你亲手拉坯塑形，以越窑青绿涂釉，凭柴窑火候淬炼 —— 还记得「粉青若冰似玉」的古训吗？成器之时，便可见我当年「玉碗盛来琥珀光」的醉态。

转身入「东坡茶寨」，春风正拂茶园。采一芽一叶，抖、抓、压、扣间，炒出龙井新香。用茶汤写下「日高人渴漫思茶」，那些贬谪路上与茶相伴的日夜，便会随茶香浮现。

再往「宋锦工坊」，看蚕室温湿度里藏的天机，学挽花机上织就的牡丹。为士大夫裁一件缠枝纹罗袍，为宫廷绣一袭绛黄大袖 —— 丝线穿梭处，皆是南宋市井的烟火气。

若还想听戏，不妨画一张「大江东去」纹样的脸谱，唱一段杂剧选段。声落时，西湖十景便会在诗中苏醒：「欲把西湖比西子」的吟唱里，烟柳、晴雨、断桥都会随你指尖重生。

最终，所有修复的碎片将凝成一卷《东坡宋韵长卷》。而你，这位从现代而来的「文化修复师」，终将与我并肩，看千年宋韵在数字时空里，再度流转生辉。`;

export default function StoryPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const totalScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    const duration = 20000; // 20秒，阅读速度更慢

    let start: number | null = null;

    function step(ts: number) {
      if (!scrollRef.current) return;
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      scrollRef.current.scrollTop = totalScroll * progress;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setFadeIn(true);
        setTimeout(() => setShowButton(true), 1200);
      }
    }

    // 延迟 1 秒再开始滚动，避免开头被跳过
    setTimeout(() => {
      requestAnimationFrame(step);
    }, 2000);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 全屏背景 */}
      <Image
        src="/chushijiemian.jpg"
        alt="背景"
        fill
        
        className="object-cover"
      />

      {/* 遮罩层 */}
      <div
        className={`absolute inset-0 transition-all duration-1000 pointer-events-none ${
          fadeIn ? "bg-black/0" : "bg-black/40"
        }`}
      />

      {/* 居中且放大的滚动区域 */}
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-[10%] left-[10%] w-[80%] h-[70%] overflow-hidden 
               transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "1rem",
          boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="text-xl leading-relaxed text-white px-8 py-6"
          style={{ whiteSpace: "pre-line" }}
        >
          {STORY_TEXT}
        </div>
      </motion.div>

      {/* 按钮 */}
      {showButton && (
        <button
          onClick={() => router.push("/")}
          className="fixed left-1/2 bottom-24 -translate-x-1/2 z-20 flex items-center px-8 py-4 rounded-full shadow-lg text-2xl font-bold text-white bg-gradient-to-br from-[#e6d7c3] to-[#b8a07e] border-4 border-[#e6d7c3] hover:scale-105 transition-all"
          style={{
            color: "#5c4322",
            textShadow: "0 2px 8px #fff, 0 1px 0 #e6d7c3",
          }}
        >
          点击开启你的织梦之旅
        </button>
      )}

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  );
}
