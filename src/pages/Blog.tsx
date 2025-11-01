import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';
import { PlusCircle, Rss, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';

// It's good practice to have a more specific type for posts that include user data.
interface PostWithUser extends Post {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export default function Blog() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, user:users_public_data!user_id(id, full_name)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data as PostWithUser[]);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
    };

    fetchPosts();
    getSession();
  }, []);

  const PostCard = ({ post }: { post: PostWithUser }) => {
    const author = post.user;
    return (
      <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          {/* A simple placeholder for an image */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200"></div>
          <Rss className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-gray-400/50" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <p className="mt-3 text-base text-gray-600 line-clamp-3">
              {post.content}
            </p>
          </div>
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              {author?.avatar_url ? (
                <img className="h-10 w-10 rounded-full" src={author.avatar_url} alt={author.full_name || ''} />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white"/>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{author?.full_name || 'Anonymous'}</p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the Blog</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
                The latest articles, insights, and news about the world of AI tools.
            </p>
            {user && (
            <div className="mt-8">
                <Link
                    to="/blog/new"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create New Post
                </Link>
            </div>
            )}
        </div>

        {loading && (
            <div className="mt-16 text-center">
                <div role="status" className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col rounded-2xl bg-white shadow-md">
                            <div className="h-48 rounded-t-2xl bg-gray-300"></div>
                            <div className="flex-1 p-6">
                                <div className="h-6 w-3/4 rounded bg-gray-300 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 rounded bg-gray-200"></div>
                                    <div className="h-4 rounded bg-gray-200"></div>
                                    <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                                    <div className="ml-3 space-y-2">
                                        <div className="h-4 w-24 rounded bg-gray-300"></div>
                                        <div className="h-3 w-20 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {error && <div className="mt-16 text-center text-red-500 rounded-lg bg-red-50 p-4">{error}</div>}

        {!loading && !error && (
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostCard post={post} key={post.id} />
                ))
            ) : (
                <div className="col-span-3 text-center py-16">
                    <Rss className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">No posts published yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Check back soon for the latest articles.</p>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
}
