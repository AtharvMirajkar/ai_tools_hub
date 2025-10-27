import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { AITool } from '../lib/supabase';

interface AIToolCardProps {
  tool: AITool;
  index: number;
}

export default function AIToolCard({ tool, index }: AIToolCardProps) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {tool.is_featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Featured
          </span>
        </div>
      )}

      <div className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {tool.name}
            </h3>
            <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {tool.category}
            </span>
          </div>

          <div className="flex-shrink-0 ml-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
          {tool.description}
        </p>

        {tool.features && tool.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
            <div className="space-y-2">
              {tool.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Click to explore</span>
            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
              Visit Site
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </a>
  );
}
