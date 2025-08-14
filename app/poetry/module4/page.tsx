"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const poems = [
  {
    title: "钱塘湖春行",
    author: "白居易",
    content:
      "孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。乱花渐欲迷人眼，浅草才能没马蹄。最爱湖东行不足，绿杨阴里白沙堤。",
    keywords: [
      { word: "孤山寺", correct: true },
      { word: "白沙堤", correct: true },
      { word: "春泥", correct: true },
      { word: "西湖", correct: false },
      { word: "山色", correct: false },
      { word: "西子", correct: false },
    ],
    image: "/poetry/qiantanghu.jpg",
    audio: "/poetry/qiantanghu.mp3",
    comment: "/poetry/qiantanghu.mp3",
  },
  {
    title: "饮湖上初晴后雨",
    author: "苏轼",
    content:
      "水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。",
    keywords: [
      { word: "水光", correct: true },
      { word: "山色", correct: true },
      { word: "西湖", correct: true },
      { word: "孤山寺", correct: false },
      { word: "春泥", correct: false },
      { word: "白沙堤", correct: false },
    ],
    image: "/poetry/yinhu.jpg",
    audio: "/poetry/yinhu.mp3",
    comment: "/poetry/yinhu.mp3",
  },
];

export default function Module4() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showAudio, setShowAudio] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const accent = "#a94438";
  const titleFont =
    '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';

  // 选择关键词，最多选3个
  const handleKeywordClick = (idx: number) => {
    if (selected.includes(idx) || selected.length >= 3) return;
    setSelected([...selected, idx]);
  };

  // 检查是否全部选对
  const handleCheck = () => {
    if (selected.length === 3) {
      const allCorrect = selected.every(
        (i) => poems[current].keywords[i].correct
      );
      if (allCorrect) {
        setScore(2);
        setShowAudio(true);
        setShowFull(true);
        setShowResult(true);
      } else {
        setScore(0);
        setShowResult(true);
        setShowFull(false);
      }
    }
  };

  // 重新选
  const handleRetry = () => {
    setSelected([]);
    setShowResult(false);
    setShowAudio(false);
    setShowFull(false);
  };

  // 更换诗词
  const handleChangePoem = () => {
    setCurrent((c) => (c + 1) % poems.length);
    setShowResult(false);
    setScore(0);
    setShowAudio(false);
    setShowFull(false);
    setSelected([]);
  };

  const correctCount = selected.filter(
    (i) => poems[current].keywords[i]?.correct
  ).length;
  const progress = Math.round((correctCount / 3) * 100);

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden bg-cover bg-center pb-10"
      style={{ backgroundImage: "url(/poetry/bcg4.png)", backgroundColor: "#f5f5ef" }}
    >
    {/* 返回按钮（透明背景，无外框） */}
      <div className="relative z-10 w-full max-w-3xl px-4 pt-6">
        <button
          onClick={() => router.push("/poetry")}
          className="inline-flex items-center gap-2 text-black text-base"
          style={{ fontFamily: titleFont, letterSpacing: "0.04em" }}
          aria-label="返回上一页"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="10" x2="4" y2="10" />
            <polyline points="11 17 4 10 11 3" />
          </svg>
          返回
        </button>
      </div>

          {/* 标题 + 更换诗词按钮 */}
<div className="relative w-full max-w-3xl px-4 mt-4 flex items-center justify-center">
  {/* 居中标题 */}
  <h1
    className="text-[34px] md:text-[42px] font-bold tracking-widest text-center"
    style={{
      fontFamily: titleFont,
      letterSpacing: "0.06em",
      color: "#fff",
      textShadow:
        "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
    }}
  >
    意境寻踪
  </h1>

  {/* 按钮放在右侧绝对定位 */}
  <button
    className="absolute bottom-2 right-4 px-4 py-1 rounded border text-sm md:text-base hover:brightness-110"
    style={{ color: accent, background: "#ffffffcc", borderColor: "#e6d3b3" }}
    onClick={handleChangePoem}
  >
    更换诗词
  </button>
</div>

      {/* 信息条 + 进度条 */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 mt-4">
        <div className="w-full bg-white/75 backdrop-blur-sm rounded-2xl shadow border border-black/10 px-5 py-4 mb-3">
          <div className="flex justify-between items-center">
            <span
              className="font-bold tracking-wide"
              style={{ color: accent }}
            >
              找出所有诗脉元素
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-bold border"
              style={{
                color: accent,
                background: "#f7f3ea",
                borderColor: "#e5e5e5",
              }}
            >
              {String(selected.length).padStart(3, "0")}/003
            </span>
          </div>
          <p className="text-gray-700 text-sm mt-2">
            在画卷中寻找指定诗词元素，收集全部后可完成意境图
          </p>
        </div>

        <div className="w-full bg-white/75 backdrop-blur-sm rounded-2xl shadow border border-black/10 px-5 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold" style={{ color: accent }}>
              古风诗画：
            </span>
            <span className="font-bold" style={{ color: accent }}>
              《{poems[current].title}》
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* 如果有画笔图标，请放在 /public/poetry/brush.svg */}
            <span className="inline-block w-5 h-5 bg-[url('/poetry/brush.svg')] bg-contain bg-no-repeat" />
            <div className="flex-1 h-2 bg-[#f0e6d6] rounded-full overflow-hidden relative">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: accent,
                }}
              />
            </div>
            <span
              className="ml-2 text-xs font-bold"
              style={{ color: accent }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* 画卷区 */}
      <div className="relative z-10 w-full max-w-3xl px-4 mt-4">
        <div
          className="relative w-full mx-auto rounded-2xl shadow-lg border overflow-hidden bg-white/60 backdrop-blur-sm"
          style={{ borderColor: accent }}
        >
          <div className="relative w-full" style={{ paddingTop: "42%" /* 高宽比卡片 */ }}>
            <img
              src={poems[current].image}
              alt="意象画卷"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              style={{
                clipPath:
                  progress === 100 ? "inset(0 0 0 0)" : "inset(0 50% 0 0)",
                filter: progress === 100 ? "none" : "grayscale(0.2) blur(1px)",
              }}
            />
            {/* 左侧半透明遮罩，仅未完成时显示 */}
            {progress < 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* 关键词选择区 */}
      <div className="relative z-10 w-full max-w-3xl px-4 mt-5">
        <div className="font-bold mb-3 text-gray-800">请选择与画卷相关的 3 个关键词：</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {poems[current].keywords.map((kw, idx) => {
            const picked = selected.includes(idx);
            const right = kw.correct;
            return (
              <button
                key={kw.word}
                onClick={() => handleKeywordClick(idx)}
                disabled={picked || selected.length >= 3}
                className={`px-3 py-2 rounded-lg text-base font-bold transition-all border shadow-sm disabled:opacity-80 disabled:cursor-not-allowed
                  ${
                    picked
                      ? right
                        ? "text-white"
                        : "text-[--accent]"
                      : "text-[--accent] hover:text-white"
                  }`}
                style={{
                  ["--accent" as any]: accent,
                  background: picked ? (right ? accent : "#fbe4e4") : "#fffbe6",
                  borderColor: accent,
                  boxShadow: picked ? "0 2px 8px #a9443840" : "0 1px 4px #a9443810",
                }}
              >
                {kw.word}
              </button>
            );
          })}
        </div>
      </div>

      {/* 操作按钮区 */}
      <div className="relative z-10 w-full max-w-3xl px-4 mt-5 flex gap-4">
        <button
          className="flex-1 py-3 text-white rounded-lg font-bold text-lg shadow transition disabled:opacity-50"
          style={{ background: accent, fontFamily: titleFont }}
          onClick={handleCheck}
          disabled={selected.length !== 3}
        >
          提交答案
        </button>
        <button
          className="flex-1 py-3 rounded-lg font-bold text-lg shadow hover:brightness-105 transition"
          style={{ color: "#1a7f5a", background: "#d4f5e9", fontFamily: titleFont }}
          onClick={handleRetry}
        >
          重新选
        </button>
      </div>

      {/* 结果弹窗 */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            {score === 2 ? (
              <>
                <div className="text-2xl font-bold mb-4 text-green-700">
                  恭喜你，全部选对！+2 分
                </div>
                <div className="text-sm text-gray-600 mb-1">{poems[current].author}</div>
                <div className="max-h-48 overflow-auto text-[15px] leading-relaxed text-[--accent] mb-3"
                     style={{ ["--accent" as any]: accent }}>
                  {poems[current].content}
                </div>
                <button
                  className="w-full py-2 text-white rounded-lg font-bold shadow hover:brightness-110 transition mt-2"
                  style={{ background: accent, fontFamily: titleFont }}
                  onClick={handleRetry}
                >
                  重新选
                </button>
                {showAudio && (
                  <div className="w-full flex justify-center mt-3">
                    <audio
                      controls
                      src={poems[current].audio}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-2xl font-bold mb-6 text-red-700">
                  很遗憾，选错了！请重新选择。
                </div>
                <button
                  className="w-full py-2 text-white rounded-lg font-bold shadow hover:brightness-110 transition"
                  style={{ background: accent, fontFamily: titleFont }}
                  onClick={handleRetry}
                >
                  重新选
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
