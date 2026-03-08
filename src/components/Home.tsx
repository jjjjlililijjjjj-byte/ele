import { motion } from 'motion/react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { slidesData } from '../data';
import { ElephantIcon } from './ElephantIcon';

interface HomeProps {
  onExplore: () => void;
  onPlayGame: () => void;
}

export default function Home({ onExplore, onPlayGame }: HomeProps) {
  // Get a few featured slides for the gallery
  const featuredSlides = slidesData.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fdfdfc] text-slate-900 font-sans overflow-y-auto">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
              <ElephantIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-wide">大象滑梯图鉴</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-slate-900">首页</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">关于计划</a>
            <button 
              onClick={onExplore}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              探索地图 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase mb-6">
              Digital Archaeology & Preservation
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              寻找中国<br />大象滑梯的记忆
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-serif">
              水磨石的温润，水泥的坚固。它们曾是几代人童年最珍贵的游乐场，如今正随着城市更新悄然消失。这是一场与时间赛跑的数字化考古。
            </p>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-6xl mx-auto px-6 mb-24"
        >
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 relative group">
            <img 
              src="https://images.unsplash.com/photo-1604004218844-48601676831d?q=80&w=2574&auto=format&fit=crop" 
              alt="Vintage playground" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4 font-mono uppercase tracking-widest">
            Documenting the fading playgrounds of our childhood
          </p>
        </motion.div>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto px-6 font-serif text-lg leading-loose text-slate-800 space-y-8 mb-24">
          <p>
            在20世纪70年代至90年代的中国，几乎每个城市的公园、社区和学校里，都能找到一座大象滑梯。它们大多由水磨石或水泥浇筑而成，造型憨态可掬，象鼻化作长长的滑道，承载了无数孩童的欢声笑语。
          </p>
          <p>
            然而，随着时代的发展和安全标准的更新，这些曾经的“游乐场顶流”正面临着被拆除或遗弃的命运。新型的塑料游乐设施取代了它们的位置，水磨石大象逐渐退出了历史舞台。
          </p>
          
          <blockquote className="border-l-4 border-slate-900 pl-6 my-12 italic text-2xl text-slate-600">
            "它们不仅是游乐设施，更是城市公共空间的时代印记，是几代人共同的集体记忆。"
          </blockquote>

          <p>
            为了留住这些珍贵的记忆，我们发起了“全国大象滑梯数字化考古与科普计划”。通过众包的力量，我们正在全国范围内寻找、记录和标记现存或已消失的大象滑梯。
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-serif font-bold">精选档案</h2>
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
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.nickname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${slide.id}/600/400`;
                    }}
                  />
                  {slide.status === 'demolished' && (
                    <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
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
            <a href="#" className="hover:text-slate-900">关于我们</a>
            <a href="#" className="hover:text-slate-900">数据贡献</a>
            <a href="#" className="hover:text-slate-900">联系方式</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
