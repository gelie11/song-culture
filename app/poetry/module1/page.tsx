"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image"

const scenes = [
  {
    name: "钱塘湖春行",
    subtitle: "白居易《钱塘湖春行》",
    image: "/poetry/qiantanghu.jpg",
    video: "/poetry/qiantanghu.mp4",
    poem: [
      "孤山寺北贾亭西，水面初平云脚低。",
      "几处早莺争暖树，谁家新燕啄春泥。",
      "乱花渐欲迷人眼，浅草才能没马蹄。",
      "最爱湖东行不足，绿杨阴里白沙堤。",
    ],
    tags: ["孤山寺", "白沙堤", "春行", "西湖"],
    audio: "/poetry/qiantanghu.mp3",
  },
  {
    name: "饮湖上初晴后雨",
    subtitle: "苏轼《饮湖上初晴后雨》",
    image: "/poetry/yinhu.jpg",
    video: "/poetry/yinhu.mp4",
    poem: ["水光潋滟晴方好，山色空蒙雨亦奇。", "欲把西湖比西子，淡妆浓抹总相宜。"],
    tags: ["水光", "山色", "雨", "西子"],
    audio: "/poetry/yinhu.mp3",
  },
];

export default function Module1() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const titleFont = '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';
  const accent = "#a94438";

  const prev = () => {
    setCurrent((c) => (c === 0 ? scenes.length - 1 : c - 1));
    setShowVideo(false);
  };
  const next = () => {
    setCurrent((c) => (c === scenes.length - 1 ? 0 : c + 1));
    setShowVideo(false);
  };
  const handleRevive = () => setShowVideo((v) => !v);

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/poetry/bcg4.png)" }}
    >
      {/* 返回按钮（只显示图片） */}
<div className="relative z-10 w-full max-w-3xl px-4 pt-6">
  <button
    onClick={() => router.push("/poetry")}
    aria-label="返回上一页"
    className="focus:outline-none"
    style={{
      background: "transparent",
      border: "none",
      padding: 0
    }}
  >
    <Image
      src="/return.png"   // 确保 return.png 放在 public 目录
      alt="返回"
      width={40}          // 这里可以调大小，例如 40
      height={40}
      className="object-contain"
      style={{ opacity: 0.6 }}   // 调整透明度
    />
  </button>
</div>

      {/* 居中标题 —— 纯白 */}
      <h1
        className="-mt-4 text-center text-[36px] md:text-[44px] font-bold tracking-widest text-white"
        style={{
          fontFamily: titleFont,
          letterSpacing: "0.06em",
          color: "#ffffff", // 直接强制纯白
          textShadow:
            "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
        }}
      >
        诗画西湖
      </h1>

      {/* 轮播区 */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-4 flex flex-col items-center">
        <div className="flex items-center justify-center w-full mb-2">
          {/* 左箭头 —— 始终白色 */}
          <button
            onClick={prev}
            className="p-2"
            aria-label="上一张"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="grey"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 20 8 12 16 4" />
            </svg>
          </button>

          {/* 中间：指示点 + 媒体卡片 + 标题/副标题 */}
          <div className="mx-2 flex-1 flex flex-col items-center">
            {/* 指示点 */}
            <div className="flex justify-center mb-2">
              {scenes.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-2 h-2 mx-1 rounded-full ${
                    idx === current ? "bg-[--accent]" : "bg-gray-300"
                  }`}
                  style={{ ["--accent" as any]: accent }}
                />
              ))}
            </div>

            {/* 图片或视频卡片 */}
            <div className="w-80 h-44 rounded-xl overflow-hidden shadow-lg bg-white/85 flex items-center justify-center border border-gray-200">
              {showVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={scenes[current].video}
                    controls
                    autoPlay
                    className="object-cover w-full h-full max-h-72 rounded-xl"
                    style={{ background: "#fff" }}
                    onPlay={() => {
                      const audio = document.getElementById("scene-audio") as HTMLAudioElement;
                      if (audio) {
                        audio.loop = true;
                        audio.play();
                      }
                    }}
                    onPause={() => {
                      const audio = document.getElementById("scene-audio") as HTMLAudioElement;
                      if (audio) audio.pause();
                    }}
                    onEnded={() => {
                      const audio = document.getElementById("scene-audio") as HTMLAudioElement;
                      if (audio) audio.pause();
                    }}
                  />
                  <audio id="scene-audio" src={scenes[current].audio} loop />
                </div>
              ) : (
                <img
                  src={scenes[current].image}
                  alt={scenes[current].name}
                  className="object-cover w-full h-full max-h-72 rounded-xl"
                  style={{ background: "#fff" }}
                />
              )}
            </div>

            {/* 标题与副标题 */}
            <div className="mt-2 text-base font-bold" style={{ color: accent }}>
              {scenes[current].name}
            </div>
            <div className="text-xs text-gray-200 md:text-gray-500 mb-2">
              {scenes[current].subtitle}
            </div>
          </div>

          {/* 右箭头 —— 始终白色 */}
          <button
            onClick={next}
            className="p-2"
            aria-label="下一张"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="grey"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="12 4 20 12 12 20" />
            </svg>
          </button>
        </div>

        {/* 诗词内容 */}
        <div className="w-full bg-white/85 rounded-lg shadow p-4 mb-2 text-center text-gray-700 text-base leading-relaxed">
          {scenes[current].poem.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>

        {/* 标签 + 音频 + 按钮 */}
        <div className="flex flex-col items-center w-full mt-2">
          {/* 标签 */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {scenes[current].tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "#f5e6c8", color: accent }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 音频播放器 */}
          <div className="w-full flex justify-center mb-2 mt-2">
            <audio src={scenes[current].audio} controls className="w-full max-w-xs" loop />
          </div>

          {/* 复活场景按钮 —— 使用图片，完整显示；绝对居中文本 + 放大 */}
          <button
            onClick={handleRevive}
            className="
              relative w-[260px] md:w-[300px] mx-auto
              -mt-8
              p-0 bg-transparent
              border-none outline-none ring-0 shadow-none
              focus:outline-none focus:ring-0
              mt-2
            "
            aria-label="复活场景"
          >
            <img
              src="/poetry/button.png"
              alt=""
              className="block w-full h-auto select-none pointer-events-none"
              draggable={false}
            />
            <span
              className="absolute inset-0 flex items-center justify-center text-white font-extrabold tracking-wide text-xl md:text-2xl"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}
            >
              {showVideo ? "返回图片" : "复活场景"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
