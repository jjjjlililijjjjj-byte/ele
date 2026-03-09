import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

// 9 Unique Illustration SVGs for Elephant Slides
const SVG_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F3E8E0"/><stop offset="100%" style="stop-color:#D5C5B5"/></linearGradient></defs><rect width="400" height="400" fill="url(#g1)"/><g transform="scale(1.2) translate(-30, -20)" stroke="#3A2E2A" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M100,250 C100,150 250,150 250,250 L250,350 L100,350 Z" fill="#D5C5B5"/><path d="M120,350 L120,380 L160,380 L160,350" fill="#D5C5B5"/><path d="M190,350 L190,380 L230,380 L230,350" fill="#D5C5B5"/><path d="M250,200 C320,200 350,250 350,320 L380,320 C380,220 320,170 250,170 Z" fill="#A8B5A1"/><path d="M150,180 C120,180 100,220 120,260 C140,280 180,260 170,210 Z" fill="#E5A999"/><circle cx="210" cy="190" r="6" fill="#3A2E2A" stroke="none"/><path d="M100,220 C70,220 60,250 70,280" fill="none"/></g></svg>`;
const SVG_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E2E8DD"/><stop offset="100%" style="stop-color:#B8C6B7"/></linearGradient></defs><rect width="400" height="400" fill="url(#g2)"/><g transform="scale(1.1) translate(-20, -10)" stroke="#2C363F" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M40,350 L40,200 L80,200 L80,250 L120,250 L120,300 L160,300 L160,350 Z" fill="#D6A2AD"/><path d="M160,200 C160,100 300,100 300,200 L300,350 L160,350 Z" fill="#8B9EB7"/><path d="M300,180 C360,180 380,250 350,320 L320,300 C340,250 320,210 300,210 Z" fill="#F2D0A4"/><path d="M200,150 C160,130 140,180 160,220 C180,250 230,220 220,170 Z" fill="#F2D0A4"/><path d="M260,160 Q270,150 280,160" fill="none"/></g></svg>`;
const SVG_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F4E1D2"/><stop offset="100%" style="stop-color:#D9B4A6"/></linearGradient></defs><rect width="400" height="400" fill="url(#g3)"/><g transform="scale(1.1) translate(-20, -10)" stroke="#4A3B32" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M50,350 L350,350 L350,380 L50,380 Z" fill="#A79C93"/><path d="M100,250 C100,150 200,150 200,250 L200,350 L100,350 Z" fill="#D9B4A6"/><path d="M100,200 C50,200 30,250 50,320 L80,300 C60,250 80,230 100,230 Z" fill="#8CABA1"/><circle cx="130" cy="190" r="5" fill="#4A3B32" stroke="none"/><path d="M200,250 C200,150 300,150 300,250 L300,350 L200,350 Z" fill="#D9B4A6"/><path d="M300,200 C350,200 370,250 350,320 L320,300 C340,250 320,230 300,230 Z" fill="#8CABA1"/><circle cx="270" cy="190" r="5" fill="#4A3B32" stroke="none"/><path d="M150,150 L250,150 L250,180 L150,180 Z" fill="#D9B4A6"/></g></svg>`;
const SVG_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#DDE6ED"/><stop offset="100%" style="stop-color:#9DB2BF"/></linearGradient></defs><rect width="400" height="400" fill="url(#g4)"/><g transform="scale(1.1) translate(-20, -10)" stroke="#27374D" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M120,350 L120,220 C120,150 280,150 280,220 L280,350 Z" fill="#9DB2BF"/><path d="M280,200 C350,200 380,250 380,320 L350,320 C350,250 320,220 280,220 Z" fill="#526D82"/><circle cx="160" cy="200" r="15" fill="#FFF" stroke="#27374D"/><circle cx="160" cy="200" r="5" fill="#27374D"/><path d="M120,250 L80,250 L80,350 L120,350 Z" fill="#9DB2BF"/></g></svg>`;
const SVG_5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F9F7F7"/><stop offset="100%" style="stop-color:#DBE2EF"/></linearGradient></defs><rect width="400" height="400" fill="url(#g5)"/><g transform="scale(1.1) translate(-20, -10)" stroke="#112D4E" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M150,350 L150,250 C150,180 300,180 300,250 L300,350 Z" fill="#DBE2EF"/><path d="M300,230 C370,230 390,280 390,340 L360,340 C360,280 340,250 300,250 Z" fill="#3F72AF"/><path d="M150,220 C120,200 100,250 120,280 C140,310 180,280 170,240 Z" fill="#3F72AF"/><path d="M220,210 Q230,200 240,210" fill="none"/></g></svg>`;
const SVG_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFF4E0"/><stop offset="100%" style="stop-color:#FFB1B1"/></linearGradient></defs><rect width="400" height="400" fill="url(#g6)"/><g transform="scale(1.1) translate(-20, -10)" stroke="#4D4D4D" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M80,350 L80,200 C80,120 220,120 220,200 L220,350 Z" fill="#FF8E9E"/><path d="M220,180 C290,180 320,230 320,300 L290,300 C290,230 260,200 220,200 Z" fill="#FFB1B1"/><circle cx="130" cy="160" r="10" fill="#FFF"/><circle cx="130" cy="160" r="4" fill="#4D4D4D"/><path d="M80,220 L40,220 L40,350 L80,350 Z" fill="#FF8E9E"/></g></svg>`;
const SVG_7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E8F9FD"/><stop offset="100%" style="stop-color:#79DAE8"/></linearGradient></defs><rect width="400" height="400" fill="url(#g7)"/><g transform="scale(1.1) translate(-20, -10)" stroke="#2155CD" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"><path d="M180,350 L180,250 C180,180 330,180 330,250 L330,350 Z" fill="#79DAE8"/><path d="M330,230 C390,230 410,280 410,340 L380,340 C380,280 360,250 330,250 Z" fill="#0AA1DD"/><path d="M180,220 C150,200 130,250 150,280 C170,310 210,280 200,240 Z" fill="#0AA1DD"/><path d="M250,210 Q260,200 270,210" fill="none"/></g></svg>`;

const LEVELS = [
  { id: 1, grid: 2, name: '初见大象 (1/7)', svg: SVG_1 },
  { id: 2, grid: 2, name: '滑梯岁月 (2/7)', svg: SVG_2 },
  { id: 3, grid: 3, name: '双象奇缘 (3/7)', svg: SVG_3 },
  { id: 4, grid: 3, name: '童年记忆 (4/7)', svg: SVG_4 },
  { id: 5, grid: 4, name: '快乐时光 (5/7)', svg: SVG_5 },
  { id: 6, grid: 4, name: '公园一角 (6/7)', svg: SVG_6 },
  { id: 7, grid: 5, name: '终极挑战 (7/7)', svg: SVG_7 },
];

function shuffleArray(array: number[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

interface PuzzleGameProps {
  onBack: () => void;
}

export default function PuzzleGame({ onBack }: PuzzleGameProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [certNo] = useState(() => Math.floor(Math.random() * 10000).toString().padStart(4, '0'));

  useEffect(() => {
    startLevel(currentLevelIdx);
  }, [currentLevelIdx]);

  const startLevel = (levelIdx: number) => {
    const level = LEVELS[levelIdx];
    const numPieces = level.grid * level.grid;
    let initialPieces = Array.from({ length: numPieces }, (_, i) => i);
    
    let shuffled = shuffleArray(initialPieces);
    // Ensure it's not already solved
    while (shuffled.every((val, i) => val === i) && numPieces > 1) {
      shuffled = shuffleArray(initialPieces);
    }
    
    setPieces(shuffled);
    setIsSolved(false);
    setSelectedIdx(null);
  };

  const handlePieceClick = (idx: number) => {
    if (isSolved) return;
    
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null); // Deselect
        return;
      }
      
      const newPieces = [...pieces];
      [newPieces[selectedIdx], newPieces[idx]] = [newPieces[idx], newPieces[selectedIdx]];
      setPieces(newPieces);
      setSelectedIdx(null);
      
      if (newPieces.every((val, i) => val === i)) {
        setIsSolved(true);
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    startLevel(currentLevelIdx);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-[#fdfdfc] flex flex-col items-center justify-center p-6 text-center font-sans">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">通关成功！</h2>
          <p className="text-slate-600 mb-8">
            恭喜你完成全部7关挑战，获得了大象滑梯终极收藏家称号。
          </p>
          
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-8 relative border-4 border-slate-900 shadow-lg">
             <img 
               src={`data:image/svg+xml;utf8,${encodeURIComponent(LEVELS[6].svg)}`} 
               alt="Exclusive Elephant Slide"
               className="w-full h-full object-cover" 
             />
             <div className="absolute bottom-0 left-0 right-0 bg-slate-900 text-white text-xs py-2 font-mono tracking-widest">
               CERTIFICATE NO. {certNo}
             </div>
             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
               终极典藏版
             </div>
          </div>
          
          <button 
            onClick={onBack}
            className="w-full bg-slate-900 text-white py-3.5 rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            返回首页 <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  const level = LEVELS[currentLevelIdx];
  const gridSize = level.grid;
  const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(level.svg)}`;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fdfdfc] text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-none px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="font-serif font-semibold text-lg">趣味拼图</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHint(!showHint)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${showHint ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {showHint ? '隐藏提示' : '显示提示'}
          </button>
          <button 
            onClick={handleRestart}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="重新开始本关"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="text-center mb-4 md:mb-8">
          <p className="text-xs md:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-1">
            LEVEL {currentLevelIdx + 1} / {LEVELS.length}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">{level.name}</h2>
          <p className="text-slate-500 text-xs md:text-sm">点击两个图块交换位置，拼出完整图案</p>
        </div>

        <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square mx-auto">
          <div 
            className="absolute inset-0 grid gap-1 bg-slate-200 p-1 rounded-xl shadow-inner"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            <AnimatePresence>
              {pieces.map((pieceId, idx) => {
                const correctRow = Math.floor(pieceId / gridSize);
                const correctCol = pieceId % gridSize;
                
                return (
                  <motion.div
                    key={pieceId}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={() => handlePieceClick(idx)}
                    className={`relative cursor-pointer rounded-sm overflow-hidden bg-white group ${selectedIdx === idx ? 'ring-4 ring-slate-900 z-10 scale-95' : 'z-0 hover:opacity-90'}`}
                    style={{
                      backgroundImage: `url("${imageUrl}")`,
                      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                      backgroundPosition: `${(correctCol / (gridSize - 1)) * 100}% ${(correctRow / (gridSize - 1)) * 100}%`,
                    }}
                  >
                    {/* Unique identifier for each tile to make them "different" */}
                    <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                    {showHint && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <span className="text-white font-bold text-lg drop-shadow-md">
                          {pieceId + 1}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {isSolved && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20"
              >
                <motion.div
                  initial={{ scale: 0.5, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-center p-4"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-4 md:mb-6">拼图完成！</h3>
                  <button 
                    onClick={handleNextLevel}
                    className="bg-slate-900 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-slate-800 transition-colors shadow-md"
                  >
                    {currentLevelIdx < LEVELS.length - 1 ? '下一关' : '领取证书'}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
