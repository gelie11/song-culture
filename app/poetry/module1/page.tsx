"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
					"最爱湖东行不足，绿杨阴里白沙堤。"
				],
		tags: ["孤山寺", "白沙堤", "春行", "西湖"],
		audio: "/poetry/qiantanghu.mp3",
	},
	{
		name: "饮湖上初晴后雨",
		subtitle: "苏轼《饮湖上初晴后雨》",
		image: "/poetry/yinhu.jpg",
		video: "/poetry/yinhu.mp4",
		poem: [
				"水光潋滟晴方好，山色空蒙雨亦奇。",
				"欲把西湖比西子，淡妆浓抹总相宜。"
		],
		tags: ["水光", "山色", "雨", "西子"],
		audio: "/poetry/yinhu.mp3",
	},
];

export default function Module1() {
	const router = useRouter();
	const [current, setCurrent] = useState(0);
	const [showVideo, setShowVideo] = useState(false);

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
		<div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-[#f5f5ef] to-[#e6e6dc]">
				   {/* 顶部返回+标题 水平对齐 */}
				   <div className="w-full max-w-2xl flex items-center px-4 pt-10 mb-2">
					   <button
						   className="flex items-center gap-2 text-ink-black text-xl font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none z-20 ancient-title"
						   style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif', letterSpacing: '0.05em' }}
						   onClick={() => router.push('/poetry')}
					   >
						   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
						   返回
					   </button>
				<h1
						   className="flex-1 text-center text-3xl font-bold tracking-widest mb-0 ancient-title"
					style={{
						fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif',
						letterSpacing: '0.2em',
						color: '#a94438',
						borderBottom: '2px solid #a94438',
						display: 'inline-block',
						padding: '0 1.5rem',
					}}
				>
					诗画西湖
				</h1>
					   {/* 占位保持居中 */}
					   <div style={{ width: 64 }}></div>
			</div>
				   {/* 背景 */}
				   <div
					   className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
					   style={{ backgroundImage: "url(/public/wel.png)" }}
				   />
			{/* 轮播区 */}
			<div className="relative z-10 w-full max-w-md mx-auto mt-4 flex flex-col items-center">
				<div className="flex items-center justify-center w-full mb-2">
					<button
						onClick={prev}
						className="px-2 py-1 text-2xl text-gray-400 hover:text-[#a94438]"
					>
						&#8592;
					</button>
					<div className="mx-2 flex-1 flex flex-col items-center">
						{/* 指示点 */}
						<div className="flex justify-center mb-2">
							{scenes.map((_, idx) => (
								<span
									key={idx}
									className={`inline-block w-2 h-2 mx-1 rounded-full ${
										idx === current ? 'bg-[#a94438]' : 'bg-gray-300'
									}`}
								></span>
							))}
						</div>
						{/* 图片或视频卡片 */}
						<div className="w-80 h-44 rounded-xl overflow-hidden shadow-lg bg-white/80 flex items-center justify-center border border-gray-200">
							{showVideo ? (
								   <div className="relative w-full h-full">
								<video
									src={scenes[current].video}
									controls
									autoPlay
										   className="object-cover w-full h-full max-h-72 rounded-xl"
										   style={{background: '#fff'}}
										   onPlay={() => {
											   const audio = document.getElementById('scene-audio') as HTMLAudioElement;
											   if(audio) {
												   audio.loop = true;
												   audio.play();
											   }
										   }}
										   onPause={() => {
											   const audio = document.getElementById('scene-audio') as HTMLAudioElement;
											   if(audio) audio.pause();
										   }}
										   onEnded={() => {
											   const audio = document.getElementById('scene-audio') as HTMLAudioElement;
											   if(audio) audio.pause();
										   }}
									   />
									   {/* 隐藏自动播放音频 */}
									   <audio id="scene-audio" src={scenes[current].audio} loop />
								   </div>
							) : (
								<img
									src={scenes[current].image}
									alt={scenes[current].name}
									   className="object-cover w-full h-full max-h-72 rounded-xl"
									   style={{background: '#fff'}}
								/>
							)}
						</div>
						{/* 标题与副标题 */}
						<div className="mt-2 text-base font-bold text-[#a94438]">
							{scenes[current].name}
						</div>
						<div className="text-xs text-gray-500 mb-2">
							{scenes[current].subtitle}
						</div>
					</div>
					<button
						onClick={next}
						className="px-2 py-1 text-2xl text-gray-400 hover:text-[#a94438]"
					>
						&#8594;
					</button>
				</div>
				{/* 诗词内容 */}
				<div
					className="w-full bg-white/80 rounded-lg shadow p-4 mb-2 text-center text-gray-700 text-base leading-relaxed"
				   >
					   {scenes[current].poem.map((line, idx) => (
						   <div key={idx}>{line}</div>
					   ))}
				   </div>
				{/* 标签 */}
				<div className="flex flex-wrap justify-center gap-2 mb-2">
					{scenes[current].tags.map((tag) => (
						<span
							key={tag}
							className="px-2 py-0.5 bg-[#f5e6c8] text-[#a94438] rounded-full text-xs font-semibold"
						>
							{tag}
						</span>
					))}
				</div>
				{/* 音频播放器 */}
				<div className="w-full flex justify-center mb-2">
					<audio
						src={scenes[current].audio}
						controls
						className="w-full max-w-xs"
						   loop
					/>
				</div>
				{/* 复活场景按钮 */}
				<button
					className="w-full py-2 bg-[#a94438] text-white rounded-lg shadow hover:bg-[#c85c3b] transition font-bold mb-2"
					onClick={handleRevive}
				>
					{showVideo ? '返回图片' : '复活场景'}
				</button>
				{/* 当前景点名 */}
				<div className="text-center text-sm text-[#a94438] font-bold mb-2">
					{scenes[current].name}
				</div>
			</div>
		</div>
	);
}
