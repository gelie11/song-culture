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
					   ["山", "寺", "北", "孤"], // 第二格空，正确是山
					   ["亭", "贾", "西", "北"], // 第六格空，正确是亭
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
					   ["光", "水", "滟", "潋"], // 第二格空，正确是光
					   ["好", "方", "晴", "山"], // 第七格空，正确是好
				   ],
				annotation: "苏轼《饮湖上初晴后雨》节选。",
				tips: "水、晴、山",
			},
];

export default function Module2() {
	// 音频资源映射
	const poemAudios = [
		"/poetry/qiantanghu.mp3",
		"/poetry/yinhu.mp3"
	];
	const audioRef = useRef<HTMLAudioElement | null>(null);
	// 选中格子弹窗（仅空格可点击）
	const handleCellClick = (idx: number) => {
		if (grid[idx] === "") {
			setModalIdx(idx);
			setShowModal(true);
		}
	};

	// 选字
	const handleSelectChar = (char: string) => {
		if (modalIdx === null) return;
		const newInput = [...inputValues];
		newInput[modalIdx] = char;
		setInputValues(newInput);
		setShowModal(false);
		setModalIdx(null);
	};

	// 清空当前格
	const handleCancel = () => {
		setShowModal(false);
		setModalIdx(null);
	};

	// 提交答案
	const handleSubmit = () => {
		const allFilled = blankIdxs.every(
			(idx) => inputValues[idx] && inputValues[idx].trim() !== ""
		);
		if (!allFilled) {
			alert("请先填写所有空格！");
			return;
		}
		const answer = grid.map((cell, idx) =>
			cell === "" ? inputValues[idx] : cell
		);
		const isRight = answer.join("") === poems[poemIdx].solution.join("");
		setSuccess(isRight);
		if (isRight) {
			setScore(score + 1);
			setShowAddScore(true);
			setTimeout(() => setShowAddScore(false), 1200);
			// 答对后自动播放音频
			setTimeout(() => {
				if (audioRef.current) {
					audioRef.current.currentTime = 0;
					audioRef.current.play();
				}
			}, 300);
		}
		setShowResultModal(true);
	};
	const router = useRouter();
	const [poemIdx, setPoemIdx] = useState(0);
	const [grid, setGrid] = useState(poems[0].grid);
	const [inputValues, setInputValues] = useState(Array(9).fill(""));
	const [showTip, setShowTip] = useState(false);
	const [challenge, setChallenge] = useState(false);
	const [score, setScore] = useState(0);
	const [success, setSuccess] = useState(false);
	const [showAddScore, setShowAddScore] = useState(false);
	const [modalIdx, setModalIdx] = useState<number | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [showPoemSelect, setShowPoemSelect] = useState(false);
	const [showResultModal, setShowResultModal] = useState(false);

	// 允许填写的格子索引
	const blankIdxs = grid
		.map((cell, idx) => (cell === "" ? idx : null))
		.filter((idx) => idx !== null) as number[];

	// 切换诗词
	const selectPoem = (idx: number) => {
		setPoemIdx(idx);
		setGrid(poems[idx].grid);
		setInputValues(Array(9).fill(""));
		setShowTip(false);
		setSuccess(false);
		   setShowAddScore(false);
		   setShowPoemSelect(false);
	   };
		// ...existing code...

	// 重新开始
	const handleRestart = () => {
		setInputValues(Array(9).fill(""));
		setSuccess(false);
		setShowResultModal(false);
	};

	// 挑战模式切换
	const handleChallenge = () => setChallenge((c) => !c);

	// 获取当前空格的候选字
	const getCandidates = (idx: number) => {
		const blankOrder = blankIdxs.indexOf(idx);
		return poems[poemIdx].candidates[blankOrder] || [];
	};

	   return (
		   <div
			   className="min-h-screen flex flex-col items-center relative bg-[#f7f3ea]"
			   style={{
				   backgroundImage: "url(/public/wel.png)",
				   backgroundSize: "cover",
				   backgroundRepeat: "no-repeat",
			   }}
		   >
			   {/* 顶部返回+标题+更换诗词 水平对齐 */}
			   <div className="flex items-center w-full max-w-md px-4 mt-8 mb-6">
				   <button
					   className="flex items-center gap-2 text-ink-black text-xl font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none z-20 ancient-title"
					   style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif', letterSpacing: '0.05em' }}
					   onClick={() => router.push('/poetry')}
				   >
					   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
					   返回
				   </button>
				   <div
					   className="flex-1 text-center text-2xl text-[#a94438] font-bold z-30 bg-white/80 px-8 py-1 rounded-xl shadow ancient-title"
					   style={{
						   fontFamily: "YuWeiShuFaXingShuFanTi-1, serif",
						   letterSpacing: "0.1em",
						   borderBottom: "2px solid #a94438",
					   }}
				   >
					   诗字谜境
				   </div>
				   <div className="ml-2">
					   <button
						   className="px-3 py-1 bg-white/80 rounded text-[#3b82f6] border border-gray-200 text-sm hover:bg-blue-50"
						   onClick={() => setShowPoemSelect((v) => !v)}
					   >
						   更换诗词
					   </button>
					   {showPoemSelect && (
						   <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow border z-50">
							   {poems.map((p, idx) => (
								   <div
									   key={p.title}
									   className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
										   poemIdx === idx ? "text-blue-600 font-bold" : ""
									   }`}
									   onClick={() => selectPoem(idx)}
								   >
									   《{p.title}》
								   </div>
							   ))}
						   </div>
					   )}
				   </div>
			   </div>
			{/* 九宫格卡片 */}
			<div
				className="w-[380px] bg-white/90 rounded-2xl shadow-xl flex flex-col items-center py-6 px-4"
				style={{ marginTop: 60 }}
			>
				<div className="text-lg font-bold text-gray-800 mb-1">
					<span className="mr-2">《{poems[poemIdx].title}》</span>·{" "}
					<span>{poems[poemIdx].author}</span>
				</div>
				<div className="text-xs text-gray-500 mb-4">
					选择正确字词补全全诗句
				</div>
				{/* 九宫格 */}
				   <div className="grid grid-cols-3 gap-4 mb-6">
					   {grid.map((cell, idx) => {
						   const isBlank = cell === "";
						   const value = isBlank ? inputValues[idx] : cell;
						   return (
							   <div
								   key={idx}
								   className={`w-20 h-20 flex items-center justify-center rounded-lg text-xl font-bold border-2 transition-all select-none
									   ${isBlank
										   ? (value ? "border-yellow-400 bg-yellow-50 cursor-pointer hover:scale-105 hover:shadow-lg" : "border-dashed border-yellow-400 bg-yellow-50 cursor-pointer hover:scale-105 hover:shadow-lg")
										   : "border-gray-200 bg-gray-50"}
								   `}
								   style={isBlank && !value ? { borderStyle: 'dashed' } : {}}
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
							<button
								className="w-full py-2 bg-gray-100 rounded text-gray-500 mt-2"
								onClick={handleCancel}
							>
								取消
							</button>
						</div>
					</div>
				)}
				{/* 提示区 */}
				<div className="w-full bg-yellow-50 rounded-lg p-3 mb-2 text-sm">
					<div className="flex items-center mb-1">
						<span className="text-orange-700 font-bold mr-2">提示：</span>
						<span className="text-gray-500 ml-auto">
							分数：{score}
						</span>
					</div>
					<div className="text-orange-700">
						{poems[poemIdx].annotation}{" "}
						<span className="font-bold">
							{showTip && poems[poemIdx].tips}
						</span>
					</div>
					<button
						className="text-blue-500 text-xs mt-1 hover:underline"
						onClick={() => setShowTip((v) => !v)}
					>
						{showTip ? "收起提示" : "请求提示"}
					</button>
				</div>
				{/* 限时模式 */}
				<div className="flex items-center mb-4 w-full">
					<input
						type="checkbox"
						id="challenge"
						checked={challenge}
						onChange={handleChallenge}
						className="mr-2"
					/>
					<label
						htmlFor="challenge"
						className="text-xs text-gray-600"
					>
						限时模式
					</label>
				</div>
				{/* 提交按钮 */}
				<button
					className={`w-full py-2 bg-[#d4841c] text-white rounded-lg font-bold text-lg shadow transition ${
						blankIdxs.every(
							(idx) => inputValues[idx] && inputValues[idx].trim() !== ""
						)
							? "hover:bg-[#e6a23c]"
							: "opacity-50 cursor-not-allowed"
					}`}
					onClick={handleSubmit}
					disabled={
						!blankIdxs.every(
							(idx) => inputValues[idx] && inputValues[idx].trim() !== ""
						)
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
								当前分数：
								<span className="text-green-600 font-bold">{score}</span>
							</div>
							<button
								className="w-full py-2 bg-[#d4841c] text-white rounded-lg font-bold text-lg shadow hover:bg-[#e6a23c] mt-4"
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
				{/* 成功动画与加分提示 */}
				{showAddScore && (
					<div className="mt-2 text-center animate-bounce">
						<div className="text-3xl text-green-600 font-bold">+1 分！</div>
					</div>
				)}
				{success && (
					<div className="mt-4 text-center animate-bounce">
						<div className="text-3xl mb-2">🎉</div>
						<div className="text-lg font-bold text-green-600 mb-2">
							恭喜你，全部答对！
						</div>
						<audio
							ref={audioRef}
							src={poemAudios[poemIdx]}
							controls
							autoPlay
							className="mx-auto border rounded"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
