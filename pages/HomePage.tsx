import React, { useState } from 'react';
import { Link as LinkIcon, Zap, Copy, Check, Info, ShoppingCart, AlertCircle } from 'lucide-react';
import { shortenService } from '../services/shortenService';
import { AppStatus } from '../types';

export const HomePage: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setStatus(AppStatus.LOADING);
    setErrorMessage('');
    setResult(null);
    
    try {
      // Gửi dữ liệu sang Service
      const response = await shortenService.shorten({ 
        url: originalUrl.trim(), 
        slug: customSlug.trim() 
      });

      if (response.success) {
        // Lấy slug trả về từ Apps Script (ưu tiên field 'slug')
        const slug = response.slug || response.shortUrl;
        
        if (slug) {
          // TẠO LINK SẠCH: domain.com/slug (Không có dấu #)
          const fullShortUrl = `${window.location.origin}/${slug}`;
          setResult(fullShortUrl);
          setStatus(AppStatus.SUCCESS);
        } else {
          throw new Error('Máy chủ không trả về mã định danh (slug).');
        }
      } else {
        setErrorMessage(response.message || 'Mã rút gọn đã tồn tại hoặc link không hợp lệ.');
        setStatus(AppStatus.ERROR);
      }
    } catch (err: any) {
      console.error('Lỗi tại HomePage:', err);
      setErrorMessage(err.message || 'Lỗi hệ thống không xác định.');
      setStatus(AppStatus.ERROR);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          Rút gọn link <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Affiliate</span> siêu tốc
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Tạo đường dẫn chuyên nghiệp cho Shopee, Lazada, TikTok. 
          Tự động gắn mã tracking cá nhân chỉ trong 1 giây.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100">
        <form onSubmit={handleShorten} className="space-y-6">
          {/* Input Link Gốc */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Link sản phẩm cần rút gọn</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="url"
                required
                className="block w-full pl-12 pr-4 py-4.5 border-2 border-slate-100 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-700"
                placeholder="Dán link Shopee, Lazada hoặc TikTok tại đây..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Input Custom Slug */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mã rút gọn tùy chỉnh (Tùy chọn)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold group-focus-within:text-orange-500">/</span>
              </div>
              <input
                type="text"
                className="block w-full pl-8 pr-4 py-4.5 border-2 border-slate-100 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-700 font-medium"
                placeholder="ví dụ: deal-doc-quyen"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
            </div>
            <p className="mt-3 text-[13px] text-slate-400 flex items-center gap-1.5 ml-1">
              <Info className="w-4 h-4" /> Để trống nếu bạn muốn tạo mã ngẫu nhiên.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === AppStatus.LOADING}
            className={`w-full flex items-center justify-center gap-3 py-5 px-8 rounded-2xl text-white font-black text-xl shadow-xl transform transition-all active:scale-[0.98] ${
              status === AppStatus.LOADING 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-orange-500/25 hover:-translate-y-1'
            }`}
          >
            {status === AppStatus.LOADING ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <>
                <Zap className="w-6 h-6 fill-current" />
                Rút Gọn Link Ngay
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {status === AppStatus.ERROR && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
            <AlertCircle className="w-5 h-5" /> {errorMessage}
          </div>
        )}

        {/* Success Result */}
        {status === AppStatus.SUCCESS && result && (
          <div className="mt-10 p-8 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 rounded-[2rem] animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 p-1.5 rounded-full">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-orange-900 font-black text-lg">Link của bạn đã sẵn sàng!</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow p-4 bg-white border-2 border-orange-100 rounded-xl text-slate-700 font-mono text-base break-all flex items-center shadow-sm">
                {result}
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black transition-all ${
                  copied 
                  ? 'bg-green-500 text-white shadow-green-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                } shadow-lg active:scale-95 whitespace-nowrap`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Đã sao chép' : 'Sao chép link'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Chuyển hướng 0s', desc: 'Sử dụng hệ thống máy chủ Google cực mạnh, đảm bảo khách không phải chờ.', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { title: 'Thông minh hơn', desc: 'Tự động bóc tách link gốc và thay thế mã Affiliate đối thủ bằng mã của bạn.', icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50' },
          { title: 'Tùy chỉnh cá nhân', desc: 'Tự đặt tên link rút gọn theo thương hiệu riêng để tăng tỷ lệ click khách hàng.', icon: LinkIcon, color: 'text-blue-500', bg: 'bg-blue-50' }
        ].map((feature, i) => (
          <div key={i} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
            <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`w-7 h-7 ${feature.color}`} />
            </div>
            <h4 className="font-black text-slate-900 text-lg mb-3">{feature.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component hỗ trợ icon loading (tránh lỗi thiếu import)
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
