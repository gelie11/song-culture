"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const poems = [
  {
    title: "钱塘湖春行",
    author: "白居易",
    content: "孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。乱花渐欲迷人眼，浅草才能没马蹄。最爱湖东行不足，绿杨阴里白沙堤。",
    keywords: [
      { word: "孤山寺", correct: true },
      { word: "白沙堤", correct: true },
      { word: "春泥", correct: true },
      { word: "西湖", correct: false },
      { word: "山色", correct: false },
      { word: "西子", correct: false }
    ],
    image: "/poetry/qiantanghu.jpg",
    audio: "/poetry/qiantanghu.mp3",
    comment: "/poetry/qiantanghu.mp3"
  },
  {
    title: "饮湖上初晴后雨",
    author: "苏轼",
    content: "水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。",
    keywords: [
      { word: "水光", correct: true },
      { word: "山色", correct: true },
      { word: "西湖", correct: true },
      { word: "孤山寺", correct: false },
      { word: "春泥", correct: false },
      { word: "白沙堤", correct: false }
    ],
    image: "/poetry/yinhu.jpg",
    audio: "/poetry/yinhu.mp3",
    comment: "/poetry/yinhu.mp3"
  }
];

export default function Module4() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]); // 选中的关键词索引
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showAudio, setShowAudio] = useState(false);
  const [showFull, setShowFull] = useState(false);

  // 选择关键词，最多选3个
  const handleKeywordClick = (idx: number) => {
    if (selected.includes(idx) || selected.length >= 3) return;
    setSelected([...selected, idx]);
  };

  // 检查是否全部选对
  const handleCheck = () => {
    if (selected.length === 3) {
      const allCorrect = selected.every((i) => poems[current].keywords[i].correct);
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
  };

  return (
    <div className="min-h-screen bg-[#f7f3ea] flex flex-col items-center pb-8">
      {/* 顶部按钮区仿照图片二：左返回（带箭头）、中间“意境寻踪”、右更换诗词 */}
      <div className="flex items-center w-full max-w-3xl px-4 pt-8 mb-2 mx-auto">
        <button
          className="flex items-center gap-2 text-ink-black text-xl font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none ancient-title"
          style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif', letterSpacing: '0.05em' }}
          onClick={() => router.push('/poetry')}
        >
          {/* 带箭头 */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          <span>返回</span>
        </button>
        <h1 className="flex-1 text-center text-3xl font-bold tracking-widest text-[#7c5c3b] ancient-title" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }}>
          意境寻踪
        </h1>
        <button
          className="ml-2 px-4 py-1 border border-[#a94438] rounded bg-white/80 text-[#a94438] hover:bg-[#f7e7e1] transition"
          onClick={handleChangePoem}
        >更换诗词</button>
      </div>
      {/* 顶部进度与诗画信息区，仿照第二张图片风格 */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-full bg-white rounded-xl shadow px-6 py-4 mb-4 flex flex-col gap-2 border border-[#ececec]">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-lg text-[#a94438] tracking-wide">找出所有诗脉元素</span>
            <span className="bg-[#f7f3ea] px-3 py-1 rounded text-[#a94438] font-bold text-base border border-[#e5e5e5]">{selected.length.toString().padStart(3,'0')}/003</span>
          </div>
          <div className="text-gray-500 text-sm">在画卷中寻找指定诗词元素，收集全部后可完成意境图</div>
        </div>
        <div className="w-full bg-[#fffbe6] rounded-xl shadow px-6 py-3 flex flex-col gap-2 border border-[#ececec]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#a94438] font-bold text-base">古风诗画：</span>
            <span className="font-bold text-[#a94438] text-base">《{poems[current].title}》</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 bg-[url('/public/brush.svg')] bg-contain bg-no-repeat" />
            <div className="flex-1 h-2 bg-[#f0e6d6] rounded-full overflow-hidden relative">
              <div className="absolute left-0 top-0 h-full bg-[#a94438] rounded-full transition-all" style={{ width: `${(selected.filter(i => poems[current].keywords[i]?.correct).length/3)*100}%` }} />
            </div>
            <span className="ml-2 text-xs text-[#a94438] font-bold">{Math.round((selected.filter(i => poems[current].keywords[i]?.correct).length/3)*100)}%</span>
          </div>
        </div>
        </div>
      {/* 横向滚动画卷区 */}
      {/* 画卷图片，初始遮半，全部选对后展示全图 */}
      <div className="w-full max-w-3xl overflow-x-auto mb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="relative w-[600px] h-[260px] bg-[#f5f5ef] rounded-xl shadow-lg border-2 border-[#a94438] mx-auto transition-all duration-700" style={{overflow:'hidden'}}>
          <img src={poems[current].image} alt="意象画卷" className="absolute left-0 top-0 h-full object-cover rounded-xl transition-all duration-700" style={{width: (selected.filter(i => poems[current].keywords[i]?.correct).length/3) === 1 ? '100%' : '50%', clipPath: (selected.filter(i => poems[current].keywords[i]?.correct).length/3) === 1 ? 'none' : 'inset(0 50% 0 0)', filter: (selected.filter(i => poems[current].keywords[i]?.correct).length/3) === 1 ? 'none' : 'grayscale(0.3) blur(1px)'}} />
        </div>
      </div>
      {/* 关键词选择区：6个词，最多选3个 */}
      <div className="w-full max-w-3xl mb-4">
        <div className="font-bold text-base mb-2 text-[#222]">请选择与画卷相关的3个关键词：</div>
        <div className="grid grid-cols-3 gap-2">
          {poems[current].keywords.map((kw, idx) => (
            <button
              key={kw.word}
              className={`flex items-center justify-center px-3 py-2 rounded-lg text-base font-bold transition-all border border-[#a94438] ${selected.includes(idx) ? (kw.correct ? 'bg-[#a94438] text-white' : 'bg-red-200 text-[#a94438]') : 'bg-[#fffbe6] text-[#a94438] hover:bg-[#a94438] hover:text-white'}`}
              style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif', boxShadow: selected.includes(idx) ? '0 2px 8px #a9443840' : '0 1px 4px #a9443810' }}
              onClick={() => handleKeywordClick(idx)}
              disabled={selected.includes(idx) || selected.length >= 3}
            >
              {kw.word}
            </button>
          ))}
        </div>
      </div>
      {/* 操作按钮区 */}
      <div className="w-full max-w-3xl flex gap-4 justify-center">
        <button className="flex-1 py-3 bg-[#a94438] text-white rounded-lg font-bold text-lg shadow hover:bg-[#c85c3b] transition border-none" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }} onClick={handleCheck} disabled={selected.length !== 3}>提交答案</button>
        <button className="flex-1 py-3 bg-[#d4f5e9] text-[#1a7f5a] rounded-lg font-bold text-lg shadow hover:bg-[#b2e5d3] transition border-none" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }} onClick={handleRetry}>重新选</button>
      </div>
      {/* 结果弹窗 */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[340px] w-[420px] flex flex-col items-center">
            {score === 2 ? (
              <>
                <div className="text-2xl font-bold mb-4 text-green-700">恭喜你，全部选对！+2分</div>
                <div className="text-lg mb-2 text-[#a94438] text-center">{poems[current].content}</div>
                <div className="text-base text-gray-500 mb-2">{poems[current].author}</div>
                <button className="w-full py-2 bg-[#a94438] text-white rounded-lg font-bold shadow hover:bg-[#c85c3b] transition mt-6 mb-4" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }} onClick={handleRetry}>重新选</button>
                <div className="w-full flex justify-center">
                  <audio controls src={poems[current].audio} className="w-full rounded-lg shadow" style={{background:'#f7f3ea'}} />
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold mb-4 text-red-700">很遗憾，选错了！请重新选择。</div>
                <button className="w-full py-2 bg-[#a94438] text-white rounded-lg font-bold shadow hover:bg-[#c85c3b] transition mt-8" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }} onClick={handleRetry}>重新选</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
