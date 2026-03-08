import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { SlideStatus } from '../types';

interface ContributeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ContributeForm({ isOpen, onClose, onSubmit }: ContributeFormProps) {
  const [formData, setFormData] = useState({
    nickname: '',
    city: '',
    location: '',
    status: 'existing' as SlideStatus,
    buildYear: '',
    material: '',
    description: '',
    image: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      ...formData,
      id: `CONTRIB-${Date.now()}`,
      coordinates: [39.9042, 116.4074], // Default coordinate for now
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : 'https://picsum.photos/seed/slide/800/600'
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        nickname: '',
        city: '',
        location: '',
        status: 'existing',
        buildYear: '',
        material: '',
        description: '',
        image: null
      });
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[600]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[601] overflow-hidden border border-slate-100"
          >
            {isSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">提交成功！</h3>
                <p className="text-slate-600">感谢你为大象滑梯档案库做出的贡献。<br/>我们会尽快审核你的信息。</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-serif font-bold text-slate-900">贡献数据</h2>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">昵称</label>
                        <input
                          required
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleChange}
                          placeholder="例如：人民公园大象"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">城市</label>
                        <input
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="例如：北京"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">具体位置</label>
                      <input
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="例如：朝阳区朝阳公园南门附近"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">当前状态</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none"
                        >
                          <option value="existing">存世</option>
                          <option value="demolished">已拆除</option>
                          <option value="unverified">待核实</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">建成年代 (约)</label>
                        <input
                          type="number"
                          name="buildYear"
                          value={formData.buildYear}
                          onChange={handleChange}
                          placeholder="例如：1985"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">材质</label>
                      <input
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="例如：水磨石、水泥"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">描述与记忆</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="分享关于这座滑梯的故事或详细描述..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">上传照片</label>
                      <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-slate-600">
                          {formData.image ? (
                            <>
                              <Check className="w-8 h-8 mb-2 text-green-500" />
                              <span className="text-sm font-medium text-slate-900">{formData.image.name}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">点击或拖拽上传图片</span>
                              <span className="text-xs mt-1">支持 JPG, PNG</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? '提交中...' : '提交档案'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
