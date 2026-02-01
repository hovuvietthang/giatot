
import React from 'react';
import { ShoppingCart, Link as LinkIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
              <ShoppingCart className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Affiliate<span className="text-orange-600">Short</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Trang chủ</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Hướng dẫn</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100 bg-white">
        <p>&copy; 2024 Affiliate Pro. Phát triển bởi chuyên gia React.</p>
      </footer>
    </div>
  );
};
