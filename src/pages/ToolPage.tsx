
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, AITool, Review } from '../lib/supabase';
import { Loader2, AlertCircle, ExternalLink, ChevronLeft, CheckCircle2, Star, Send } from 'lucide-react';
import { User } from '@supabase/supabase-js';

const StarRating = ({ rating, size = 'md' }: { rating: number, size?: 'sm' | 'md' | 'lg' }) => {
    const starClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`${starClasses[size]} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
        </div>
    );
};

export default function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<AITool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userReview, setUserReview] = useState<{ rating: number, comment: string }>({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchToolAndReviews = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data: toolData, error: toolError } = await supabase.from('ai_tools').select('*').eq('id', id).single();
        if (toolError) throw toolError;
        setTool(toolData);

        const { data: reviewsData, error: reviewsError } = await supabase.from('reviews').select('*, user:users_public_data!user_id(full_name)').eq('tool_id', id).order('created_at', { ascending: false });
        if (reviewsError) throw reviewsError;
        setReviews(reviewsData as any);

      } catch (err: any) {
        setError(err.message || 'Failed to load tool details.');
      } finally {
        setLoading(false);
      }
    };

    const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
    };

    fetchToolAndReviews();
    getSession();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tool || userReview.rating === 0) return;
    setSubmitting(true);
    try {
        const { data, error } = await supabase.from('reviews').upsert({ tool_id: tool.id, user_id: user.id, rating: userReview.rating, comment: userReview.comment }, { onConflict: 'tool_id,user_id' }).select('*, user:users_public_data!user_id(full_name)').single();
        if (error) throw error;
        setReviews([data as any, ...reviews.filter(r => r.user_id !== user.id)]);
        setUserReview({ rating: 0, comment: '' });
    } catch (err: any) {
        setError(err.message || 'Failed to submit review.');
    } finally {
        setSubmitting(false);
    }
  };
  
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  if (error || !tool) return <div className="flex items-center justify-center min-h-screen"><AlertCircle className="w-12 h-12 text-red-500" /> <span className="ml-4">{error}</span></div>;

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Tools</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-1 flex flex-col items-center md:items-start">
                    <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center shadow-md mb-6">
                        {tool.logo_url ? <img src={tool.logo_url} alt={`${tool.name} logo`} className="w-full h-full rounded-2xl object-cover"/> : <span className="text-gray-500">No Logo</span>}
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg">
                        Visit Website <ExternalLink className="w-5 h-5 inline-block ml-1" />
                    </a>
                </div>
                <div className="md:col-span-2">
                    <span className="inline-block text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-3">{tool.category}</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{tool.name}</h1>
                    <div className="flex items-center gap-2 mb-6">
                        <StarRating rating={averageRating} />
                        <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">{tool.description}</p>
                    {tool.features && tool.features.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Key Features</h3>
                            <ul className="space-y-3">
                                {tool.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-green-500" /><span>{feature}</span></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ratings & Reviews</h2>
          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-10">
              <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                      <button type="button" key={i} onClick={() => setUserReview({ ...userReview, rating: i + 1 })}>
                          <Star className={`w-8 h-8 transition-colors ${i < userReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`} />
                      </button>
                  ))}
              </div>
              <textarea value={userReview.comment} onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })} placeholder="Share your thoughts..." className="w-full p-3 border rounded-lg mb-4" rows={4}></textarea>
              <button type="submit" disabled={submitting || userReview.rating === 0} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
              </button>
            </form>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center mb-10">
              <p><Link to="/login" className="font-semibold text-blue-600 hover:underline">Log in</Link> to leave a review.</p>
            </div>
          )}

          <div className="space-y-6">
            {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-start justify-between">
                        <div>
                           {/* @ts-ignore */}
                            <p className="font-bold text-gray-800">{review.user?.full_name || 'Anonymous'}</p>
                            <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.comment && <p className="text-gray-600 mt-3">{review.comment}</p>}
                </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500 text-center">No reviews yet.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
