/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Layers, Info, X, Github, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { slidesData } from './data';
import { ElephantSlide, SlideStatus } from './types';
import Home from './components/Home';
import PuzzleGame from './components/PuzzleGame';
import { ElephantIcon } from './components/ElephantIcon';

export default function App() {
  const [view, setView] = useState<'home' | 'database' | 'game'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([1960, 2000]);
  const [selectedSlide, setSelectedSlide] = useState<ElephantSlide | null>(null);
  const [hoveredSlideId, setHoveredSlideId] = useState<string | null>(null);

  const materials = Array.from(new Set(slidesData.map(s => s.material)));

  const filteredSlides = useMemo(() => {
    return slidesData.filter(slide => {
      const matchesSearch = 
        slide.nickname.includes(searchTerm) || 
        slide.city.includes(searchTerm) || 
        slide.id.includes(searchTerm);
      const matchesMaterial = selectedMaterial ? slide.material === selectedMaterial : true;
      const matchesYear = slide.buildYear >= yearRange[0] && slide.buildYear <= yearRange[1];
      
      return matchesSearch && matchesMaterial && matchesYear;
    });
  }, [searchTerm, selectedMaterial, yearRange]);

  const getStatusColor = (status: SlideStatus) => {
    switch(status) {
      case 'existing': return 'bg-green-500';
      case 'demolished': return 'bg-red-500';
      case 'unverified': return 'bg-orange-500';
    }
  };

  const getStatusText = (status: SlideStatus) => {
    switch(status) {
      case 'existing': return '存世';
      case 'demolished': return '已拆除';
      case 'unverified': return '待核实';
    }
  };

  if (view === 'game') {
    return <PuzzleGame onBack={() => setView('home')} />;
  }

  if (view === 'home') {
    return <Home onExplore={() => setView('database')} onPlayGame={() => setView('game')} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#f4f5f7] text-slate-800 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('home')}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="返回首页"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7a808d] rounded-lg flex items-center justify-center">
              <ElephantIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-serif font-semibold tracking-tight text-slate-900">全国大象滑梯图鉴</h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索编号、城市或昵称..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#7a808d] focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
            <Github className="w-4 h-4" />
            <span>贡献数据</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Map */}
        <div className="w-1/2 h-full relative border-r border-slate-200 bg-slate-100 z-0">
          <iframe 
            src="https://www.google.com/maps/d/embed?mid=1J1_JVivWfqEfDzc8Pajs6o2MKAX0K6M&ehbc=2E312F" 
            className="w-full h-full border-0"
            title="大象滑梯位置信息动态互动地图"
          />
          
          {/* Map Overlay Filters */}
          <div className="absolute top-4 left-4 right-4 z-[400] flex gap-4 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 pointer-events-auto flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">材质筛选</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedMaterial(null)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${!selectedMaterial ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  全部
                </button>
                {materials.map(mat => (
                  <button 
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${selectedMaterial === mat ? 'bg-[#b2c8b2] text-slate-900 font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 pointer-events-auto flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">年代分布</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{yearRange[0]} - {yearRange[1]}</span>
              </div>
              <input 
                type="range" 
                min="1950" 
                max="2020" 
                step="5"
                value={yearRange[1]} 
                onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                className="w-full accent-[#7a808d]"
              />
            </div>
          </div>
        </div>

        {/* Right: List */}
        <div className="w-1/2 h-full overflow-y-auto bg-[#f4f5f7] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-slate-800">档案列表</h2>
            <span className="text-sm text-slate-500 font-mono">{filteredSlides.length} results</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredSlides.map(slide => (
              <motion.div 
                key={slide.id}
                layoutId={`card-${slide.id}`}
                onClick={() => setSelectedSlide(slide)}
                onMouseEnter={() => setHoveredSlideId(slide.id)}
                onMouseLeave={() => setHoveredSlideId(null)}
                className="bg-white rounded-xl p-5 cursor-pointer border border-slate-200 hover:border-[#7a808d]/30 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#7a808d] transition-colors">{slide.nickname}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{slide.city} · {slide.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(slide.status)}`}></span>
                    <span className="text-xs font-medium text-slate-600">{getStatusText(slide.status)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{slide.buildYear}年</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{slide.material}</span>
                  </div>
                </div>

                {/* Hover Preview (Lightning Browse) */}
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                  <p className="text-sm text-slate-600 line-clamp-2 mt-2 pt-3 border-t border-slate-100">
                    {slide.description}
                  </p>
                </div>

                <div className="absolute bottom-3 right-4">
                  <span className="text-[10px] font-mono text-slate-300 tracking-wider">{slide.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredSlides.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Info className="w-8 h-8 mb-2 opacity-50" />
              <p>没有找到符合条件的大象滑梯</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedSlide && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSlide(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[500]"
            />
            <motion.div 
              layoutId={`card-${selectedSlide.id}`}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[501] overflow-y-auto border-l border-slate-200"
            >
              <div className="relative h-64 bg-slate-100">
                <img 
                  src={selectedSlide.imageUrl} 
                  alt={selectedSlide.nickname}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${selectedSlide.id}/600/400`;
                  }}
                />
                <button 
                  onClick={() => setSelectedSlide(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedSlide.status)}`}></span>
                  <span className="text-xs font-semibold text-slate-800">{getStatusText(selectedSlide.status)}</span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedSlide.nickname}</h2>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedSlide.city} · {selectedSlide.location}</span>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{selectedSlide.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#f4f5f7] p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">建成年代</span>
                    </div>
                    <p className="text-lg font-medium text-slate-900">{selectedSlide.buildYear}年</p>
                  </div>
                  <div className="bg-[#e8e4d9]/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">主要材质</span>
                    </div>
                    <p className="text-lg font-medium text-slate-900">{selectedSlide.material}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">档案记录</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedSlide.description}
                  </p>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>坐标: {selectedSlide.coordinates[0].toFixed(4)}, {selectedSlide.coordinates[1].toFixed(4)}</span>
                    <button className="text-[#7a808d] hover:text-slate-900 font-medium transition-colors">
                      提供补充信息
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
