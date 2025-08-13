"use client"; // 添加这一行解决编译错误

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Leaf, Coffee, Trophy, Video, PlayCircle } from "lucide-react";

// --- 资源配置 ---
const GAME_BACKGROUND_IMAGE = "/tea-photos/game-background.jpg"; 
const LONGJING_INTRO_VIDEO = "/tea-videos/longjing_intro.mp4";
const TEA_IDENTIFICATION_OPTIONS = [
    { name: "西湖龙井", image: "/tea-photos/longjing.jpg", isCorrect: true },
    { name: "安溪铁观音", image: "/tea-photos/tieguanyin.jpg", isCorrect: false },
    { name: "洞庭碧螺春", image: "/tea-photos/biluochun.jpg", isCorrect: false },
    { name: "云南普洱", image: "/tea-photos/puer.jpg", isCorrect: false },
];
const ROASTING_VIDEOS = [
    { name: "搭", src: "/tea-videos/da.mp4" }, { name: "抖", src: "/tea-videos/dou.mp4" },
    { name: "扣", src: "/tea-videos/kou.mp4" }, { name: "磨", src: "/tea-videos/mo.mp4" },
    { name: "捺", src: "/tea-videos/na.mp4" }, { name: "甩", src: "/tea-videos/shuai.mp4" },
    { name: "拓", src: "/tea-videos/tuo.mp4" }, { name: "推", src: "/tea-videos/tui.mp4" },
    { name: "压", src: "/tea-videos/ya.mp4" }, { name: "抓", src: "/tea-videos/zhua.mp4" },
];
const TEAWARE_PHOTOS = ["/tea-photos/teaware-good.png", "/tea-photos/teaware-plain.png", "/tea-photos/teaware-broken.png"];
// 修改点：将多张成品茶照片改为单张统一照片
const FINAL_TEA_PHOTO = "/tea-photos/tea-final.jpg"; // 统一使用一张成品茶照片
const SOUND_EFFECTS = {
    click: "/tea-photos/sound-click.mp3", fire: "/tea-photos/sound-fire.mp3", success: "/tea-photos/sound-success.mp3",
};
const SU_SHI_JUDGE = {
    name: "苏轼",
    analysis: {
        learning: {
            good: "竟能于众茶之中识得龙井，可谓慧眼识珠，于茶道已窥门径。",
            bad: "未能识得龙井真身，稍有遗憾。还需多加观摩，方能心领神会。"
        },
        roasting: {
            good: "火候掌握，如庖丁解牛，游刃有余，茶香已然四溢。",
            ok: "虽有小成，然动作略有迟滞，火候时有偏差。",
            bad: "急于求成，章法紊乱，茶已焦糊，可惜，可惜。"
        },
        brewing: {
            good: "器为茶之父，水为茶之母。择器精准，注水得当，相得益彰。",
            ok: "器尚可，水亦可，然配合之间，稍欠神韵。",
            bad: "器非良配，水漫金山，未能尽显茶之本色。"
        }
    }
};

// --- 辅助函数 ---
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const playSound = (src: string, volume: number = 0.5) => {
    if (typeof Audio !== "undefined") {
        try {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.play().catch(console.error);
        } catch (error) { console.error("Audio playback failed:", error); }
    }
};
function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

export default function TeaPage() {
    // --- 游戏核心状态 ---
    const [gameStage, setGameStage] = useState<'learning' | 'roasting' | 'brewing' | 'finished'>('learning');
    const [teaQuality, setTeaQuality] = useState({ learning: 0, roasting: 0, brewing: 0 });
    
    // 学习阶段状态
    const [learningSubStage, setLearningSubStage] = useState<'intro' | 'watching' | 'identifying' | 'result'>('intro');
    const [identificationOptions, setIdentificationOptions] = useState(TEA_IDENTIFICATION_OPTIONS);
    const [identificationResult, setIdentificationResult] = useState<'correct' | 'incorrect' | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // 炒茶阶段状态
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [promptState, setPromptState] = useState<'playing' | 'prompting' | 'cleared'>('playing');
    const [roastingScore, setRoastingScore] = useState(0);
    const [isRoastingActive, setIsRoastingActive] = useState(false);
    const promptTimerRef = useRef<NodeJS.Timeout | null>(null);
    const introVideoRef = useRef<HTMLVideoElement>(null);
    const roastingVideoRef = useRef<HTMLVideoElement>(null);

    // 泡茶阶段状态
    const [waterLevel, setWaterLevel] = useState(0);
    const [brewingProgress, setBrewingProgress] = useState(0);
    const brewTimer = useRef<NodeJS.Timeout | null>(null);
    const [selectedTeaware, setSelectedTeaware] = useState<number | null>(null);
    
    // 最终评分和诗句
    const [finalScore, setFinalScore] = useState(0);
    const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
    const teaPoetry = [
        { text: "从来佳茗似佳人", author: "苏轼" },
        { text: "欲把西湖比西子，从来佳茗似佳人", author: "苏轼" },
        { text: "坐酌泠泠水，看煎瑟瑟尘", author: "白居易" },
    ];

    // 背景音乐状态
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    // --- 逻辑部分 ---
    
    useEffect(() => {
        audioRef.current = new Audio("/tea-background-music.mp3");
        audioRef.current.loop = true; 
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) { 
            playPromise.then(() => setIsMusicPlaying(true)).catch(console.error); 
        }
        return () => { 
            if (audioRef.current) { 
                audioRef.current.pause(); 
                audioRef.current = null; 
            } 
        };
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) audioRef.current.pause(); 
            else audioRef.current.play().catch(console.error);
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    useEffect(() => {
        return () => {
            if (brewTimer.current) clearInterval(brewTimer.current);
            if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        };
    }, []);
    
    // 学习阶段逻辑
    const startIdentificationGame = () => {
        setIdentificationOptions(shuffleArray(TEA_IDENTIFICATION_OPTIONS));
        setLearningSubStage('identifying');
        setSelectedOption(null);
    };
    
    const handleTeaIdentification = (optName: string, isCorrect: boolean) => {
        setSelectedOption(optName);
        
        if (isCorrect) {
            playSound(SOUND_EFFECTS.success, 0.5);
            setTeaQuality(prev => ({ ...prev, learning: 100 }));
            setIdentificationResult('correct');
            setTimeout(() => setGameStage('roasting'), 2000);
        } else {
            setIdentificationResult('incorrect');
        }
    };
    
    const restartIdentification = () => {
        setIdentificationResult(null);
        setSelectedOption(null);
        startIdentificationGame();
    };
    
    // 炒茶视频交互逻辑
    const handleStartRoasting = () => {
        if(roastingVideoRef.current) {
            roastingVideoRef.current.play().catch(console.error);
            setIsRoastingActive(true);
        }
    };
    
    const handleVideoEnd = () => {
        setPromptState('prompting');
        promptTimerRef.current = setTimeout(() => handleAction(false), 2000);
    };
    
    const handleAction = (success: boolean) => {
        if (promptState !== 'prompting') return;
        if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        const newScore = roastingScore + (success ? 10 : 0);
        if (success) {
            playSound(SOUND_EFFECTS.fire, 0.4);
            setRoastingScore(newScore);
        }
        setPromptState('cleared');
        setTimeout(() => {
            if (currentVideoIndex >= ROASTING_VIDEOS.length - 1) {
                setTeaQuality(prev => ({...prev, roasting: newScore}));
                setGameStage('brewing');
            } else {
                setCurrentVideoIndex(prev => prev + 1);
                setPromptState('playing');
            }
        }, 300);
    };
    
    useEffect(() => {
        if (gameStage === 'roasting' && isRoastingActive && roastingVideoRef.current) {
            roastingVideoRef.current.play().catch(console.error);
        }
    }, [currentVideoIndex, gameStage, isRoastingActive]);

    // 冲泡阶段逻辑
    const handleSelectTeaware = (index: number) => {
        playSound(SOUND_EFFECTS.click);
        setSelectedTeaware(index);
    };
    
    const addWater = () => {
        if (waterLevel < 100) { 
            setWaterLevel(prev => Math.min(100, prev + randInt(5, 9))); 
        }
    };
    
    const startBrewing = () => {
        if (brewTimer.current) return;
        setBrewingProgress(0);
        brewTimer.current = setInterval(() => {
            setBrewingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(brewTimer.current!); 
                    brewTimer.current = null;
                    const waterScore = 100 - Math.min(100, Math.abs(waterLevel - 75) * 2);
                    const teawareScore = selectedTeaware === 0 ? 100 : selectedTeaware === 1 ? 70 : 20;
                    const finalBrewingScore = Math.round(waterScore * 0.7 + teawareScore * 0.3);
                    setTeaQuality(prev => ({ ...prev, brewing: finalBrewingScore }));
                    setGameStage('finished');
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
    };
    
    // 结束和重置逻辑
    useEffect(() => {
        if (gameStage === 'finished') {
            const finalScore = Math.round(
                teaQuality.learning * 0.2 + 
                teaQuality.roasting * 0.45 + 
                teaQuality.brewing * 0.35
            );
            setFinalScore(finalScore);
            if (finalScore > 80) playSound(SOUND_EFFECTS.success);
        }
    }, [gameStage, teaQuality]);
    
    const resetGame = () => {
        setGameStage('learning');
        setTeaQuality({ learning: 0, roasting: 0, brewing: 0 });
        setLearningSubStage('intro'); 
        setIdentificationResult(null);
        setSelectedOption(null);
        setCurrentVideoIndex(0); 
        setRoastingScore(0); 
        setPromptState('playing'); 
        setIsRoastingActive(false);
        setWaterLevel(0); 
        setBrewingProgress(0); 
        setSelectedTeaware(null);
        setFinalScore(0);
    };

    // --- 渲染逻辑 ---
    const renderCurrentStage = () => {
        switch (gameStage) {
            case 'learning':
                return (
                    <motion.div key="learning" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="ancient-card p-6 mb-6 bg-white/80 backdrop-blur-sm">
                            <AnimatePresence mode="wait">
                                {learningSubStage === 'intro' && (
                                    <motion.div key="intro" exit={{ opacity: 0 }}>
                                        <div className="text-center">
                                            <Leaf className="w-12 h-12 text-bamboo-green mx-auto mb-2" />
                                            <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">第一折：识茶</h2>
                                            <p className="ancient-text text-deep-ink leading-relaxed text-sm">欲识龙井，当知其源。南宋定都临安，西湖龙井遂为贡茶之首。请先观摩一段影像，了解其神韵。</p>
                                            <Button onClick={() => setLearningSubStage('watching')} className="w-full mt-6 ancient-button text-lg">观看影像</Button>
                                        </div>
                                    </motion.div>
                                )}
                                {learningSubStage === 'watching' && (
                                    <motion.div key="watching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-center font-bold ancient-title text-ink-black mb-2">龙井茶韵</h3>
                                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                            <video ref={introVideoRef} className="w-full h-full" onEnded={startIdentificationGame} playsInline controls>
                                                <source src={LONGJING_INTRO_VIDEO} type="video/mp4" />
                                            </video>
                                        </div>
                                        <Button onClick={startIdentificationGame} className="w-full mt-4 ancient-button text-sm">跳过并开始识茶</Button>
                                    </motion.div>
                                )}
                                {learningSubStage === 'identifying' && (
                                    <motion.div key="identifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h2 className="text-xl font-bold ancient-title text-ink-black text-center mb-4">请于众茶之中，找出"龙井"</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {identificationOptions.map((opt) => (
                                                <motion.div 
                                                    key={opt.name} 
                                                    onClick={() => handleTeaIdentification(opt.name, opt.isCorrect)} 
                                                    whileHover={{ scale: 1.05 }} 
                                                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedOption === opt.name ? 'border-ancient-gold' : 'border-transparent'} hover:border-ancient-gold`}
                                                >
                                                    <img src={opt.image} alt={opt.name} className="w-full h-32 object-cover"/>
                                                    {/* 移除了显示茶名的div */}
                                                </motion.div>
                                            ))}
                                        </div>
                                        {identificationResult === 'incorrect' && (
                                            <div className="mt-4 text-center text-cinnabar-red">
                                                <p className="ancient-text">此非龙井也，请重新选择</p>
                                                <Button onClick={restartIdentification} className="mt-2 ancient-button">再试一次</Button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                {learningSubStage === 'result' && identificationResult === 'correct' && (
                                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center h-48 flex flex-col justify-center items-center">
                                        <h2 className="text-2xl font-bold ancient-title text-ink-black">慧眼识珠！</h2>
                                        <p className="ancient-text text-deep-ink mt-2">此乃正宗龙井之形。</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                );
            case 'roasting':
                const currentVideo = ROASTING_VIDEOS[currentVideoIndex];
                return (
                    <motion.div key="roasting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="ancient-card p-6 mb-6 bg-white/80 backdrop-blur-sm">
                             <div className="text-center mb-4">
                                <Video className="w-12 h-12 text-cinnabar-red mx-auto mb-2" />
                                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">第二折：炒茶</h2>
                                <p className="ancient-text text-deep-ink leading-relaxed text-sm">{isRoastingActive ? "观看演示后，请在两秒内按下对应动作。" : "请点击下方视频，开始学习炒茶手法。"}</p>
                            </div>
                            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                <video ref={roastingVideoRef} key={currentVideo.src} className="w-full h-full" onEnded={handleVideoEnd} playsInline muted>
                                    <source src={currentVideo.src} type="video/mp4" />
                                </video>
                                {!isRoastingActive && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer" onClick={handleStartRoasting}>
                                        <PlayCircle className="w-24 h-24 text-white/70 hover:text-white transition-colors"/>
                                    </div>
                                )}
                                <AnimatePresence>
                                {promptState === 'prompting' && (
                                    <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}>
                                        <button onClick={() => handleAction(true)} className="w-32 h-32 bg-ancient-gold/80 rounded-full text-white text-6xl ancient-title shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-ancient-gold">
                                            {currentVideo.name}
                                        </button>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                {ROASTING_VIDEOS.map((video, index) => (
                                    <div 
                                        key={video.name} 
                                        className="flex-1 h-2 rounded-full" 
                                        style={{ 
                                            backgroundColor: index < currentVideoIndex ? '#2e7d32' : 
                                            (index === currentVideoIndex ? '#d4af37' : '#e2d5c0') 
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="text-center mt-2 ancient-text text-deep-ink">当前动作: {currentVideo.name} ({currentVideoIndex + 1}/{ROASTING_VIDEOS.length}) | 得分: {roastingScore}</div>
                        </Card>
                    </motion.div>
                );
            case 'brewing':
                 return (
                    <motion.div key="brewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="ancient-card p-6 mb-6 bg-white/80 backdrop-blur-sm">
                            <div className="text-center mb-4">
                                <Coffee className="w-12 h-12 text-bronze-gold mx-auto mb-2" />
                                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">第三折：冲泡</h2>
                                <p className="ancient-text text-deep-ink leading-relaxed text-sm">{selectedTeaware === null ? "器为茶之父。请择一佳器。" : `水为茶之母。请注水至75%，再行冲泡。`}</p>
                            </div>
                            {selectedTeaware === null ? (
                                <div className="grid grid-cols-3 gap-4 h-64 items-center">
                                    {TEAWARE_PHOTOS.map((src, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="p-2 border-2 border-transparent hover:border-ancient-gold rounded-lg cursor-pointer" 
                                            whileHover={{scale: 1.05}} 
                                            onClick={() => handleSelectTeaware(index)}
                                        >
                                            <img src={src} alt={`茶器 ${index+1}`} className="w-full h-auto object-contain"/>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-full h-64 flex items-center justify-center">
                                        <div className="relative w-36 h-40 bg-gray-100 rounded-b-full border-4 border-gray-400 overflow-hidden">
                                            <motion.div 
                                                className="absolute bottom-0 w-full" 
                                                style={{ 
                                                    height: `${waterLevel}%`, 
                                                    background: `linear-gradient(to top, #5d4037, #8d6e63)`
                                                }}
                                            />
                                            <div className="absolute w-full h-1 bg-green-500" style={{ top: `${100 - 75}%` }} />
                                        </div>
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">水位: {waterLevel}%</div>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                        <Button onClick={addWater} disabled={waterLevel >= 100 || brewingProgress > 0} className="w-full ancient-button text-lg py-3">加水</Button>
                                        <Button onClick={startBrewing} disabled={brewingProgress > 0 || waterLevel === 0} className="w-full ancient-button text-lg py-3 bg-bamboo-green hover:bg-jade-green">{brewingProgress > 0 ? "泡茶中..." : "开始泡茶"}</Button>
                                    </div>
                                </>
                            )}
                        </Card>
                    </motion.div>
                );
            case 'finished':
                const title = finalScore > 90 ? "茶仙" : 
                           finalScore > 75 ? "茶人" : 
                           finalScore > 50 ? "茶客" : "饮者";
                
                const learningAnalysis = teaQuality.learning >= 100 ? SU_SHI_JUDGE.analysis.learning.good : SU_SHI_JUDGE.analysis.learning.bad;
                const roastingAnalysis = teaQuality.roasting >= 80 ? SU_SHI_JUDGE.analysis.roasting.good : 
                                        teaQuality.roasting >= 50 ? SU_SHI_JUDGE.analysis.roasting.ok : 
                                        SU_SHI_JUDGE.analysis.roasting.bad;
                const brewingAnalysis = teaQuality.brewing >= 80 ? SU_SHI_JUDGE.analysis.brewing.good : 
                                       teaQuality.brewing >= 50 ? SU_SHI_JUDGE.analysis.brewing.ok : 
                                       SU_SHI_JUDGE.analysis.brewing.bad;

                return (
                    <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="ancient-card p-6 bg-white/80 backdrop-blur-sm">
                            <div className="text-center">
                                <Trophy className="w-16 h-16 text-ancient-gold mx-auto mb-2" />
                                <h3 className="text-2xl font-bold ancient-title text-ink-black mb-2">恭喜！获封名号：<span className="text-cinnabar-red">{title}</span></h3>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-6xl font-extrabold text-ancient-gold my-4">{finalScore}</motion.div>
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-ancient-gold/50 overflow-hidden shadow-inner">
                                    {/* 修改点：使用单张统一茶照片 */}
                                    <img src={FINAL_TEA_PHOTO} alt="Final Tea" className="w-full h-full object-cover"/>
                                </div>
                                
                                <Card className="ancient-card p-4 my-4 bg-ivory-white/50 text-left">
                                    <h4 className="font-bold ancient-title text-ink-black text-center mb-2">{SU_SHI_JUDGE.name} 品鉴分析：</h4>
                                    <ul className="space-y-2 ancient-text text-sm">
                                        <li><strong>识茶:</strong> {learningAnalysis}</li>
                                        <li><strong>炒制:</strong> {roastingAnalysis}</li>
                                        <li><strong>冲泡:</strong> {brewingAnalysis}</li>
                                    </ul>
                                </Card>

                                <div className="space-y极3 mt-6">
                                    <Button onClick={resetGame} className="w-full ancient-button text-lg">再试一番</Button>
                                    <Link href="/silk"><Button className="w-full ancient-button text-lg">下一站：锦绣华章 →</Button></Link>
                                    <Link href="/"><Button variant="outline" className="w-full border-bamboo-green text-bamboo-green bg-transparent hover:bg-bamboo-green/10">返回首页</Button></Link>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                );
        }
    };
    
    return (
        <div
            className="min-h-screen relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${GAME_BACKGROUND_IMAGE})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-ivory-white/50 to-bamboo-green/30"></div>
            
            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/"><Button variant="ghost" className="text-ink-black hover:极bg-ancient-gold/10 ancient-text"><ArrowLeft className="w-4 h-4 mr-2" />返回</Button></Link>
                    <div className="text-center"><h1 className="text-2xl font-bold ancient-title text-ink-black">茶禅一味</h1><p className="text-sm text-ancient-gold ancient-text">东坡品茗</p></div>
                    <button onClick={toggleMusic} className="bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all" aria-label="控制音乐">
                        {isMusicPlaying 
                            ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bamboo-green" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> 
                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bamboo-green" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        }
                    </button>
                </div>
                <Card className="ancient-card p-4 mb-6 bg-white/60 backdrop-blur-sm">
                    <div className="text-center h-20 flex flex-col items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentPoetryIndex} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -20 }} 
                                transition={{ duration: 0.8 }} 
                                className="text-center"
                            >
                                <p className="text-lg ancient-text text-deep-ink mb-1">{teaPoetry[currentPoetryIndex].text}</p>
                                <p className="text-xs text-ancient-gold ancient-text">—— {teaPoetry[currentPoetryIndex].author}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Card>
            </div>
            <div className="relative z-10 px-6 pb-6">
                <AnimatePresence mode="wait">
                    {renderCurrentStage()}
                </AnimatePresence>
            </div>
        </div>
    );
}
