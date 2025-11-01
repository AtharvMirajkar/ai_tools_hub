import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Menu, X, Star, LogIn, LogOut, UserPlus, Home, Bot, Rss, Info, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: role } = await supabase.rpc('get_user_role');
        setIsAdmin(role === 'admin');
      }
    };

    fetchUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data: role } = await supabase.rpc('get_user_role');
        setIsAdmin(role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const NavLink = ({ to, children, Icon, onClick }: { to: string; children: React.ReactNode; Icon: React.ElementType; onClick?: () => void }) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-200"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  const mainNavLinks = (
    <>
      <NavLink to="/tools" Icon={Bot} onClick={() => setIsMenuOpen(false)}>Tools</NavLink>
      <NavLink to="/blog" Icon={Rss} onClick={() => setIsMenuOpen(false)}>Blog</NavLink>
      <NavLink to="/about" Icon={Info} onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
      {user && (
        <NavLink to="/favorites" Icon={Star} onClick={() => setIsMenuOpen(false)}>Favorites</NavLink>
      )}
    </>
  );

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900 tracking-tight">
            <img src="/logo.svg" alt="AI Tool Finder Logo" className="h-8 w-8" />
            <span>AI Tool Finder</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {mainNavLinks}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="flex items-center space-x-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center space-x-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link to="/auth" onClick={() => navigate('/auth', { state: { isSignUp: true } })} className="flex items-center space-x-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                  <span>Sign Up</span>
                  <UserPlus className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-200 animate-fade-in-down">
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" Icon={Home} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              {mainNavLinks}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-3">
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink to="/admin/dashboard" Icon={LayoutDashboard} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md px-3 py-2 transition-all duration-200 w-full text-left">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/auth" Icon={LogIn} onClick={() => setIsMenuOpen(false)}>Sign In</NavLink>
                  <NavLink 
                    to="/auth" 
                    Icon={UserPlus} 
                    onClick={() => {
                      navigate('/auth', { state: { isSignUp: true } });
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
