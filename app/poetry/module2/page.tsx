"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const poems = [
  {
    title: "钱塘湖春行",
    author: "白居易",
    grid: ["孤", "", "寺", "北", "贾", "", "西", "，", "水"],
    solution: ["孤", "山", "寺", "北", "贾", "亭", "西", "，", "水"],
    candidates: [
      ["山", "寺", "北", "孤"], // 第2格空，正确：山
      ["亭", "贾", "西", "北"], // 第6格空，正确：亭
    ],
    annotation: "白居易《钱塘湖春行》节选。",
    tips: "孤、山、水",
  },
  {
    title: "饮湖上初晴后雨",
    author: "苏轼",
    grid: ["水", "", "潋", "滟", "晴", "方", "", "，", "山"],
    solution: ["水", "光", "潋", "滟", "晴", "方", "好", "，", "山"],
    candidates: [
      ["光", "水", "滟", "潋"], // 第2格空，正确：光
      ["好", "方", "晴", "山"], // 第7格空，正确：好
    ],
    annotation: "苏轼《饮湖上初晴后雨》节选。",
    tips: "水、晴、山",
  },
];

export default function Module2() {
  // ------- 主题与路由 -------
  const router = useRouter();
  const titleFont = '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';
  const accent = "#a94438";

  // ------- 状态逻辑（原样保留） -------
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const poemAudios = ["/poetry/qiantanghu.mp3", "/poetry/yinhu.mp3"];

  const [poemIdx, setPoemIdx] = useState(0);
  const [grid, setGrid] = useState(poems[0].grid);
  const [inputValues, setInputValues] = useState<string[]>(Array(9).fill(""));
  const [showTip, setShowTip] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showAddScore, setShowAddScore] = useState(false);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPoemSelect, setShowPoemSelect] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const blankIdxs = grid
    .map((cell, idx) => (cell === "" ? idx : null))
    .filter((idx) => idx !== null) as number[];

  const handleCellClick = (idx: number) => {
    if (grid[idx] === "") {
      setModalIdx(idx);
      setShowModal(true);
    }
  };

  const handleSelectChar = (char: string) => {
    if (modalIdx === null) return;
    const newInput = [...inputValues];
    newInput[modalIdx] = char;
    setInputValues(newInput);
    setShowModal(false);
    setModalIdx(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setModalIdx(null);
  };

  const handleSubmit = () => {
    const allFilled = blankIdxs.every(
      (idx) => inputValues[idx] && inputValues[idx].trim() !== ""
    );
    if (!allFilled) {
      alert("请先填写所有空格！");
      return;
    }
    const answer = grid.map((cell, idx) => (cell === "" ? inputValues[idx] : cell));
    const isRight = answer.join("") === poems[poemIdx].solution.join("");
    setSuccess(isRight);
    if (isRight) {
      setScore((s) => s + 1);
      setShowAddScore(true);
      setTimeout(() => setShowAddScore(false), 1200);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }, 300);
    }
    setShowResultModal(true);
  };

  const selectPoem = (idx: number) => {
    setPoemIdx(idx);
    setGrid(poems[idx].grid);
    setInputValues(Array(9).fill(""));
    setShowTip(false);
    setSuccess(false);
    setShowAddScore(false);
    setShowPoemSelect(false);
  };

  const handleRestart = () => {
    setInputValues(Array(9).fill(""));
    setSuccess(false);
    setShowResultModal(false);
  };

  const handleChallenge = () => setChallenge((c) => !c);

  const getCandidates = (idx: number) => {
    const blankOrder = blankIdxs.indexOf(idx);
    return poems[poemIdx].candidates[blankOrder] || [];
  };

  // ------- UI -------
  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden bg-cover bg-center"
      // 背景与前页统一：放在 public/poetry/bg3.png
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

      {/* 居中标题 —— 纯白 */}
      <h1
        className="text-center text-[36px] md:text-[44px] font-bold tracking-widest text-white"
        style={{
          fontFamily: titleFont,
          letterSpacing: "0.06em",
          color: "#ffffff", // 直接强制纯白
          textShadow:
            "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
        }}
      >
        诗词谜境
      </h1>

      {/* 主卡片：半透明 + 毛玻璃 */}
      <div className="relative z-10 w-[380px] bg-white/75 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col items-center py-6 px-4 mt-6">
        {/* 顶部信息栏 + 更换诗词 */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-gray-800">
            《{poems[poemIdx].title}》 · {poems[poemIdx].author}
          </div>
          <div className="relative">
            <button
              className="px-3 py-1 bg-white/80 rounded text-[--accent] border border-gray-200 text-sm hover:bg-white"
              style={{ ["--accent" as any]: accent }}
              onClick={() => setShowPoemSelect((v) => !v)}
            >
              更换诗词
            </button>
            {showPoemSelect && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow border z-50">
                {poems.map((p, idx) => (
                  <div
                    key={p.title}
                    className={`px-4 py-2 cursor-pointer hover:bg-orange-50 ${
                      poemIdx === idx ? "text-[--accent] font-bold" : ""
                    }`}
                    style={{ ["--accent" as any]: accent }}
                    onClick={() => selectPoem(idx)}
                  >
                    《{p.title}》
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-600 mb-4">选择正确字词补全诗句</div>

        {/* 九宫格 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {grid.map((cell, idx) => {
            const isBlank = cell === "";
            const value = isBlank ? inputValues[idx] : cell;
            return (
              <div
                key={idx}
                className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold border-2 transition-all select-none
                  ${
                    isBlank
                      ? value
                        ? "border-yellow-500 bg-yellow-50 cursor-pointer hover:scale-105 hover:shadow-lg"
                        : "border-yellow-500 border-dashed bg-yellow-50 cursor-pointer hover:scale-105 hover:shadow-lg"
                      : "border-gray-200 bg-gray-50"
                  }`}
                onClick={() => isBlank && handleCellClick(idx)}
              >
                {isBlank ? (value ? value : <span className="text-gray-400">?</span>) : cell}
              </div>
            );
          })}
        </div>

        {/* 选字弹窗 */}
        {showModal && modalIdx !== null && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] flex flex-col items-center">
              <div className="text-lg font-bold mb-4">请选择正确的汉字</div>
              <div className="flex gap-4 mb-4 flex-wrap justify-center">
                {getCandidates(modalIdx).map((char) => (
                  <button
                    key={char}
                    className="w-12 h-12 rounded bg-gray-50 border border-gray-200 text-xl font-bold hover:bg-yellow-100"
                    onClick={() => handleSelectChar(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
              <button className="w-full py-2 bg-gray-100 rounded text-gray-500 mt-2" onClick={handleCancel}>
                取消
              </button>
            </div>
          </div>
        )}

        {/* 提示区 */}
        <div className="w-full bg-yellow-50 rounded-lg p-3 mb-2 text-sm">
          <div className="flex items-center mb-1">
            <span className="text-orange-700 font-bold mr-2">提示：</span>
            <span className="text-gray-500 ml-auto">分数：{score}</span>
          </div>
          <div className="text-orange-700">
            {poems[poemIdx].annotation}{" "}
            <span className="font-bold">{showTip && poems[poemIdx].tips}</span>
          </div>
          <button className="text-[--accent] text-xs mt-1 hover:underline" style={{ ["--accent" as any]: accent }} onClick={() => setShowTip((v) => !v)}>
            {showTip ? "收起提示" : "请求提示"}
          </button>
        </div>

        {/* 限时模式 */}
        <label className="flex items-center mb-4 w-full text-xs text-gray-600">
          <input type="checkbox" className="mr-2" checked={challenge} onChange={handleChallenge} />
          限时模式
        </label>

        {/* 提交按钮（主题色） */}
        <button
          className={`w-full py-2 text-white rounded-lg font-bold text-lg shadow transition ${
            blankIdxs.every((idx) => inputValues[idx] && inputValues[idx].trim() !== "")
              ? "hover:brightness-110"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{ background: accent }}
          onClick={handleSubmit}
          disabled={
            !blankIdxs.every((idx) => inputValues[idx] && inputValues[idx].trim() !== "")
          }
        >
          提交
        </button>

        {/* 结果弹窗 */}
        {showResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] flex flex-col items-center">
              <div className="text-2xl font-bold mb-4">
                {success ? "恭喜你，答对啦！" : "很遗憾，答错了"}
              </div>
              <div className="text-lg mb-2">
                当前分数：<span className="text-green-600 font-bold">{score}</span>
              </div>
              <button
                className="w-full py-2 text-white rounded-lg font-bold text-lg shadow hover:brightness-110 mt-4"
                style={{ background: accent }}
                onClick={handleRestart}
              >
                重新玩
              </button>
              <button
                className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg shadow mt-2"
                onClick={() => setShowResultModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        )}

        {/* 加分/成功动画与音频 */}
        {showAddScore && (
          <div className="mt-2 text-center animate-bounce">
            <div className="text-3xl text-green-600 font-bold">+1 分！</div>
          </div>
        )}
        {success && (
          <div className="mt-4 text-center animate-bounce">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-lg font-bold text-green-600 mb-2">恭喜你，全部答对！</div>
            <audio ref={audioRef} src={poemAudios[poemIdx]} controls autoPlay className="mx-auto border rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
