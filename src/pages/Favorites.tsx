import { useState, useEffect, useCallback } from 'react';
import { supabase, AITool } from '../lib/supabase';
import AIToolCard from '../components/AIToolCard';
import { User } from '@supabase/supabase-js';

export default function Favorites() {
  const [favorites, setFavorites] = useState<AITool[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          setError('You must be logged in to view your favorites.');
          setLoading(false);
          return;
        }
        setUser(currentUser);

        const { data, error } = await supabase
          .from('user_favorites')
          .select('ai_tools (*)')
          .eq('user_id', currentUser.id);

        if (error) throw error;

        const favoriteTools = data?.map(fav => fav.ai_tools as unknown as AITool).filter(Boolean) || [];
        setFavorites(favoriteTools);

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching your favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFavorites();
  }, []);

  const handleFavoriteToggle = useCallback((toolId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setFavorites(prevFavorites => prevFavorites.filter(tool => tool.id !== toolId));
    }
  }, []);

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-center mb-12">Your Favorites</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          {favorites.length === 0 ? (
            <div className="text-center text-gray-500">You haven't added any favorites yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((tool, index) => (
                <AIToolCard
                  key={tool.id}
                  tool={tool}
                  index={index}
                  userId={user?.id}
                  isInitiallyFavorited={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
