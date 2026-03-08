/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Calendar, Layers, Info, X, Github, ArrowLeft, Heart, ChevronDown, ChevronRight, LayoutGrid, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { slidesData } from './data';
import { ElephantSlide, SlideStatus } from './types';
import Home from './components/Home';
import PuzzleGame from './components/PuzzleGame';
import ContributeForm from './components/ContributeForm';
import { ElephantIcon } from './components/ElephantIcon';

export default function App() {
  const [view, setView] = useState<'home' | 'database' | 'game'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([1960, 2000]);
  const [selectedSlide, setSelectedSlide] = useState<ElephantSlide | null>(null);
  const [hoveredSlideId, setHoveredSlideId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('elephant-slides-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);
  const [expandedCities, setExpandedCities] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [displayMode, setDisplayMode] = useState<'map' | 'grid'>('map');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false); // Default closed on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem('elephant-slides-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const toggleProvince = (province: string) => {
    setExpandedProvinces(prev => prev.includes(province) ? prev.filter(p => p !== province) : [...prev, province]);
  };

  const toggleCity = (cityKey: string) => {
    setExpandedCities(prev => prev.includes(cityKey) ? prev.filter(c => c !== cityKey) : [...prev, cityKey]);
  };

  const handleContributeSubmit = (data: any) => {
    console.log('New contribution:', data);
    // In a real app, this would send data to a backend
    // For now, we just log it and maybe show a toast (handled in the form component)
  };

  const materials = Array.from(new Set(slidesData.map(s => s.material)));

  const filteredSlides = useMemo(() => {
    return slidesData.filter(slide => {
      const matchesSearch = 
        slide.nickname.includes(searchTerm) || 
        slide.city.includes(searchTerm) || 
        slide.id.includes(searchTerm);
      const matchesMaterial = selectedMaterial ? slide.material === selectedMaterial : true;
      const matchesYear = slide.buildYear >= yearRange[0] && slide.buildYear <= yearRange[1];
      const matchesFavorite = showFavoritesOnly ? favorites.includes(slide.id) : true;
      
      return matchesSearch && matchesMaterial && matchesYear && matchesFavorite;
    });
  }, [searchTerm, selectedMaterial, yearRange, showFavoritesOnly, favorites]);

  const groupedSlides = useMemo(() => {
    const groups: Record<string, Record<string, ElephantSlide[]>> = {};
    filteredSlides.forEach(slide => {
      const provinceMatch = slide.description.match(/所在省份:\s*(.+)/);
      const province = provinceMatch ? provinceMatch[1].trim() : '其他';
      const city = slide.city || '其他';

      if (!groups[province]) groups[province] = {};
      if (!groups[province][city]) groups[province][city] = [];
      groups[province][city].push(slide);
    });
    return groups;
  }, [filteredSlides]);

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
    <div className="flex flex-col h-screen h-[100dvh] bg-[#f4f5f7] text-slate-800 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setView('home')}
            className="p-1.5 md:p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="返回首页"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-[#7a808d] rounded-lg flex items-center justify-center">
              <ElephantIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h1 className="text-base md:text-xl font-serif font-semibold tracking-tight text-slate-900">全国大象滑梯图鉴</h1>
          </div>
        </div>
        
        <div className="flex-1"></div>

        <div className="flex items-center gap-2 md:gap-4 text-sm">
          <button 
            onClick={() => setDisplayMode(displayMode === 'map' ? 'grid' : 'map')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors px-2 md:px-3 py-1.5 rounded-full hover:bg-slate-50"
            title={displayMode === 'map' ? "切换至列表视图" : "切换至地图视图"}
          >
            {displayMode === 'map' ? <LayoutGrid className="w-4 h-4" /> : <Map className="w-4 h-4" />}
            <span className="hidden md:inline">{displayMode === 'map' ? "列表视图" : "地图视图"}</span>
          </button>
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 transition-colors px-2 md:px-3 py-1.5 rounded-full ${showFavoritesOnly ? 'bg-red-50 text-red-500' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">收藏夹</span>
          </button>
          <button 
            onClick={() => setIsContributeOpen(true)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors px-2 py-1.5"
          >
            <Github className="w-4 h-4" />
            <span className="hidden md:inline">贡献数据</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {displayMode === 'map' ? (
          <>
        {/* Left: Map */}
        <div className="flex-1 h-full relative border-r border-slate-200 bg-slate-100 z-0">
          <iframe 
            src="https://www.google.com/maps/d/embed?mid=1J1_JVivWfqEfDzc8Pajs6o2MKAX0K6M&ehbc=2E312F" 
            className="w-full h-full border-0"
            title="大象滑梯位置信息动态互动地图"
          />
          
          {/* Sidebar Toggle Button (Floating on Map Edge) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-[410] bg-white border border-slate-200 shadow-md p-1.5 rounded-l-lg rounded-r-none hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center w-8 h-16"
            style={{ right: 0, transform: 'translateY(-50%)' }}
            title={isSidebarOpen ? "收起列表" : "展开列表"}
          >
            {isSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          
          {/* Map Overlay Filters */}
          <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row gap-4 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 pointer-events-auto flex-1 max-w-md">
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

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 pointer-events-auto flex-1 max-w-md">
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

        {/* Right: List (Collapsible Sidebar) */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isSidebarOpen ? (isMobile ? '100%' : 540) : 0,
            x: isMobile && !isSidebarOpen ? '100%' : 0 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`h-full bg-[#f4f5f7] border-l border-slate-200 overflow-hidden flex flex-col shadow-xl z-20 ${isMobile ? 'absolute right-0 top-0 bottom-0' : 'relative'}`}
        >
          <div className="p-6 flex-none bg-white border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-800">档案列表</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">{filteredSlides.length} results</span>
                {isMobile && (
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="搜索编号、城市或昵称..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7a808d] focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-4">
            {Object.entries(groupedSlides).map(([province, cities]) => {
              const isProvinceExpanded = expandedProvinces.includes(province);
              const provinceSlideCount = Object.values(cities).reduce((acc, slides) => acc + slides.length, 0);
              
              return (
                <div key={province} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button 
                    onClick={() => toggleProvince(province)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isProvinceExpanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                      <h3 className="text-base font-semibold text-slate-800">{province}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">{provinceSlideCount}</span>
                  </button>
                  
                  <AnimatePresence>
                    {isProvinceExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 flex flex-col gap-3 border-t border-slate-200">
                          {Object.entries(cities).map(([city, slides]) => {
                            const cityKey = `${province}-${city}`;
                            const isCityExpanded = expandedCities.includes(cityKey);
                            
                            return (
                              <div key={cityKey} className="border border-slate-100 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => toggleCity(cityKey)}
                                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    {isCityExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    <h4 className="text-sm font-medium text-slate-700">{city}</h4>
                                  </div>
                                  <span className="text-xs font-mono text-slate-400">{slides.length}</span>
                                </button>
                                
                                <AnimatePresence>
                                  {isCityExpanded && (
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-3">
                                        {slides.map(slide => (
                                          <motion.div 
                                            key={slide.id}
                                            layoutId={`card-${slide.id}`}
                                            onClick={() => setSelectedSlide(slide)}
                                            onMouseEnter={() => setHoveredSlideId(slide.id)}
                                            onMouseLeave={() => setHoveredSlideId(null)}
                                            className="bg-white rounded-lg p-4 cursor-pointer border border-slate-200 hover:border-[#7a808d]/30 hover:shadow-sm transition-all group relative overflow-hidden"
                                          >
                                            <div className="flex justify-between items-start mb-3">
                                              <div>
                                                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#7a808d] transition-colors">{slide.nickname}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                                  <MapPin className="w-3 h-3" />
                                                  <span>{slide.location}</span>
                                                </div>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(slide.status)}`}></span>
                                                  <span className="text-[10px] font-medium text-slate-600">{getStatusText(slide.status)}</span>
                                                </div>
                                                <button 
                                                  onClick={(e) => toggleFavorite(e, slide.id)}
                                                  className={`ml-2 p-1.5 rounded-full transition-colors ${favorites.includes(slide.id) ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                                                >
                                                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(slide.id) ? 'fill-current' : ''}`} />
                                                </button>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 mb-2">
                                              <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{slide.buildYear}年</span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <Layers className="w-3 h-3" />
                                                <span>{slide.material}</span>
                                              </div>
                                            </div>

                                            {/* Hover Preview */}
                                            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                                              <p className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100">
                                                {slide.description}
                                              </p>
                                            </div>

                                            <div className="absolute bottom-2 right-3">
                                              <span className="text-[9px] font-mono text-slate-300 tracking-wider">{slide.id}</span>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          
          {filteredSlides.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Info className="w-8 h-8 mb-2 opacity-50" />
              <p>没有找到符合条件的大象滑梯</p>
            </div>
          )}
          </div>
        </motion.div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-[#f4f5f7] p-4 md:p-8">
            {/* Filters Header */}
            <div className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="搜索编号、城市或昵称..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#7a808d] focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">材质筛选</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedMaterial(null)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${!selectedMaterial ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      全部
                    </button>
                    {materials.map(mat => (
                      <button 
                        key={mat}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedMaterial === mat ? 'bg-[#b2c8b2] text-slate-900 font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">年代分布</h3>
                    </div>
                    <span className="text-sm font-mono text-slate-500">{yearRange[0]} - {yearRange[1]}</span>
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

            {/* Grid Content */}
            <div className="max-w-7xl mx-auto space-y-12">
              {Object.entries(groupedSlides).map(([province, cities]) => (
                <div key={province}>
                  <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2 sticky top-0 bg-[#f4f5f7]/95 backdrop-blur-sm py-4 z-10">
                    <MapPin className="w-6 h-6 text-slate-400" />
                    {province}
                    <span className="text-sm font-normal text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 ml-2">
                      {Object.values(cities).reduce((acc, slides) => acc + slides.length, 0)}
                    </span>
                  </h2>
                  <div className="space-y-8 pl-4 md:pl-8 border-l-2 border-slate-200 ml-3">
                    {Object.entries(cities).map(([city, slides]) => (
                      <div key={city}>
                        <h3 className="text-lg font-medium text-slate-600 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          {city}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {slides.map(slide => (
                            <motion.div 
                              key={slide.id}
                              layoutId={`card-${slide.id}`}
                              onClick={() => setSelectedSlide(slide)}
                              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 hover:border-[#7a808d]/30 transition-all"
                            >
                              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                {slide.imageUrl ? (
                                  <img 
                                    src={slide.imageUrl} 
                                    alt={slide.nickname}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                    <ElephantIcon className="w-12 h-12 opacity-20" />
                                  </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                  {slide.status === 'demolished' && (
                                    <div className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                                      已拆除
                                    </div>
                                  )}
                                  <button 
                                    onClick={(e) => toggleFavorite(e, slide.id)}
                                    className={`p-1.5 rounded-full backdrop-blur-md shadow-sm transition-colors ${favorites.includes(slide.id) ? 'bg-white text-red-500' : 'bg-black/20 text-white hover:bg-white hover:text-red-500'}`}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(slide.id) ? 'fill-current' : ''}`} />
                                  </button>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium text-slate-600 shadow-sm">
                                  {slide.id}
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <h3 className="text-lg font-serif font-bold mb-1 text-slate-900 group-hover:text-[#7a808d] transition-colors line-clamp-1">{slide.nickname}</h3>
                                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="line-clamp-1">{slide.location}</span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{slide.buildYear}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Layers className="w-3 h-3" />
                                    <span>{slide.material}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredSlides.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Info className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg">没有找到符合条件的大象滑梯</p>
                </div>
              )}
            </div>
          </div>
        )}
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
                <button 
                  onClick={(e) => toggleFavorite(e, selectedSlide.id)}
                  className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-colors ${favorites.includes(selectedSlide.id) ? 'bg-white text-red-500' : 'bg-white/90 text-slate-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(selectedSlide.id) ? 'fill-current' : ''}`} />
                </button>
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
                  <table className="w-full text-sm text-left border-collapse">
                    <tbody>
                      {selectedSlide.description.split('\n').map((line, index) => {
                        const parts = line.split(':');
                        if (parts.length < 2) return null;
                        const label = parts[0].trim();
                        const value = parts.slice(1).join(':').trim();
                        if (!label || !value) return null;
                        
                        return (
                          <tr key={index}>
                            <td className="py-2 pr-4 text-slate-500 font-medium whitespace-nowrap align-top w-24">{label}</td>
                            <td className="py-2 text-slate-800 align-top">{value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedSlide.relatedArticles && selectedSlide.relatedArticles.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">相关科普</h3>
                    <div className="flex flex-col gap-3">
                      {selectedSlide.relatedArticles.map((article, idx) => (
                        <a 
                          key={idx}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-900 group-hover:text-[#7a808d] transition-colors mb-1">
                              {article.title}
                            </h4>
                            {article.source && (
                              <span className="text-xs text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {article.source}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

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

      <ContributeForm 
        isOpen={isContributeOpen} 
        onClose={() => setIsContributeOpen(false)} 
        onSubmit={handleContributeSubmit} 
      />
    </div>
  );
}
