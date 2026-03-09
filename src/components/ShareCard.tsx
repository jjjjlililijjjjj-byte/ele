import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, MapPin, Calendar, Layers, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { ElephantSlide } from '../types';
import { ElephantIcon } from './ElephantIcon';

interface ShareCardProps {
  slide: ElephantSlide;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareCard({ slide, isOpen, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `大象滑梯知识卡-${slide.nickname}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[600]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[601] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full pointer-events-auto flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  分享知识卡片
                </h3>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* The actual card that will be captured */}
                <div 
                  ref={cardRef}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
                  style={{ width: '320px', margin: '0 auto' }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full opacity-50" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <ElephantIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">大象滑梯档案</h4>
                        <p className="text-[10px] text-slate-400 font-mono">NO. {slide.id}</p>
                      </div>
                    </div>

                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-slate-100 border border-slate-100">
                      {slide.imageUrl ? (
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.nickname}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ElephantIcon className="w-16 h-16 opacity-20" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-serif font-bold text-slate-900 leading-tight mb-1">{slide.nickname}</h2>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[11px]">{slide.city} · {slide.location}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">建成</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{slide.buildYear}年</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Layers className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">材质</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{slide.material}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          <span className="text-[10px] text-slate-400">扫码探索更多大象滑梯</span>
                        </div>
                        {/* Placeholder for QR code or branding */}
                        <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                          <ElephantIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>正在生成...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>保存为图片</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3">
                  卡片将以高清 PNG 格式保存到您的设备
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
