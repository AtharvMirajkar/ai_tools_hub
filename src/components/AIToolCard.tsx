import { Link } from 'react-router-dom';
import { supabase, AITool } from '../lib/supabase';
import { Heart, CheckCircle2, ImageIcon, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface AIToolCardProps {
  tool: AITool;
  index: number;
  userId?: string;
  isInitiallyFavorited?: boolean;
  onFavoriteToggle?: (toolId: string, isFavorited: boolean) => void;
}

export default function AIToolCard({
  tool,
  index,
  userId,
  isInitiallyFavorited = false,
  onFavoriteToggle,
}: AIToolCardProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsFavorited(isInitiallyFavorited);
  }, [isInitiallyFavorited]);

  const toggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId || isProcessing) return;

    setIsProcessing(true);
    const currentlyFavorited = isFavorited;
    
    // Optimistically update the UI
    setIsFavorited(!currentlyFavorited);

    try {
      if (currentlyFavorited) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: userId, tool_id: tool.id });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: userId, tool_id: tool.id });

        if (error) throw error;
      }
      onFavoriteToggle?.(tool.id, !currentlyFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert UI change on error
      setIsFavorited(currentlyFavorited);
    } finally {
      setIsProcessing(false);
    }
  }, [isFavorited, isProcessing, userId, tool.id, onFavoriteToggle]);

  return (
    <div
      className="group relative flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-blue-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {userId && (
          <button
            onClick={toggleFavorite}
            disabled={isProcessing}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              isFavorited
                ? 'bg-red-500/10 text-red-500'
                : 'bg-gray-500/10 text-gray-500'
            } hover:bg-red-500/20 hover:text-red-600 disabled:opacity-50`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        )}
        {tool.is_featured && (
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center">
            Featured
          </span>
        )}
      </div>
      
      <Link to={`/tool/${tool.id}`} className="flex flex-col flex-grow p-6 pt-16">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-16 h-16 mr-5">
            {tool.logo_url ? (
              <img src={tool.logo_url} alt={`${tool.name} logo`} className="w-full h-full rounded-lg object-cover shadow-sm" />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {tool.name}
            </h3>
            <span className="inline-block text-sm font-medium text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full mt-1">
              {tool.category}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow mb-5">
          {tool.description}
        </p>

        {tool.features && tool.features.length > 0 && (
          <div className="space-y-3">
            {tool.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </Link>

      <div className="bg-gray-50/70 p-4 mt-auto border-t border-gray-100">
        <Link to={`/tool/${tool.id}`} className="flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Details
          </span>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
        </Link>
      </div>
    </div>
  );
}
