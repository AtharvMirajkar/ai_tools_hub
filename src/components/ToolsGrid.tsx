import { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertCircle, Search, Filter, ArrowDownUp } from 'lucide-react';
import { supabase, AITool } from '../lib/supabase';
import AIToolCard from './AIToolCard';
import { User } from '@supabase/supabase-js';

interface ToolsGridProps {
  limit?: number;
}

export default function ToolsGrid({ limit }: ToolsGridProps) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [favoriteToolIds, setFavoriteToolIds] = useState<Set<string>>(new Set());

  const fetchInitialData = useCallback(async () => {
    // Fetch categories
    try {
      const { data, error } = await supabase.from('ai_tools').select('category');
      if (error) throw error;
      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))].sort();
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }

    // Fetch user and favorites
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      try {
        const { data: favorites, error } = await supabase
          .from('user_favorites')
          .select('tool_id')
          .eq('user_id', user.id);
        if (error) throw error;
        setFavoriteToolIds(new Set(favorites.map(fav => fav.tool_id)));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('ai_tools').select('*');

      switch (sortBy) {
        case 'featured':
          query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'name-asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name-desc':
          query = query.order('name', { ascending: false });
          break;
      }

      if (limit) {
        query = query.limit(limit);
      }
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setTools(data || []);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to load AI tools. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, limit, searchTerm, selectedCategory]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTools();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchTools]);

  const handleFavoriteToggle = useCallback((toolId: string, isFavorited: boolean) => {
    setFavoriteToolIds(prev => {
      const newFavorites = new Set(prev);
      if (isFavorited) {
        newFavorites.add(toolId);
      } else {
        newFavorites.delete(toolId);
      }
      return newFavorites;
    });
  }, []);

  const retryFetch = () => {
    setError(null);
    fetchInitialData();
    fetchTools();
  };

  return (
    <section id="tools" className="pb-20 bg-gradient-to-b from-white to-gray-50 pb-36 sm:pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in-up">
  
          <p className="text-lg leading-8 text-gray-600 max-w-3xl mx-auto mt-2">
            {limit
              ? 'Handpicked collection of the most powerful AI platforms and tools available today'
              : 'Explore our comprehensive directory of AI tools to find the perfect one for your needs.'}
          </p>
        </div>

        {!limit && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools by name or description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="relative md:col-span-2">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-8 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <ArrowDownUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full pl-12 pr-8 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading tools...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold mb-2">Oops! Something went wrong</p>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={retryFetch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg font-medium">No AI tools found that match your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <AIToolCard
                key={tool.id}
                tool={tool}
                index={index}
                userId={user?.id}
                isInitiallyFavorited={favoriteToolIds.has(tool.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
