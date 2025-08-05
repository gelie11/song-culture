"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Leaf, Flame, Coffee, CheckCircle, Clock, Move3d } from "lucide-react"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';

export default function TeaPage() {
  const [gameStage, setGameStage] = useState<'picking' | 'roasting' | 'brewing' | 'finished'>('picking');
  const [pickedLeavesCount, setPickedLeavesCount] = useState(0);
  const [roastingProgress, setRoastingProgress] = useState(0);
  const [brewingProgress, setBrewingProgress] = useState(0);
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [teaQuality, setTeaQuality] = useState({ picking: 0, roasting: 0, brewing: 0 });

  // 采摘阶段的状态
  const [pickingTime, setPickingTime] = useState(0);
  const pickingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 炒茶阶段的状态
  const [isStirring, setIsStirring] = useState(false);
  const [roastingTemp, setRoastingTemp] = useState(0);
  const tempIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const roastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [fireParticles, setFireParticles] = useState<number[]>([]);

  // 泡茶阶段的状态
  const [waterLevel, setWaterLevel] = useState(0);
  const brewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // three.js 的引用
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const leafMeshesRef = useRef<THREE.Mesh[]>([]);
  const pickingLeafPoetryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // 游戏配置
  const REQUIRED_LEAVES = 10;
  const ROAST_TIME_MS = 10000;
  const PERFECT_ROAST_TEMP_MIN = 60;
  const PERFECT_ROAST_TEMP_MAX = 80;
  const OPTIMAL_WATER_LEVEL = 75; // 百分比
  const PICKING_TIME_LIMIT = 30; // 秒

  const teaPoetry = [
    { text: "从来佳茗似佳人", author: "苏轼" },
    { text: "休对故人思故国，且将新火试新茶", author: "苏轼" },
    { text: "分无玉碗捧峨眉，且尽卢仝七碗茶", author: "苏轼" },
    { text: "茶敬客来茶当酒，云山云去云作车", author: "苏轼" },
    { text: "坐酌泠泠水，看煎瑟瑟尘", author: "白居易" },
    { text: "春风解恼撩诗客，新火来烹第一茶", author: "陆游" },
  ];

  // =========================================================================
  // three.js 场景设置（优化茶树模型）
  // =========================================================================
  const setupThreeScene = useCallback(() => {
    if (!mountRef.current) return () => {};

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f2e9);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controlsRef.current = controls;

    // 灯光设置
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    const hemisphereLight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.5);
    scene.add(hemisphereLight);

    // 地面
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x98c56c,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);
    ground.receiveShadow = true;

    // 添加背景元素 - 远山
    const mountainGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const mountainGeometry = new THREE.ConeGeometry(5, 8, 4);
      const mountainMaterial = new THREE.MeshStandardMaterial({ 
        color: i === 0 ? 0x5a7d59 : i === 1 ? 0x4a6b48 : 0x3a5a38,
        side: THREE.DoubleSide
      });
      const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
      mountain.position.set(i * 10 - 15, -2, -15 - i * 5);
      mountain.rotation.x = Math.PI / 2;
      mountain.scale.set(1, 1.5 + i * 0.3, 1);
      mountain.castShadow = true;
      mountainGroup.add(mountain);
    }
    scene.add(mountainGroup);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      
      // 叶子浮动动画
      leafMeshesRef.current.forEach(leaf => {
        leaf.position.y += Math.sin(Date.now() * 0.001 + leaf.userData.offset) * 0.002;
        leaf.rotation.y += 0.005;
      });
    };
    animate();

    // 创建茶树主干
    const createTreeTrunk = () => {
      const trunkGroup = new THREE.Group();
      
      // 主树干
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.8, 5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.castShadow = true;
      trunkGroup.add(trunk);
      
      // 树枝
      const branchGeometry = new THREE.CylinderGeometry(0.1, 0.15, 3, 6);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const height = 2 + Math.random() * 2;
        
        const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
        branch.position.y = height;
        branch.rotation.z = Math.PI / 4 + Math.random() * Math.PI / 8;
        branch.rotation.y = angle;
        branch.castShadow = true;
        trunkGroup.add(branch);
        
        // 小分支
        const smallBranchGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 5);
        for (let j = 0; j < 3; j++) {
          const smallBranch = new THREE.Mesh(smallBranchGeometry, trunkMaterial);
          smallBranch.position.set(1.2, j * 0.5, 0);
          smallBranch.rotation.z = Math.PI / 3;
          branch.add(smallBranch);
        }
      }
      
      trunkGroup.position.y = -1;
      return trunkGroup;
    };

    const treeTrunk = createTreeTrunk();
    scene.add(treeTrunk);

    // 创建更逼真的叶子，并增大其点击区域
    const generateLeaves = () => {
      const leaves: THREE.Mesh[] = [];
      const newLeafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8fc93a,
        emissive: 0x223300,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const oldLeafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a4b00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      // 创建更自然的叶子形状
      const createLeafShape = () => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.4, 0.2, 1, 1, 0.4, 2);
        shape.bezierCurveTo(0.2, 2.4, 0, 3, -0.2, 2.4);
        shape.bezierCurveTo(-1, 1, -0.4, 0.2, 0, 0);
        return new THREE.ShapeGeometry(shape);
      };
      
      const leafGeometry = createLeafShape();

      // 在树枝上添加叶子
      treeTrunk.traverse((node) => {
        if (node instanceof THREE.Mesh && node.geometry.type === 'CylinderGeometry') {
          const branchLength = node.geometry.parameters.height;
          
          for (let i = 0; i < 8; i++) {
            const isNewLeaf = Math.random() < 0.4;
            const material = isNewLeaf ? newLeafMaterial : oldLeafMaterial;
            const leaf = new THREE.Mesh(leafGeometry, material);
            leaf.name = `leaf-${leaves.length}`;

            // 沿着树枝分布
            const posX = (Math.random() - 0.5) * 0.5;
            const posY = (Math.random() - 0.5) * branchLength;
            const posZ = (Math.random() - 0.5) * 0.5;
            
            leaf.position.set(posX, posY, posZ);
            leaf.rotation.set(
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            );
            
            const scale = 0.25 + Math.random() * 0.1;
            leaf.scale.set(scale, scale, scale);
            
            leaf.userData = { 
              isNewLeaf, 
              isOldLeaf: !isNewLeaf, 
              offset: Math.random() * 2 * Math.PI,
              originalScale: new THREE.Vector3(scale, scale, scale)
            };
            
            node.add(leaf);
            if (isNewLeaf) {
              leaves.push(leaf);
            }
          }
        }
      });

      // 添加一些额外的叶子在树顶
      for (let i = 0; i < 15; i++) {
        const isNewLeaf = Math.random() < 0.4;
        const material = isNewLeaf ? newLeafMaterial : oldLeafMaterial;
        const leaf = new THREE.Mesh(leafGeometry, material);
        leaf.name = `leaf-${leaves.length}`;

        const x = (Math.random() - 0.5) * 3;
        const y = (Math.random() - 0.5) * 2 + 5;
        const z = (Math.random() - 0.5) * 3;
        
        leaf.position.set(x, y, z);
        leaf.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        const scale = 0.25 + Math.random() * 0.1;
        leaf.scale.set(scale, scale, scale);
        leaf.userData = { 
          isNewLeaf, 
          isOldLeaf: !isNewLeaf, 
          offset: Math.random() * 2 * Math.PI,
          originalScale: new THREE.Vector3(scale, scale, scale)
        };
        
        scene.add(leaf);
        if (isNewLeaf) {
          leaves.push(leaf);
        }
      }
      
      leafMeshesRef.current = leaves;
    };
    
    generateLeaves();

    // 添加一个简单的"茶灵"角色
    const createTeaSpirit = () => {
      const spiritGroup = new THREE.Group();
      
      // 身体
      const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfde047,
        emissive: 0xfde047,
        emissiveIntensity: 0.5
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      spiritGroup.add(body);
      
      // 眼睛
      const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(0.15, 0.1, 0.25);
      spiritGroup.add(leftEye);
      
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(-0.15, 0.1, 0.25);
      spiritGroup.add(rightEye);
      
      // 嘴巴
      const mouthGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI);
      const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
      mouth.rotation.x = Math.PI / 2;
      mouth.position.z = 0.2;
      mouth.position.y = -0.1;
      spiritGroup.add(mouth);
      
      // 动画
      const animateSpirit = () => {
        spiritGroup.position.x = Math.sin(Date.now() * 0.001) * 2;
        spiritGroup.position.y = 4 + Math.cos(Date.now() * 0.0005) * 0.5;
        spiritGroup.position.z = Math.cos(Date.now() * 0.001) * 2;
        spiritGroup.rotation.y += 0.01;
        
        // 轻微上下浮动
        spiritGroup.position.y += Math.sin(Date.now() * 0.002) * 0.05;
        
        requestAnimationFrame(animateSpirit);
      };
      
      spiritGroup.position.set(0, 4, 0);
      scene.add(spiritGroup);
      animateSpirit();
    };
    
    createTeaSpirit();

    // 窗口大小调整处理程序
    const onResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rendererRef.current && rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // =========================================================================
  // 采摘阶段逻辑（已改进）
  // =========================================================================
  
  // 使用 AudioContext API 来生成音效
  const playPickSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 660; // E5
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  }, []);

  const handlePickClick = useCallback((event: MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current || pickedLeavesCount >= REQUIRED_LEAVES) return;

    const mouse = new THREE.Vector2();
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouse, cameraRef.current);
    
    // 找到所有相交的对象
    const intersects = raycasterRef.current.intersectObjects(leafMeshesRef.current, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const leafMesh = intersect.object as THREE.Mesh;
      
      if (leafMesh.userData.isNewLeaf) {
        setPickedLeavesCount((prev) => prev + 1);
        playPickSound(); // 播放音效
        
        // 创建采摘动画
        const targetPosition = new THREE.Vector3(0, 8, 0);
        const initialPosition = leafMesh.position.clone();
        const duration = 500; // 动画持续时间（毫秒）
        const startTime = Date.now();
        
        const animatePick = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          
          // 使用缓动函数使动画更自然
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          // 计算中间位置（抛物线）
          const parabolaHeight = 3;
          const midX = initialPosition.x + (targetPosition.x - initialPosition.x) * 0.5;
          const midY = Math.max(initialPosition.y, targetPosition.y) + parabolaHeight;
          const midZ = initialPosition.z + (targetPosition.z - initialPosition.z) * 0.5;
          
          const position = new THREE.Vector3();
          position.x = (1 - easeProgress) * (1 - easeProgress) * initialPosition.x + 
                       2 * (1 - easeProgress) * easeProgress * midX + 
                       easeProgress * easeProgress * targetPosition.x;
          position.y = (1 - easeProgress) * (1 - easeProgress) * initialPosition.y + 
                       2 * (1 - easeProgress) * easeProgress * midY + 
                       easeProgress * easeProgress * targetPosition.y;
          position.z = (1 - easeProgress) * (1 - easeProgress) * initialPosition.z + 
                       2 * (1 - easeProgress) * easeProgress * midZ + 
                       easeProgress * easeProgress * targetPosition.z;
          
          leafMesh.position.copy(position);
          
          // 缩放动画
          const scaleFactor = 1 - easeProgress * 0.5;
          leafMesh.scale.set(
            leafMesh.userData.originalScale.x * scaleFactor,
            leafMesh.userData.originalScale.y * scaleFactor,
            leafMesh.userData.originalScale.z * scaleFactor
          );
          
          if (progress < 1) {
            requestAnimationFrame(animatePick);
          } else {
            // 动画完成后移除叶子
            sceneRef.current?.remove(leafMesh);
            const index = leafMeshesRef.current.indexOf(leafMesh);
            if (index > -1) {
              leafMeshesRef.current.splice(index, 1);
            }
          }
        };
        
        animatePick();
      }
    }
  }, [pickedLeavesCount, playPickSound]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const mouse = new THREE.Vector2();
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycasterRef.current.setFromCamera(mouse, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(leafMeshesRef.current, true);

    leafMeshesRef.current.forEach(leaf => {
        if(leaf.userData.isNewLeaf) {
            leaf.scale.copy(leaf.userData.originalScale); // 重置尺寸
            // 使用类型断言解决类型错误
            (leaf.material as THREE.MeshStandardMaterial).opacity = 0.9; // 重置透明度
        }
    });

    if (intersects.length > 0) {
        const leafMesh = intersects[0].object as THREE.Mesh;
        if(leafMesh.userData.isNewLeaf) {
            const scaleFactor = 1.2;
            leafMesh.scale.set(
                leafMesh.userData.originalScale.x * scaleFactor,
                leafMesh.userData.originalScale.y * scaleFactor,
                leafMesh.userData.originalScale.z * scaleFactor
            );
            // 使用类型断言解决类型错误
            (leafMesh.material as THREE.MeshStandardMaterial).opacity = 1.0; // 高亮显示
        }
    }
  }, []);

  useEffect(() => {
    let cleanupThreeScene: (() => void) | null = null;
    let cleanupClickEvent: (() => void) | null = null;
    let cleanupMouseMoveEvent: (() => void) | null = null;
    
    if (gameStage === 'picking') {
      cleanupThreeScene = setupThreeScene();
      
      const rendererDom = mountRef.current?.querySelector('canvas');
      if (rendererDom) {
        rendererDom.addEventListener('click', handlePickClick);
        rendererDom.addEventListener('mousemove', handleMouseMove);
        cleanupClickEvent = () => rendererDom.removeEventListener('click', handlePickClick);
        cleanupMouseMoveEvent = () => rendererDom.removeEventListener('mousemove', handleMouseMove);
      }

      pickingLeafPoetryIntervalRef.current = setInterval(() => {
        setCurrentPoetryIndex(prev => (prev + 1) % teaPoetry.length);
      }, 5000);

      // 启动采摘计时器
      const startTime = Date.now();
      pickingTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setPickingTime(elapsed);
        if (elapsed >= PICKING_TIME_LIMIT) {
          // 时间到！过渡到炒茶阶段
          clearInterval(pickingTimerRef.current as NodeJS.Timeout);
          setTeaQuality(prev => ({ ...prev, picking: pickedLeavesCount }));
          setGameStage('roasting');
        }
      }, 1000);
    }

    return () => {
      if (cleanupThreeScene) cleanupThreeScene();
      if (cleanupClickEvent) cleanupClickEvent();
      if (cleanupMouseMoveEvent) cleanupMouseMoveEvent();
      if (pickingLeafPoetryIntervalRef.current) clearInterval(pickingLeafPoetryIntervalRef.current);
      if (pickingTimerRef.current) clearInterval(pickingTimerRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [gameStage, setupThreeScene, handlePickClick, handleMouseMove]);
  
  // =========================================================================
  // 炒茶阶段逻辑
  // =========================================================================

  const handleRoastStart = () => {
    if (roastTimerRef.current) return;
    let perfectTime = 0;
    const roastStartTime = Date.now();
    const checkProgress = () => {
      const elapsedTime = Date.now() - roastStartTime;
      const progress = Math.min(100, (elapsedTime / ROAST_TIME_MS) * 100);
      setRoastingProgress(progress);

      if (roastingTemp >= PERFECT_ROAST_TEMP_MIN && roastingTemp <= PERFECT_ROAST_TEMP_MAX) {
        perfectTime++;
      }

      if (progress >= 100) {
        setGameStage('brewing');
        setTeaQuality(prev => ({ ...prev, roasting: perfectTime / (ROAST_TIME_MS / 100) }));
        if (roastTimerRef.current) clearInterval(roastTimerRef.current);
      }
    };
    roastTimerRef.current = setInterval(checkProgress, 100);
  };

  const handleFireUp = () => {
    setIsStirring(true);
    if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
    tempIntervalRef.current = setInterval(() => {
      setRoastingTemp(prev => Math.min(100, prev + 8));
    }, 100);
    handleRoastStart();
  };

  const handleFireDown = () => {
    setIsStirring(false);
    if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
    tempIntervalRef.current = setInterval(() => {
      setRoastingTemp(prev => Math.max(0, prev - 3));
    }, 100);
  };

  useEffect(() => {
    if (isStirring) {
        setFireParticles(Array.from({ length: 50 }, (_, i) => i));
    } else {
        setFireParticles([]);
    }
  }, [isStirring]);

  useEffect(() => {
    return () => {
      if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
      if (roastTimerRef.current) clearInterval(roastTimerRef.current);
    };
  }, []);

  // =========================================================================
  // 泡茶阶段逻辑
  // =========================================================================

  const handleAddWater = () => {
    if (waterLevel < 100) {
      setWaterLevel(prev => Math.min(100, prev + randInt(8, 15)));
    }
  };

  const handleBrewFinish = () => {
    if (brewTimerRef.current) return;
    setBrewingProgress(0);
    const brewInterval = setInterval(() => {
      setBrewingProgress(prev => {
        if (prev >= 100) {
          clearInterval(brewInterval);
          setGameStage('finished');
          const waterScore = 100 - Math.abs(waterLevel - OPTIMAL_WATER_LEVEL) * 2;
          setTeaQuality(prev => ({ ...prev, brewing: waterScore }));
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    brewTimerRef.current = brewInterval;
  };

  // =========================================================================
  // 游戏结束逻辑和评分
  // =========================================================================
  useEffect(() => {
    if (gameStage === 'finished') {
      const finalPickingScore = (pickedLeavesCount / REQUIRED_LEAVES) * 100;
      const finalRoastingScore = (teaQuality.roasting / (ROAST_TIME_MS / 100)) * 100;
      const finalBrewingScore = teaQuality.brewing;
      const calculatedScore = (finalPickingScore * 0.4 + finalRoastingScore * 0.4 + finalBrewingScore * 0.2);
      setFinalScore(Math.round(calculatedScore));
    }
  }, [gameStage, pickedLeavesCount, teaQuality]);

  const resetGame = () => {
    setGameStage('picking');
    setPickedLeavesCount(0);
    setRoastingProgress(0);
    setRoastingTemp(0);
    setWaterLevel(0);
    setBrewingProgress(0);
    setFinalScore(0);
    setTeaQuality({ picking: 0, roasting: 0, brewing: 0 });
    setPickingTime(0);
    if (sceneRef.current) {
      sceneRef.current.children.forEach(obj => {
          if (obj.type === 'Mesh' || obj.type === 'Group') {
              sceneRef.current?.remove(obj);
          }
      });
      leafMeshesRef.current = [];
    }
  };

  const getPickingTimeComment = (time: number) => {
    if (time < 10) return "速度极快！";
    if (time < 20) return "手法熟练，恰到好处。";
    return "中规中矩，稳扎稳打。";
  };

  const renderCurrentStage = () => {
    switch (gameStage) {
      case 'picking':
        return (
          <motion.div
            key="picking"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-4">
                <Leaf className="w-12 h-12 text-bamboo-green mx-auto mb-2" />
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">采摘春茶</h2>
                <p className="ancient-text text-deep-ink leading-relaxed text-sm">
                  请旋转视角，找到并点击<strong className="text-bamboo-green">嫩芽（浅绿色）</strong>，收集{REQUIRED_LEAVES}片茶叶。
                </p>
                <div className="flex items-center justify-center mt-2 text-xs text-deep-ink">
                  <Move3d className="w-4 h-4 mr-1" />
                  使用鼠标拖拽旋转视角，滚轮缩放
                </div>
              </div>
              <div ref={mountRef} className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative">
                {/* three.js canvas will be mounted here */}
              </div>
              <div className="flex justify-between items-center mt-4 text-center text-sm font-semibold ancient-text text-deep-ink">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-ancient-gold" />
                  <span>剩余时间: {Math.max(0, PICKING_TIME_LIMIT - pickingTime)}s</span>
                </div>
                <span>已收集：<span className="text-bamboo-green">{pickedLeavesCount} / {REQUIRED_LEAVES}</span></span>
              </div>
              <Button
                onClick={() => {
                  setTeaQuality(prev => ({ ...prev, picking: pickedLeavesCount }));
                  setGameStage('roasting');
                  if (pickingTimerRef.current) clearInterval(pickingTimerRef.current);
                }}
                disabled={pickedLeavesCount < REQUIRED_LEAVES}
                className={`w-full mt-6 ancient-button text-lg ${
                  pickedLeavesCount < REQUIRED_LEAVES ? 'bg-gray-300 cursor-not-allowed' : ''
                }`}
              >
                继续炒茶 →
              </Button>
            </Card>
          </motion.div>
        );
      case 'roasting':
        return (
          <motion.div
            key="roasting"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-4">
                <Flame className="w-12 h-12 text-cinnabar-red mx-auto mb-2" />
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">文火炒制</h2>
                <p className="ancient-text text-deep-ink leading-relaxed text-sm">
                  按住按钮煽火，将温度维持在<strong className="text-cinnabar-red">60°C - 80°C</strong>区间内，持续{ROAST_TIME_MS / 1000}秒。
                </p>
              </div>
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="absolute bottom-8 w-40 h-20 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full border-4 border-bronze-gold shadow-lg" />
                <div className="absolute bottom-12 w-32 h-16">
                  {Array.from({ length: pickedLeavesCount }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-1 bg-bamboo-green rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: isStirring ? [1, 0.8, 1] : 1,
                        rotate: isStirring ? [0, 180, 360] : 0,
                      }}
                      transition={{
                        duration: 1,
                        repeat: isStirring ? Number.POSITIVE_INFINITY : 0,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                {isStirring && (
                  <div className="absolute bottom-20">
                    {fireParticles.map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-6 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full"
                        style={{ left: `${randFloat(-10, 10)}px`, bottom: "0px" }}
                        animate={{ 
                          height: [8, 24, 8], 
                          opacity: [0.8, 0.3, 0.8], 
                          y: [0, -randFloat(10, 30), 0] 
                        }}
                        transition={{ 
                          duration: randFloat(1, 2.5), 
                          repeat: Number.POSITIVE_INFINITY, 
                          delay: i * randFloat(0.1, 0.4) 
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* 温度计 */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-gray-200 rounded-full flex items-center overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transition-all duration-300" style={{ 
                    width: `${PERFECT_ROAST_TEMP_MAX - PERFECT_ROAST_TEMP_MIN}%`, 
                    marginLeft: `${PERFECT_ROAST_TEMP_MIN}%` 
                  }}></div>
                  <div className="absolute h-full bg-gradient-to-r from-yellow-500 to-red-600 rounded-full transition-all duration-300" style={{ width: `${roastingTemp}%` }}></div>
                  <p className="absolute left-1/2 -translate-x-1/2 text-sm text-white font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    {roastingTemp}°C
                  </p>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 w-24 h-24 bg-gray-700 rounded-full animate-pulse" />
              </div>

              <div className="space-y-3 mt-4">
                <Button
                  onMouseDown={handleFireUp}
                  onMouseUp={handleFireDown}
                  onTouchStart={handleFireUp}
                  onTouchEnd={handleFireDown}
                  disabled={roastingProgress >= 100}
                  className={`w-full ancient-button text-lg py-3 ${
                    isStirring ? 'bg-cinnabar-red hover:bg-red-700' : ''
                  }`}
                >
                  {roastingProgress >= 100 ? "炒制完成" : isStirring ? "煽火中..." : "煽火控制"}
                </Button>
                <div className="ancient-progress h-3 relative mt-4 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-bamboo-green to-jade-green rounded-full"
                    style={{ width: `${roastingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-center text-xs mt-2 ancient-text text-deep-ink">炒制进度: {Math.round(roastingProgress)}%</p>
              </div>
            </Card>
          </motion.div>
        );
      case 'brewing':
        return (
          <motion.div
            key="brewing"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
              <div className="text-center mb-4">
                <Coffee className="w-12 h-12 text-bronze-gold mx-auto mb-2" />
                <h2 className="text-xl font-bold ancient-title text-ink-black mb-2">品茗之乐</h2>
                <p className="ancient-text text-deep-ink leading-relaxed text-sm">
                  请按"加水"按钮，将水加到合适的位置，然后点击"泡茶"。
                </p>
              </div>
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="relative w-36 h-40 bg-gray-100 rounded-b-full border-4 border-gray-400 overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 w-full"
                    style={{
                      height: `${waterLevel}%`,
                      background: `linear-gradient(to top, #5d4037, #8d6e63)`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute w-full h-1 bg-green-500" style={{ top: `${100 - OPTIMAL_WATER_LEVEL}%` }} />
                  <div className="absolute top-0 left-0 w-full h-8 bg-gray-300 rounded-t-full border-b-4 border-gray-400" />
                  <div className="absolute top-8 left-4 w-28 h-4 bg-gray-200 rounded-full" />
                  <div className="absolute top-0 left-8 w-2 h-8 bg-gray-400 rounded-t-full" />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  水位: {waterLevel}%
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <Button
                  onClick={handleAddWater}
                  disabled={waterLevel >= 100}
                  className="w-full ancient-button text-lg py-3"
                >
                  加水 (+{randInt(8, 15)}%)
                </Button>
                <Button
                  onClick={handleBrewFinish}
                  disabled={brewingProgress > 0 || waterLevel === 0}
                  className="w-full ancient-button text-lg py-3 bg-bamboo-green hover:bg-jade-green"
                >
                  {brewingProgress > 0 ? "泡茶中..." : "开始泡茶"}
                </Button>
              </div>
            </Card>
          </motion.div>
        );
      case 'finished':
        const pickingScore = Math.round((pickedLeavesCount / REQUIRED_LEAVES) * 100);
        const roastingScore = Math.round((teaQuality.roasting / (ROAST_TIME_MS / 100)) * 100);
        const brewingScore = Math.round(teaQuality.brewing);
        
        return (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="ancient-card p-6 bg-gradient-to-br from-bamboo-green/10 to-ancient-gold/10">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-bamboo-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold ancient-title text-ink-black mb-2">茶道之旅，大功告成！</h3>
                <p className="ancient-text text-deep-ink mb-4">
                  恭喜您成功制作了宋代好茶，最终品质评分：
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="text-6xl font-extrabold text-ancient-gold my-4"
                >
                  {finalScore}
                </motion.div>
                <p className="ancient-text text-deep-ink mb-6">
                  {finalScore >= 80 ? "茶香四溢，妙手回春！" : finalScore >= 60 ? "滋味尚可，再接再厉！" : "茶汤略淡，仍需钻研。"}
                </p>
                
                {/* 详细评分 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                    <div className="text-bamboo-green font-bold">采摘</div>
                    <div className="text-2xl font-bold">{pickingScore}</div>
                    <div className="text-xs text-gray-600">{pickedLeavesCount}/{REQUIRED_LEAVES}片</div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                    <div className="text-cinnabar-red font-bold">炒制</div>
                    <div className="text-2xl font-bold">{roastingScore}</div>
                    <div className="text-xs text-gray-600">{Math.round(roastingScore)}%完美</div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                    <div className="text-bronze-gold font-bold">冲泡</div>
                    <div className="text-2xl font-bold">{brewingScore}</div>
                    <div className="text-xs text-gray-600">水位{waterLevel}%</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={resetGame} className="w-full ancient-button text-lg">
                      重新体验
                  </Button>
                  <Link href="/silk">
                    <Button className="w-full ancient-button text-lg">
                      下一站：锦绣华章 →
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full border-bamboo-green text-bamboo-green bg-transparent hover:bg-bamboo-green/10">
                      返回首页
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-bamboo-green/10 relative overflow-hidden">
      <style jsx global>{`
        .ancient-progress {
          background-color: #e6d9c9;
          border-radius: 9999px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .ancient-button {
          background: linear-gradient(to bottom, #d4a017, #b8860b);
          color: white;
          border: none;
          border-radius: 9999px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .ancient-button:hover {
          background: linear-gradient(to bottom, #b8860b, #9a6d0a);
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        .ancient-button:active {
          transform: translateY(1px);
        }
        .ancient-card {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2d5c0;
        }
        .ancient-title {
          font-family: 'SimSun', serif;
          letter-spacing: 1px;
        }
        .ancient-text {
          font-family: 'KaiTi', serif;
        }
      `}</style>
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 430 128" fill="none">
          <path d="M0,128 Q107.5,80 215,90 T430,85 L430,128 Z" fill="url(#tea-mountain-gradient)" />
          <path d="M0,128 Q150,100 300,105 T430,100 L430,128 Z" fill="url(#tea-mountain-gradient-2)" />
          <defs>
            <linearGradient id="tea-mountain-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5d23" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a2e" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="tea-mountain-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a2e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f2419" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-ink-black hover:bg-ancient-gold/10 ancient-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold ancient-title text-ink-black">茶禅一味</h1>
            <p className="text-sm text-ancient-gold ancient-text">东坡品茗</p>
          </div>
          <div className="w-16" />
        </div>
        <Card className="ancient-card p-4 mb-6 bg-gradient-to-br from-ivory-white to-rice-paper">
          <div className="text-center h-20 flex flex-col items-center justify-center">
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
