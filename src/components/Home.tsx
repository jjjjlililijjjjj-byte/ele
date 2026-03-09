import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin, Sparkles, RefreshCw, X, Mail, Copy, Check } from 'lucide-react';
import { slidesData } from '../data';
import { ElephantIcon } from './ElephantIcon';
import { ImageWithSkeleton } from './ImageWithSkeleton';

interface HomeProps {
  onExplore: () => void;
  onPlayGame: () => void;
}

export default function Home({ onExplore, onPlayGame }: HomeProps) {
  // State for featured slides with shuffle functionality
  const [featuredSlides, setFeaturedSlides] = useState(() => {
    const validSlides = slidesData.filter(slide => slide.imageUrl && slide.imageUrl.startsWith('http'));
    return [...validSlides].sort(() => Math.random() - 0.5).slice(0, 6);
  });
  
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleRefresh = () => {
    const validSlides = slidesData.filter(slide => slide.imageUrl && slide.imageUrl.startsWith('http'));
    setFeaturedSlides([...validSlides].sort(() => Math.random() - 0.5).slice(0, 6));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('15599588842@163.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Filter slides with valid images for background rotation
  const backgroundImages = useMemo(() => {
    return slidesData
      .filter(slide => slide.imageUrl && slide.imageUrl.startsWith('http'))
      .map(slide => slide.imageUrl)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Limit to 10 images for rotation to save memory/bandwidth
  }, []);

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    if (backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [backgroundImages]);

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        for (let name of names) caches.delete(name);
      });
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) registration.unregister();
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fdfdfc] text-slate-900 font-sans overflow-y-auto">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-semibold text-lg tracking-wide">中国大象滑梯图鉴</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8 text-sm font-medium">
            <a href="#" className="text-slate-900 hidden md:block">首页</a>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="text-slate-500 hover:text-slate-900 transition-colors hidden md:block"
            >
              联系我们
            </button>
            <button 
              onClick={onExplore}
              className="bg-slate-900 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs md:text-sm"
            >
              探索地图 <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            {backgroundImages.length > 0 && (
              <motion.div 
                key={currentBgIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <ImageWithSkeleton 
                  src={backgroundImages[currentBgIndex]} 
                  alt="Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  containerClassName="w-full h-full"
                  skeletonClassName="bg-slate-800"
                  width={1200}
                  loading="eager"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" /> {/* Overlay for text readability */}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-xs md:text-base font-semibold tracking-[0.3em] text-white/80 uppercase mb-4 md:mb-6 drop-shadow-md">
              Digital Archaeology & Preservation
            </p>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] mb-6 md:mb-8 tracking-tight drop-shadow-lg">
              寻找中国<br />大象滑梯的记忆
            </h1>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Content Section */}
      <main className="relative bg-white z-10">
        {/* Intro Text */}
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 font-serif text-lg md:text-xl leading-loose text-slate-800 space-y-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            水磨石的温润，水泥的坚固。它们曾是几代人童年最珍贵的游乐场，如今正随着城市更新悄然消失。这是一场与时间赛跑的数字化考古。
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-1 bg-slate-200 mx-auto"
          />

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-left space-y-8"
          >
            <p>
              在20世纪70年代至90年代的中国，几乎每个城市的公园、社区和学校里，都能找到一座大象滑梯。它们大多由水磨石或水泥浇筑而成，造型憨态可掬，象鼻化作长长的滑道，承载了无数孩童的欢声笑语。
            </p>
            <p>
              然而，随着时代的发展和安全标准的更新，这些曾经的“游乐场顶流”正面临着被拆除或遗弃的命运。新型的塑料游乐设施取代了它们的位置，水磨石大象逐渐退出了历史舞台。
            </p>
          </motion.div>
          
          <motion.blockquote 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="border-l-4 border-slate-900 pl-6 py-2 italic text-2xl text-slate-600 text-left my-12"
          >
            "它们不仅是游乐设施，更是城市公共空间的时代印记，是几代人共同的集体记忆。"
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-left"
          >
            为了留住这些珍贵的记忆，我们发起了“全国大象滑梯数字化考古与科普计划”。通过众包的力量，我们正在全国范围内寻找、记录和标记现存或已消失的大象滑梯。
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-serif font-bold">精选档案</h2>
              <button 
                onClick={handleRefresh}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                title="换一批"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <button onClick={onExplore} className="text-sm font-medium hover:text-slate-500 transition-colors">
              查看全部 {slidesData.length} 座滑梯 →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSlides.map((slide, index) => (
              <motion.div 
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={onExplore}
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-4 relative">
                  <ImageWithSkeleton 
                    src={slide.imageUrl} 
                    alt={slide.nickname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    containerClassName="w-full h-full"
                    width={400}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  {slide.status === 'demolished' && (
                    <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-20">
                      已拆除
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-serif font-bold mb-1 group-hover:text-slate-600 transition-colors">{slide.nickname}</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{slide.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 text-center bg-slate-50 rounded-3xl py-20">
          <h2 className="text-4xl font-serif font-bold mb-6">准备好开始探索了吗？</h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto">
            进入我们的互动地图，浏览全国 {slidesData.length} 座大象滑梯的详细档案。你也可以提交你身边的大象滑梯线索，成为这场数字化考古的一员。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onExplore}
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              进入互动地图 <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onPlayGame}
              className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-50 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" /> 趣味拼图挑战
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© 2024 全国大象滑梯图鉴计划. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <button onClick={handleClearCache} className="hover:text-slate-900 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> 清除缓存
            </button>
            <a href="#" className="hover:text-slate-900">关于我们</a>
            <a href="#" className="hover:text-slate-900">数据贡献</a>
            <a href="#" className="hover:text-slate-900">联系方式</a>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            >
              <button 
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">联系我们</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  如果您有关于大象滑梯的线索、照片或故事，<br/>欢迎通过邮件与我们联系。
                </p>

                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-6 group hover:border-slate-300 transition-colors">
                  <span className="font-mono text-slate-900 font-medium truncate select-all">15599588842@163.com</span>
                  <button 
                    onClick={handleCopyEmail}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                    title="复制邮箱"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <a 
                  href="mailto:15599588842@163.com"
                  className="w-full bg-slate-900 text-white py-3 rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> 发送邮件
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
