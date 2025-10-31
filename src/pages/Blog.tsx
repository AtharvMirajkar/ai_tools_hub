
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';
import { PlusCircle } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, user:users_public_data!user_id(id, full_name)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data as any);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        // @ts-ignore
        setUser(data.session?.user ?? null);
      };

    fetchPosts();
    getSession();
  }, []);

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-center">Blog</h1>
        {user && (
          <Link
            to="/blog/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            New Post
          </Link>
        )}
      </div>

      {loading && <div className="text-center">Loading posts...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link to={`/blog/${post.id}`} key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{post.title}</h2>
                <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                <div className="text-sm text-gray-500">
                  {/* @ts-ignore */}
                  <span>By {post.user?.full_name || 'Anonymous'}</span>
                  <span className="mx-2">&middot;</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
