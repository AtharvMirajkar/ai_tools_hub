import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2.5 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Tools Hub
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Discover the future of AI</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/tools" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              Tools
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
