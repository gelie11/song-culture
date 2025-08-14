"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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
        "表达了诗人对西湖的赞美"
      ]
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
        "表达了诗人对西湖春天的热爱"
      ]
    }
  ];
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
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-ink-black/5 flex flex-col items-center relative">
      {/* 顶部返回+标题+更换诗词 水平对齐 */}
      <div className="flex items-center w-full max-w-md px-4 mt-8 mb-6">
      <button
          className="flex items-center gap-2 text-ink-black text-xl font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none z-20 ancient-title"
          style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif', letterSpacing: '0.05em' }}
        onClick={() => router.push("/poetry")}
      >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        返回
      </button>
        <h1 className="flex-1 text-center text-3xl font-bold tracking-widest text-[#7c5c3b] ancient-title -ml-12" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }}>
        看图猜诗
      </h1>
        <button
          className="ml-2 px-4 py-1 border border-[#a94438] rounded bg-white/80 text-[#a94438] hover:bg-[#f7e7e1] transition"
          onClick={handleChangePoem}
        >更换诗词</button>
      </div>
      {/* 图片区 */}
      <div className="w-full max-w-md flex flex-col items-center">
        <img src={poems[current].image} alt="AI意境图" className="w-full rounded-2xl object-cover border-2 border-[#e6d3b3] shadow mb-2" style={{maxHeight: 260}} />
        <div className="text-center text-xs text-gray-500 mb-4">AI生成的古诗词意境图</div>
      </div>
      {/* 提示区 */}
      <div className="w-full max-w-md bg-yellow-50 rounded-xl border border-[#e6d3b3] p-4 mb-4 flex items-center">
        <div className="flex-1">
          <div className="font-bold text-[#a94438] mb-1">内涵意象</div>
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {showTips ? poems[current].tips.map((t, i) => <li key={i}>{t}</li>) : <li>点击右侧按钮可查看提示</li>}
          </ul>
        </div>
        <button className="ml-4 px-4 py-1 bg-white rounded shadow text-[#a94438] border border-[#e6d3b3] hover:bg-[#f7e7e1]" onClick={()=>setShowTips(v=>!v)}>
          {showTips ? "收起提示" : "请求提示"}
        </button>
      </div>
      {/* 选项区 */}
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          {poems[current].options.map(opt => (
            <button
              key={opt}
              className={`py-4 rounded-xl border-2 text-lg font-semibold transition-all
                ${selected === opt ? 'border-[#a94438] bg-[#f7e7e1] text-[#a94438]' : 'border-[#e6d3b3] bg-white text-gray-800 hover:border-[#a94438]'}`}
              onClick={()=>setSelected(opt)}
              disabled={showResult}
            >
              {opt}
            </button>
          ))}
        </div>
        {/* 输入区 */}
        <div className="flex w-full mb-4">
          <input
            className="flex-1 px-4 py-2 rounded-l-xl border border-[#e6d3b3] text-lg focus:outline-none"
            placeholder="输入诗名或诗句...（选填）"
            disabled={showResult}
          />
          <button
            className="px-8 py-2 rounded-r-xl bg-[#a94438] text-white font-bold text-lg hover:bg-[#c45c3b] transition"
            onClick={handleSubmit}
            disabled={!selected || showResult}
          >
            猜诗
          </button>
        </div>
      </div>
      {/* 分数显示 */}
      <div className="mb-4 text-right w-full max-w-md pr-4 text-[#a94438] font-bold">分数：{score}</div>
      {/* 结果弹窗 */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] flex flex-col items-center relative">
            {showCelebrate && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">🎉</div>}
            <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '恭喜你，答对啦！' : '很遗憾，答错了'}
            </div>
            <div className="text-lg mb-2">
              当前分数：<span className="text-[#a94438] font-bold">{score}</span>
            </div>
            {isCorrect && (
              <audio ref={audioRef} src={poems[current].audio} autoPlay controls className="mx-auto border rounded mt-2" />
            )}
            <div className="flex gap-4 mt-6 w-full">
              <button
                className="flex-1 py-2 bg-[#a94438] text-white rounded-lg font-bold text-lg shadow hover:bg-[#c45c3b]"
                onClick={handleRetry}
              >再猜一次</button>
              <button
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg shadow"
                onClick={handleChangePoem}
              >换一题</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
