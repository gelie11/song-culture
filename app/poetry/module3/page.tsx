"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image"

export default function Module3() {
  const router = useRouter();

  // 题库
  const poems = [
    {
      title: "饮湖上初晴后雨",
      author: "苏轼",
      image: "/poetry/yinhu.jpg",
      audio: "/poetry/yinhu.mp3",
      options: ["饮湖上初晴后雨", "钱塘湖春行", "江雪", "山居秋暝"],
      answer: "饮湖上初晴后雨",
      tips: [
        "诗中描写了晴雨变化下的西湖美景",
        "有“水光潋滟”“山色空蒙”等意象",
        "表达了诗人对西湖的赞美",
      ],
    },
    {
      title: "钱塘湖春行",
      author: "白居易",
      image: "/poetry/qiantanghu.jpg",
      audio: "/poetry/qiantanghu.mp3",
      options: ["钱塘湖春行", "饮湖上初晴后雨", "江雪", "山居秋暝"],
      answer: "钱塘湖春行",
      tips: [
        "诗中描写了湖光山色的美景",
        "出现了早莺、新燕、乱花、浅草等意象",
        "表达了诗人对西湖春天的热爱",
      ],
    },
  ];

  // 统一风格
  const titleFont =
    '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';
  const accent = "#a94438";

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 切换诗词
  const handleChangePoem = () => {
    setCurrent((c) => (c + 1) % poems.length);
    setSelected(null);
    setShowTips(false);
    setShowResult(false);
    setIsCorrect(false);
    setShowCelebrate(false);
  };

  // 提交答题
  const handleSubmit = () => {
    if (!selected) return;
    const correct = selected === poems[current].answer;
    setIsCorrect(correct);
    setShowResult(true);
    setShowCelebrate(correct);
    if (correct) {
      setScore((s) => s + 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }, 300);
    }
  };

  // 再猜一次
  const handleRetry = () => {
    setSelected(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowCelebrate(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/poetry/bcg4.png)", backgroundColor: "#f5f5ef" }}
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
        看图猜诗
      </h1>

      {/* 主内容卡片：半透明 + 毛玻璃 */}
      <div className="relative z-10 w-full max-w-md px-4 mt-2">
        {/* 图片区 */}
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl shadow-xl p-3 border border-black/5">
          <img
            src={poems[current].image}
            alt="AI意境图"
            className="w-full rounded-xl object-cover border border-black/10"
            style={{ maxHeight: 260 }}
          />
          <div className="text-center text-xs text-white/90 md:text-gray-600 mt-2">
            AI生成的古诗词意境图
          </div>
        </div>

        {/* 提示区 */}
        <div className="mt-4 bg-white/75 backdrop-blur-sm rounded-2xl shadow border border-black/5 p-4 flex items-start">
          <div className="flex-1">
            <div
              className="font-bold mb-1"
              style={{ color: accent }}
            >
              内涵意象
            </div>
            <ul className="text-sm text-gray-800 list-disc pl-5">
              {showTips
                ? poems[current].tips.map((t, i) => <li key={i}>{t}</li>)
                : <li>点击右侧按钮可查看提示</li>}
            </ul>
          </div>
          <button
            className="ml-4 px-4 py-1 rounded border text-sm hover:brightness-110"
            style={{ background: "#fff", color: accent, borderColor: "#e6d3b3" }}
            onClick={() => setShowTips((v) => !v)}
          >
            {showTips ? "收起提示" : "请求提示"}
          </button>
        </div>

        {/* 选项区 */}
        <div className="mt-1 w-full max-w-md flex flex-col items-center mb-4 mt-6">
            <div className="grid grid-cols-2 gap-3 w-full mb-3">
                {poems[current].options.map(opt => (
                <button
                    key={opt}
                    className={`py-3 rounded-lg border text-base font-medium transition-all
                    ${selected === opt ? 'border-[#a94438] bg-[#f7e7e1] text-[#a94438]' : 'border-[#e6d3b3] bg-white text-gray-800 hover:border-[#a94438]'}`}
                    onClick={()=>setSelected(opt)}
                    disabled={showResult}
                >
                    {opt}
                </button>
                ))}
            </div>

            {/* 输入区 */}
            <div className="flex w-full mb-3">
                <input
                className="flex-1 px-3 py-1.5 rounded-l-lg border border-[#e6d3b3] text-base focus:outline-none"
                placeholder="输入诗名或诗句...（选填）"
                disabled={showResult}
                />
                <button
                className="px-6 py-1.5 rounded-r-lg bg-[#a94438] text-white font-bold text-base hover:bg-[#c45c3b] transition"
                onClick={handleSubmit}
                disabled={!selected || showResult}
                >
                猜诗
                </button>
            </div>
        </div>

        {/* 分数显示 */}
        <div
          className="-mt-4 mb-3 text-right font-bold"
          style={{ color: accent }}
        >
          分数：{score}
        </div>
      </div>

      {/* 结果弹窗 */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] flex flex-col items-center relative">
            {showCelebrate && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                🎉
              </div>
            )}
            <div
              className="text-2xl font-bold mb-4"
              style={{ color: isCorrect ? "#16a34a" : "#dc2626" }}
            >
              {isCorrect ? "恭喜你，答对啦！" : "很遗憾，答错了"}
            </div>
            <div className="text-lg mb-2">
              当前分数：<span className="font-bold" style={{ color: accent }}>{score}</span>
            </div>
            {isCorrect && (
              <audio
                ref={audioRef}
                src={poems[current].audio}
                autoPlay
                controls
                className="mx-auto border rounded mt-2"
              />
            )}
            <div className="flex gap-4 mt-6 w-full">
              <button
                className="flex-1 py-2 text-white rounded-lg font-bold text-lg shadow hover:brightness-110"
                style={{ background: accent }}
                onClick={handleRetry}
              >
                再猜一次
              </button>
              <button
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg shadow"
                onClick={handleChangePoem}
              >
                换一题
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
