import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AtSign, KeyRound } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: role } = await supabase.rpc('get_user_role');
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/tools');
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuthAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: authError } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      if (isSignUp) {
        setMessage('Check your email for the confirmation link!');
      } else {
        const { data: role } = await supabase.rpc('get_user_role');
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/tools');
        }
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex-col md:flex-row flex bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up md:min-h-[580px]">
        
        {/* Visual Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-white flex-col justify-between">
          <div style={{ animationDelay: '200ms' }} className="animate-fade-in-up">
            <Link to="/" className="text-3xl font-bold tracking-tight">
              AI Tool Finder
            </Link>
            <p className="mt-4 text-lg text-gray-300">
              Unlock the power of AI. Your next favorite tool is just a click away.
            </p>
          </div>
          <div style={{ animationDelay: '400ms' }} className="animate-fade-in-up">
             <p className="text-sm text-gray-400">© 2024 AI Tool Finder. Built for creators.</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div style={{ animationDelay: '600ms' }} className="animate-fade-in-up w-full max-w-sm mx-auto">
            <div className="md:hidden text-center mb-8">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                  AI Tool Finder
                </Link>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mb-8">
              {isSignUp ? 'Lets get you started!' : 'Sign in to access your dashboard.'}
            </p>

            <form onSubmit={handleAuthAction} className="space-y-5">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                  <p>{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                  <p>{message}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </button>
              </div>
            </form>

            <div className="text-sm text-center mt-6">
              <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:underline">
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
