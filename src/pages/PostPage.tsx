import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, user:users_public_data!user_id(id, full_name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data as any);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the post.');
      } finally {
        setLoading(false);
      }
    };

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    fetchPost();
    getSession();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !user || post.user_id !== user.id) return;

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase.from('posts').delete().match({ id: post.id });
        if (error) throw error;
        navigate('/blog');
      } catch (err: any) {
        alert('Error deleting post: ' + err.message);
      }
    }
  };


  if (loading) return <div className="container mx-auto px-6 py-24 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-6 py-24 text-center text-red-500">{error}</div>;
  if (!post) return <div className="container mx-auto px-6 py-24 text-center">Post not found.</div>;

  const isAuthor = user && user.id === post.user_id;

  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
        <div className='mb-8'>
            <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
            </Link>
        </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <div className="text-md text-gray-500 mb-8">
        {/* @ts-ignore */}
        <span>By {post.user?.full_name || 'Anonymous'}</span>
        <span className="mx-2">&middot;</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      
      <div className="prose lg:prose-xl max-w-none mb-12">
        <p>{post.content}</p>
      </div>

      {isAuthor && (
        <div className="flex items-center gap-4 pt-8 border-t">
          {/* <Link to={`/blog/${post.id}/edit`} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            Edit Post
          </Link> */}
          <button 
            onClick={handleDelete} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
