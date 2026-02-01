
import React, { useState } from 'react';
// Added ShoppingCart to the imported icons from lucide-react
import { Link as LinkIcon, Zap, Copy, Check, Info, ShoppingCart } from 'lucide-react';
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
    
    try {
      const response = await shortenService.shorten({ url: originalUrl, slug: customSlug });
      if (response.success) {
        // Construct full URL. In real world, use window.location.origin
        const fullShortUrl = `${window.location.origin}/#/${response.shortUrl}`;
        setResult(fullShortUrl);
        setStatus(AppStatus.SUCCESS);
      } else {
        setErrorMessage(response.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        setStatus(AppStatus.ERROR);
      }
    } catch (err) {
      setErrorMessage('Lỗi hệ thống không xác định.');
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
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Rút gọn link <span className="text-orange-600">Affiliate</span> siêu tốc
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tối ưu hóa doanh thu tiếp thị liên kết của bạn bằng các đường dẫn chuyên nghiệp, 
          dễ nhớ và tự động gắn mã tracking cá nhân.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        <form onSubmit={handleShorten} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dán Link Shopee/Lazada của bạn</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                required
                className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
                placeholder="https://shopee.vn/product/123/456..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mã định danh tùy chỉnh (Tùy chọn)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-medium">/</span>
              </div>
              <input
                type="text"
                className="block w-full pl-6 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
                placeholder="deal-hot-hom-nay"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Info className="w-3 h-3" /> Nếu để trống, hệ thống sẽ tự sinh mã ngẫu nhiên.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === AppStatus.LOADING}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${
              status === AppStatus.LOADING 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-orange-200'
            }`}
          >
            {status === AppStatus.LOADING ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                Rút gọn ngay
              </>
            )}
          </button>
        </form>

        {status === AppStatus.ERROR && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <div className="mt-8 p-6 bg-orange-50 border-2 border-orange-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-orange-800 font-bold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5" /> Link của bạn đã sẵn sàng!
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow p-3 bg-white border border-orange-200 rounded-lg text-gray-700 font-mono text-sm break-all select-all">
                {result}
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Tốc độ cực nhanh', desc: 'Hệ thống chuyển hướng tức thì không làm mất khách hàng.', icon: Zap },
          { title: 'Bóc tách Affiliate', desc: 'Tự động gắn mã cá nhân của bạn vào mọi link sản phẩm.', icon: ShoppingCart },
          { title: 'Thương hiệu riêng', desc: 'Sử dụng slug tùy chỉnh để tăng độ tin cậy cho liên kết.', icon: LinkIcon }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
