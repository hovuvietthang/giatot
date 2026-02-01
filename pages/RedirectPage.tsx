
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { shortenService } from '../services/shortenService';

export const RedirectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performRedirect = async () => {
      if (!slug) {
        setError('Mã liên kết không hợp lệ.');
        return;
      }

      try {
        const response = await shortenService.getOriginalUrl(slug);
        if (response.success && response.url) {
          // Delay a tiny bit for UI experience
          setTimeout(() => {
            window.location.replace(response.url as string);
          }, 1500);
        } else {
          setError(response.message || 'Liên kết này không tồn tại hoặc đã hết hạn.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi xử lý liên kết.');
      }
    };

    performRedirect();
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Rất tiếc!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/" 
            className="inline-block bg-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-700 transition-colors"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Animated Brand Pulse */}
        <div className="relative mb-12 flex justify-center">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-white">
            <ShoppingCart className="w-16 h-16 text-orange-500 animate-bounce" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Đang kết nối...
        </h2>
        
        <p className="text-gray-600 mb-8 font-medium">
          Hệ thống đang chuyển hướng bạn đến sàn thương mại điện tử chính thức. Vui lòng chờ trong giây lát.
        </p>

        {/* Progress Bar Container */}
        <div className="bg-white/50 h-3 w-full rounded-full overflow-hidden mb-12 shadow-inner border border-white/20">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-blue-600 h-full w-full origin-left animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">Shopee</span>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">Lazada</span>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-widest">
          <Loader2 className="w-3 h-3 animate-spin" />
          Secure Redirect Service
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: scaleX(0); opacity: 0.1; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
