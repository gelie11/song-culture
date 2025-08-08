// components/PotteryGame.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react';

interface ClayPoint {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
}

export default function PotteryGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [clayShape, setClayShape] = useState<ClayPoint[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [lastRotationAngle, setLastRotationAngle] = useState(0);
  
  // 初始化黏土形状
  useEffect(() => {
    const initialShape: ClayPoint[] = [];
    const segments = 24;
    const radius = 50;
    const height = 100;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      initialShape.push({
        x: Math.cos(angle) * radius,
        y: -height/2,
        z: Math.sin(angle) * radius
      });
      initialShape.push({
        x: Math.cos(angle) * radius,
        y: height/2,
        z: Math.sin(angle) * radius
      });
    }
    
    setClayShape(initialShape);
  }, []);

  // 事件处理函数
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (y > canvas.height - 50) {
      setIsRotating(true);
      setLastRotationAngle(Math.atan2(
        y - canvas.height / 2,
        x - canvas.width / 2
      ));
    } else {
      setIsDrawing(true);
      setLastPoint({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (isRotating) {
      const newAngle = Math.atan2(
        y - canvas.height / 2,
        x - canvas.width / 2
      );
      setRotation(prev => prev + (newAngle - lastRotationAngle) * 2);
      setLastRotationAngle(newAngle);
    } else if (isDrawing) {
      const deltaX = x - lastPoint.x;
      const deltaY = y - lastPoint.y;
      
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        shapeClay(deltaX, deltaY);
        setLastPoint({ x, y });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setIsRotating(false);
  };

  const shapeClay = (deltaX: number, deltaY: number) => {
    setClayShape(prevShape => {
      return prevShape.map(point => {
        const isSidePoint = prevShape.indexOf(point) % 2 === 0;
        
        if (isSidePoint) {
          const distanceFromCenter = Math.sqrt(point.x * point.x + point.z * point.z);
          const influence = Math.max(0, 1 - Math.abs(point.y) / 50);
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const direction = deltaX > 0 ? 1 : -1;
            const change = direction * influence * 1.5;
            
            const ratio = distanceFromCenter > 0 ? 
              (distanceFromCenter + change) / distanceFromCenter : 1;
            
            return {
              ...point,
              x: point.x * ratio,
              z: point.z * ratio
            };
          } else {
            const direction = deltaY > 0 ? 1 : -1;
            const change = direction * influence * 2;
            
            const newY = Math.max(20, Math.min(80, point.y + change));
            
            return {
              ...point,
              y: newY
            };
          }
        }
        return point;
      });
    });
  };

  // 绘制3D黏土形状的2D投影
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    ctx.fillStyle = 'rgba(255, 253, 245, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制黏土
    if (clayShape.length === 0) return;
    
    ctx.fillStyle = '#B87333';
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    
    // 绘制侧面
    for (let i = 0; i < clayShape.length - 2; i += 2) {
      const p1 = projectPoint(canvas, clayShape[i]);
      const p2 = projectPoint(canvas, clayShape[i + 1]);
      const p3 = projectPoint(canvas, clayShape[i + 3]);
      const p4 = projectPoint(canvas, clayShape[i + 2]);
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    
    // 绘制顶部和底部
    drawCap(ctx, canvas, clayShape.filter((_, index) => index % 2 === 0));
    drawCap(ctx, canvas, clayShape.filter((_, index) => index % 2 === 1));
    
    function projectPoint(canvas: HTMLCanvasElement, point: ClayPoint): ProjectedPoint {
      const scale = 1.5;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const rotatedX = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
      const rotatedZ = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
      
      return {
        x: centerX + rotatedX * scale,
        y: centerY + point.y * scale - rotatedZ * 0.3 * scale
      };
    }
    
    function drawCap(
      ctx: CanvasRenderingContext2D, 
      canvas: HTMLCanvasElement, 
      points: ClayPoint[]
    ) {
      ctx.beginPath();
      const firstPoint = projectPoint(canvas, points[0]);
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < points.length; i++) {
        const p = projectPoint(canvas, points[i]);
        ctx.lineTo(p.x, p.y);
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }, [clayShape, rotation]);

  const resetClay = () => {
    const initialShape: ClayPoint[] = [];
    const segments = 24;
    const radius = 50;
    const height = 100;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      initialShape.push({
        x: Math.cos(angle) * radius,
        y: -height/2,
        z: Math.sin(angle) * radius
      });
      initialShape.push({
        x: Math.cos(angle) * radius,
        y: height/2,
        z: Math.sin(angle) * radius
      });
    }
    
    setClayShape(initialShape);
    setRotation(0);
  };

  return (
    <div className="pottery-game">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border border-amber-200 rounded-lg shadow-md"
      />
      
      <button 
        onClick={resetClay}
        className="mt-3 px-3 py-1 text-xs bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
      >
        重置黏土
      </button>
    </div>
  );
}