// app/gallery/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import PotteryGame from '@/components/PotteryGame';
import { Card } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";

interface ClayPoint {
  x: number;
  y: number;
  z: number;
}

export default function GalleryPage() {
  const router = useRouter();
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [currentBtnIndex, setCurrentBtnIndex] = useState(0);
  const [clayShape, setClayShape] = useState<ClayPoint[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#b87333");
  const [showPaintControls, setShowPaintControls] = useState(false);
  const [isPaintingEnabled, setIsPaintingEnabled] = useState(false);
  const [paintColor, setPaintColor] = useState("#ff0000");
  const [brushSize, setBrushSize] = useState(5);
  const [isPainting, setIsPainting] = useState(false);
  const [paintedPoints, setPaintedPoints] = useState<{ x: number, y: number, color: string, size: number }[]>([]);
  const [potteryKey, setPotteryKey] = useState(0); // 新增：用于强制重绘瓷器
  const potteryContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Button images array
  const buttonImages = [
    "/porcelain/33.png",
    "/button2.png",
    "/button3.png"
  ];

  // Switch button image
  const switchButtonImage = () => {
    setCurrentBtnIndex((prev) => (prev + 1) % buttonImages.length);
  };

  // Handle drag movement
  const handleMove = (clientY: number) => {
    if (!containerRef.current || !buttonRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonHeight = buttonRef.current.offsetHeight;
    const minY = 110;
    const maxY = containerRect.height - buttonHeight - 400;

    let newY = clientY - containerRect.top - (buttonHeight / 2);
    newY = Math.max(minY, Math.min(newY, maxY));

    const newPosition = (newY / (containerRect.height - buttonHeight)) * 100;
    setPosition(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Load pottery shape from localStorage
  useEffect(() => {
    const savedShape = localStorage.getItem('potteryShape');
    if (savedShape) {
      try {
        setClayShape(JSON.parse(savedShape));
      } catch (e) {
        console.error('解析形状数据失败', e);
      }
    }
  }, []);

  // Handle painting
  const startPainting = (e: React.MouseEvent) => {
    if (!isPaintingEnabled || !potteryContainerRef.current) return;

    const rect = potteryContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPointInPottery(x, y)) {
      setIsPainting(true);
      addPaintedPoint(x, y);
    }
  };

  const paint = (e: React.MouseEvent) => {
    if (!isPainting || !potteryContainerRef.current) return;

    const rect = potteryContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPointInPottery(x, y)) {
      addPaintedPoint(x, y);
    }
  };

  const stopPainting = () => {
    setIsPainting(false);
  };

  const addPaintedPoint = (x: number, y: number) => {
    setPaintedPoints(prev => [...prev, {
      x,
      y,
      color: paintColor,
      size: brushSize
    }]);
  };

  // Clear painting while preserving pottery
  const clearPainting = () => {
    setPaintedPoints([]);
    // Force pottery to redraw by changing the key
    setPotteryKey(prev => prev + 1);
  };

  // 在现有代码中添加保存函数
  const saveArtworkBeforeRedirect = () => {
    const canvas = potteryContainerRef.current?.querySelector('canvas');
    if (canvas) {
      // 临时保存到sessionStorage（会在浏览器标签页关闭后自动清除）
      sessionStorage.setItem('tempArtwork', JSON.stringify({
        imageData: canvas.toDataURL('image/png'),
        paintedPoints,
        clayShape,
        color: selectedColor,
        timestamp: Date.now()
      }));
    }

    // 跳转到中间页面
    router.push('/porcelain/3');
  };
  // Check if a point is within the pottery shape
  const isPointInPottery = (x: number, y: number) => {
    const centerX = 150;
    const centerY = 200;
    const radius = 120;

    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return distance <= radius;
  };

  // Draw painted points on canvas
  useEffect(() => {
    if (!potteryContainerRef.current || clayShape.length === 0) return;

    const canvas = potteryContainerRef.current.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (paintedPoints.length > 0) {
      ctx.save();
      paintedPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
      });
      ctx.restore();
    }
  }, [paintedPoints, clayShape]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        handleMove(e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fullscreen background image */}
      <Image
        src="/porcelain/背景3.png"

        alt="瓷器藏品展示厅"
        fill
        priority
        quality={100}
        className="object-cover brightness-100"
        sizes="100vw"
      />

      {/* 在背景Image组件下方，Back按钮上方添加 */}
      <div className="absolute top-6 left-0 right-0 z-20 text-center">
        <h1 className="text-3xl font-bold ancient-title text-ink-black">青瓷雅韵</h1>
        <p className="text-sm text-ancient-gold ancient-text">宋窑神工</p>
      </div>

      {/* Back button (top-left corner) */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 p-2 text-black hover:text-gray-700 transition-colors bg-transparent border-none focus:outline-none"
        aria-label="返回"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-lg font-medium">返回</span>
      </button>

      

      {/* Display the pottery creation */}
      <div className="absolute top-[45%] left-[42%] transform -translate-x-1/2 -translate-y-1/2 z-20 w-[80%] max-w-md px-4">
        <Card className="ancient-card p-6 bg-gradient-to-br from-rice-paper/90 to-ivory-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-amber-900 mb-4"></h2>
            <div
              ref={potteryContainerRef}
              className="w-full h-[370px] flex justify-center items-center relative"
            >
              {clayShape.length > 0 ? (
                <>
                  <PotteryGame
                    key={potteryKey}
                    initialShape={clayShape}
                    readOnly
                    color={selectedColor}
                    showOuterLineOnly
                  />
                  {isPaintingEnabled && (
                    <div
                      className="absolute inset-0 cursor-crosshair"
                      onMouseDown={startPainting}
                      onMouseMove={paint}
                      onMouseUp={stopPainting}
                      onMouseLeave={stopPainting}
                    />
                  )}
                </>
              ) : (
                <p className="text-amber-800">没有拉胚数据</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Color selection button */}
      <div className="absolute right-9 top-[45%] transform -translate-y-1/2 z-30">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowPaintControls(false);
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="选择颜色"
        >
          <div
            className="w-8 h-8 rounded-full border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
        </button>

        {showColorPicker && (
          <div className="absolute right-0 mt-2 bg-white p-3 rounded-lg shadow-xl z-40">
            <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            <div className="mt-2 text-center text-sm">
              {selectedColor}
            </div>
          </div>
        )}
      </div>

      {/* Paint controls button */}
      <div className="absolute right-9 top-[35%] transform -translate-y-1/2 z-40">

        <button
          onClick={() => {
            setShowPaintControls(!showPaintControls);
            setIsPaintingEnabled(true);
            setShowColorPicker(false);
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="绘画工具"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </button>

        {showPaintControls && (
          <div className="absolute right-0 mt-2 bg-white p-3 rounded-lg shadow-xl w-64">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">画笔颜色</label>
              <HexColorPicker color={paintColor} onChange={setPaintColor} />
              <div className="mt-1 text-center text-sm">
                {paintColor}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">画笔大小: {brushSize}px</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={clearPainting}
              className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              清除绘画
            </button>
            <button
              onClick={() => setShowPaintControls(false)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors w-full"
            >
              关闭面板
            </button>
          </div>
        )}
      </div>

      

      // 替换原有的主按钮代码
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={saveArtworkBeforeRedirect}
          className="group relative p-0 border-none bg-transparent cursor-pointer focus:outline-none"
          aria-label="前往下一步"
        >
          <Image
            src="/porcelain/图片5.png"
            alt=""
            width={280}
            height={140}
            quality={100}
            priority
            className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95 drop-shadow-xl"
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold tracking-wider group-hover:text-amber-200 transition-colors">
            
          </span>
        </button>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  );
}