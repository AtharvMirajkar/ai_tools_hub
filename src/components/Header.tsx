import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          AI Tool Finder
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
            Tools
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
            Blog
          </Link>
          {user ? (
            <>
              <Link to="/favorites" className="text-gray-600 hover:text-blue-600 transition-colors">
                Favorites
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-gray-600 hover:text-blue-600 transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
