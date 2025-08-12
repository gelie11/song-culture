"use client"
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './PotteryGame.css';

interface ClayPoint {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
}

interface PotteryGameProps {
  initialShape?: ClayPoint[];
  onShapeChange?: (shape: ClayPoint[]) => void;
  readOnly?: boolean;
  color?: string;
  showOuterLineOnly?: boolean;
}

const PotteryGame = forwardRef(({ 
  initialShape, 
  onShapeChange, 
  readOnly = false,
  color = '#b87333',
  showOuterLineOnly = false
}: PotteryGameProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [clayShape, setClayShape] = useState<ClayPoint[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [lastRotationAngle, setLastRotationAngle] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    projectPoint: (point: ClayPoint) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      return projectPoint(canvasRef.current, point);
    },
    getContourPoints: () => {
      if (!canvasRef.current || clayShape.length === 0) return [];
      const segments = 36;
      const outerPoints = clayShape.slice(0, segments + 1);
      return outerPoints.map(point => projectPoint(canvasRef.current!, point));
    },
    redraw: () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制转盘
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(
      canvas.width / 2, 
      canvas.height / 2 + 150, 
      120, 
      30, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    if (clayShape.length === 0) return;
    
    // 绘制陶器（复制原本的绘制逻辑）
    const segments = 36;
    const layers = clayShape.length / (segments + 1);
    
    ctx.fillStyle = color;
    if (!showOuterLineOnly) {
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
    }
    
    for (let h = 0; h < layers - 1; h++) {
      for (let i = 0; i < segments; i++) {
        const idx1 = h * (segments + 1) + i;
        const idx2 = h * (segments + 1) + i + 1;
        const idx3 = (h + 1) * (segments + 1) + i + 1;
        const idx4 = (h + 1) * (segments + 1) + i;
        
        const p1 = projectPoint(canvas, clayShape[idx1]);
        const p2 = projectPoint(canvas, clayShape[idx2]);
        const p3 = projectPoint(canvas, clayShape[idx3]);
        const p4 = projectPoint(canvas, clayShape[idx4]);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
        if (!showOuterLineOnly) {
          ctx.stroke();
        }
      }
    }
    
    // 绘制顶部和底部
    if (!showOuterLineOnly) {
      drawCap(ctx, canvas, clayShape.slice(0, segments + 1));
      drawCap(ctx, canvas, clayShape.slice(-(segments + 1)));
    }
    
    // 绘制轮廓线
    drawOutline(ctx, canvas, clayShape.slice(0, segments + 1));
    drawOutline(ctx, canvas, clayShape.slice(-(segments + 1)));
  }
  }));

  // 添加这个函数来封装绘制逻辑
const drawPottery = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // 复制原本的绘制逻辑
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw turntable
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(
    canvas.width / 2, 
    canvas.height / 2 + 150, 
    120, 
    30, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  if (clayShape.length === 0) return;}
  
  // Initialize clay shape
  useEffect(() => {
    if (initialShape) {
      setClayShape(initialShape);
    } else {
      const defaultShape: ClayPoint[] = [];
      const segments = 36;
      const radius = 100;
      const height = 200;
      const layers = 10;
      
      for (let h = 0; h <= layers; h++) {
        const y = -height/2 + (height * h / layers);
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          defaultShape.push({
            x: Math.cos(angle) * radius,
            y: y,
            z: Math.sin(angle) * radius
          });
        }
      }
      
      setClayShape(defaultShape);
      if (onShapeChange) onShapeChange(defaultShape);
    }
  }, [initialShape, onShapeChange]);

  // Draw 3D clay shape
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw turntable
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(
      canvas.width / 2, 
      canvas.height / 2 + 150, 
      120, 
      30, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    if (clayShape.length === 0) return;
    
    const segments = 36;
    const layers = clayShape.length / (segments + 1);
    
    // Draw clay
    if (showOuterLineOnly) {
      // Only draw outlines
      const outerPoints = clayShape.slice(0, segments + 1);
      const innerPoints = clayShape.slice(-(segments + 1));
      
      // Fill main shape
      ctx.fillStyle = color;
      for (let h = 0; h < layers - 1; h++) {
        for (let i = 0; i < segments; i++) {
          const idx1 = h * (segments + 1) + i;
          const idx2 = h * (segments + 1) + i + 1;
          const idx3 = (h + 1) * (segments + 1) + i + 1;
          const idx4 = (h + 1) * (segments + 1) + i;
          
          const p1 = projectPoint(canvas, clayShape[idx1]);
          const p2 = projectPoint(canvas, clayShape[idx2]);
          const p3 = projectPoint(canvas, clayShape[idx3]);
          const p4 = projectPoint(canvas, clayShape[idx4]);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.fill();
        }
      }
      
      // Draw outlines
      drawOutline(ctx, canvas, outerPoints);
      drawOutline(ctx, canvas, innerPoints);
    } else {
      // Original drawing with all lines
      ctx.fillStyle = color;
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      
      for (let h = 0; h < layers - 1; h++) {
        for (let i = 0; i < segments; i++) {
          const idx1 = h * (segments + 1) + i;
          const idx2 = h * (segments + 1) + i + 1;
          const idx3 = (h + 1) * (segments + 1) + i + 1;
          const idx4 = (h + 1) * (segments + 1) + i;
          
          const p1 = projectPoint(canvas, clayShape[idx1]);
          const p2 = projectPoint(canvas, clayShape[idx2]);
          const p3 = projectPoint(canvas, clayShape[idx3]);
          const p4 = projectPoint(canvas, clayShape[idx4]);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      
      drawCap(ctx, canvas, clayShape.slice(0, segments + 1));
      drawCap(ctx, canvas, clayShape.slice(-(segments + 1)));
    }
    
    function projectPoint(canvas: HTMLCanvasElement, point: ClayPoint): ProjectedPoint {
      const scale = 1.2;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const rotatedX = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
      const rotatedZ = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
      
      return {
        x: centerX + rotatedX * scale,
        y: centerY + point.y * scale - rotatedZ * 0.3 * scale
      };
    }
    
    function drawOutline(
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
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.stroke();
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
      if (!showOuterLineOnly) {
        ctx.stroke();
      }
    }
  }, [clayShape, rotation, color, showOuterLineOnly]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (readOnly) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Check if turntable area (bottom) was touched
    if (y > canvas.height - 100) {
      setIsRotating(true);
      setLastRotationAngle(Math.atan2(
        y - canvas.height / 2,
        x - canvas.width / 2
      ));
    } else {
      setIsDrawing(true);
      setLastPoint({ x, y });
      
      // Calculate current touch height relative to clay
      const projectedCenter = projectPoint(canvas, { x: 0, y: 0, z: 0 });
      const relativeY = y - projectedCenter.y;
      setCurrentHeight(relativeY / 1.2); // Remove scaling effect
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (readOnly) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (isRotating) {
      // Rotate clay
      const newAngle = Math.atan2(
        y - canvas.height / 2,
        x - canvas.width / 2
      );
      setRotation(prev => prev + (newAngle - lastRotationAngle) * 2);
      setLastRotationAngle(newAngle);
    } else if (isDrawing) {
      // Shape clay
      const deltaX = x - lastPoint.x;
      const deltaY = y - lastPoint.y;
      
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        shapeClay(deltaX, deltaY);
        setLastPoint({ x, y });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setIsRotating(false);
  };

  // Helper function: Project point to canvas
  const projectPoint = (canvas: HTMLCanvasElement, point: ClayPoint): ProjectedPoint => {
    const scale = 1.2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const rotatedX = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
    const rotatedZ = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
    
    return {
      x: centerX + rotatedX * scale,
      y: centerY + point.y * scale - rotatedZ * 0.3 * scale
    };
  };

  const shapeClay = (deltaX: number, deltaY: number) => {
    setClayShape(prevShape => {
      const segments = 36;
      const layers = prevShape.length / (segments + 1);
      const newShape = prevShape.map((point, index) => {
        const layerIndex = Math.floor(index / (segments + 1));
        const layerY = -100 + (200 * layerIndex / (layers - 1));
        
        // Calculate distance from current touch height
        const distance = Math.abs(layerY - currentHeight);
        const influence = Math.max(0, 1 - distance / 40);
        
        if (influence <= 0) return point;
        
        // Horizontal movement - change radius
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          const direction = deltaX > 0 ? 1 : -1;
          const change = direction * influence * 3;
          
          const angle = Math.atan2(point.z, point.x);
          const currentRadius = Math.sqrt(point.x * point.x + point.z * point.z);
          const newRadius = Math.max(20, currentRadius + change);
          
          return {
            ...point,
            x: Math.cos(angle) * newRadius,
            z: Math.sin(angle) * newRadius,
            y: point.y
          };
        } 
        // Vertical movement - change height
        else {
          const direction = deltaY > 0 ? 1 : -1;
          const change = direction * influence * 2;
          
          const newY = point.y + change;
          const minY = -100;
          const maxY = 100;
          
          if (newY < minY || newY > maxY) return point;
          
          return {
            ...point,
            y: newY
          };
        }
      });
      
      if (onShapeChange) onShapeChange(newShape);
      return newShape;
    });
  };

  const resetClay = () => {
    // Reset to default shape
    const defaultShape: ClayPoint[] = [];
    const segments = 36;
    const radius = 100;
    const height = 200;
    const layers = 10;
    
    for (let h = 0; h <= layers; h++) {
      const y = -height/2 + (height * h / layers);
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        defaultShape.push({
          x: Math.cos(angle) * radius,
          y: y,
          z: Math.sin(angle) * radius
        });
      }
    }
    
    setClayShape(defaultShape);
    setRotation(0);
    if (onShapeChange) onShapeChange(defaultShape);
  };

  return (
    <div className="pottery-game">
      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        onMouseDown={readOnly ? undefined : handleTouchStart}
        onMouseMove={readOnly ? undefined : handleTouchMove}
        onMouseUp={readOnly ? undefined : handleTouchEnd}
        onMouseLeave={readOnly ? undefined : handleTouchEnd}
        onTouchStart={readOnly ? undefined : handleTouchStart}
        onTouchMove={readOnly ? undefined : handleTouchMove}
        onTouchEnd={readOnly ? undefined : handleTouchEnd}
      />
      
      {!readOnly && (
        <button 
          className="mr-auto -mt-5 px-3 py-1 text-xs bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors" 
          onClick={resetClay}
        >
          重置黏土
        </button>
      )}
    </div>
  );
});

PotteryGame.displayName = 'PotteryGame';

export default PotteryGame;

function drawCap(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, arg2: ClayPoint[]) {
  throw new Error('Function not implemented.');
}
function drawOutline(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, arg2: ClayPoint[]) {
  throw new Error('Function not implemented.');
}

