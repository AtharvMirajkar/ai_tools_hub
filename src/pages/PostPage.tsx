import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { ArrowLeft, User as UserIcon, Calendar, Trash2, Edit, Loader2, Twitter, Facebook, Linkedin } from 'lucide-react';

interface PostWithUser extends Post {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Post ID is missing.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, user:users_public_data!user_id(id, full_name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data as PostWithUser);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the post.');
      } finally {
        setLoading(false);
      }
    };

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchPost();
    getSession();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !user || post.user_id !== user.id) return;

    if (window.confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) {
      setDeleting(true);
      try {
        const { error } = await supabase.from('posts').delete().match({ id: post.id });
        if (error) throw error;
        navigate('/blog');
      } catch (err: any) {
        alert('Error deleting post: ' + err.message);
      } finally {
        setDeleting(false);
      }
    }
  };

  const ShareButtons = ({ postTitle }: { postTitle: string }) => {
    const url = window.location.href;
    const text = `Check out this post: ${postTitle}`;

    const socialLinks = [
        { name: 'Twitter', Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
        { name: 'Facebook', Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
        { name: 'LinkedIn', Icon: Linkedin, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(postTitle)}` },
    ];

    return (
        <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-gray-600">Share:</p>
            <div className="flex gap-2">
                {socialLinks.map(link => (
                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                        <span className="sr-only">{`Share on ${link.name}`}</span>
                        <link.Icon className="w-5 h-5" />
                    </a>
                ))}
            </div>
        </div>
    );
  };

  if (loading) return <div className="bg-white py-24 sm:py-32"><div className="mx-auto max-w-3xl px-6 lg:px-8 animate-pulse"><div className="h-12 w-3/4 bg-gray-300 rounded mb-10"></div><div className="space-y-4"><div className="h-6 bg-gray-200 rounded"></div><div className="h-6 bg-gray-200 rounded"></div><div className="h-6 w-5/6 bg-gray-200 rounded"></div></div></div></div>;
  
  if (error || !post) return (
    <div className="bg-white py-24 sm:py-32 text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-red-600">{error ? "Something went wrong" : "Post Not Found"}</h2>
            <p className="mt-4 text-gray-600">{error || "We couldn't find the post you're looking for."}</p>
            <Link to="/blog" className="mt-10 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"><ArrowLeft className="w-5 h-5" />Back to Blog</Link>
        </div>
    </div>
  );

  const isAuthor = user && user.id === post.user_id;
  const author = post.user;

  return (
    <div className="bg-white font-sans">
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className='mb-12'>
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to all posts
                    </Link>
                </div>
                
                <article>
                    <header className="mb-10 border-b pb-10">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl !leading-tight">
                            {post.title}
                        </h1>
                        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                {author?.avatar_url ? (
                                    <img className="h-12 w-12 rounded-full" src={author.avatar_url} alt={author.full_name || ''} />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="h-7 w-7 text-gray-400"/></div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{author?.full_name || 'Anonymous'}</p>
                                    <div className="flex items-center gap-x-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                    </div>
                                </div>
                            </div>
                            <ShareButtons postTitle={post.title} />
                        </div>
                    </header>
                
                    <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg prose-img:shadow-md">
                        <p>{post.content}</p>
                    </div>

                    {isAuthor && (
                        <div className="mt-16 pt-8 border-t-2 border-dashed flex items-center justify-end gap-4">
                            <Link to={`/blog/${post.id}/edit`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                            <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors">
                                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                            </button>
                        </div>
                    )}
                </article>
            </div>
        </div>
    </div>
  );
}
