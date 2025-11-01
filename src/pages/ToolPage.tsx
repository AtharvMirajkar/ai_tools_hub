import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, AITool, Review } from '../lib/supabase';
import { Loader2, AlertCircle, ExternalLink, ChevronLeft, CheckCircle2, Star, Send, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';

const StarRating = ({ rating, onRatingChange, interactive = false, size = 'md' }: { rating: number, onRatingChange?: (r: number) => void, interactive?: boolean, size?: 'sm' | 'md' | 'lg' }) => {
    const starClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className={`flex items-center ${interactive ? 'cursor-pointer' : ''}`}>
            {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <button 
                        type="button" 
                        key={i} 
                        onMouseEnter={() => interactive && setHoverRating(ratingValue)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        onClick={() => interactive && onRatingChange?.(ratingValue)}
                        className={`transition-colors duration-200 ${interactive ? 'transform hover:scale-110' : ''}`}>
                        <Star 
                            className={`${starClasses[size]} ${ratingValue <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                    </button>
                );
            })}
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
      setLoading(true);
      try {
        const { data: toolData, error: toolError } = await supabase.from('ai_tools').select('*').eq('id', id).single();
        if (toolError) throw toolError;
        setTool(toolData);

        const { data: reviewsData, error: reviewsError } = await supabase.from('reviews').select('*, user:users_public_data!user_id(id, full_name, avatar_url)').eq('tool_id', id).order('created_at', { ascending: false });
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
        const { data, error } = await supabase.from('reviews').upsert({ tool_id: tool.id, user_id: user.id, rating: userReview.rating, comment: userReview.comment }, { onConflict: 'tool_id,user_id' }).select('*, user:users_public_data!user_id(id, full_name, avatar_url)').single();
        if (error) throw error;

        const existingReviewIndex = reviews.findIndex(r => r.user_id === user.id);
        if (existingReviewIndex !== -1) {
            const updatedReviews = [...reviews];
            updatedReviews[existingReviewIndex] = data as any;
            setReviews(updatedReviews);
        } else {
            setReviews([data as any, ...reviews]);
        }
        
        setUserReview({ rating: 0, comment: '' });
    } catch (err: any) {
        setError(err.message || 'Failed to submit review.');
    } finally {
        setSubmitting(false);
    }
  };
  
  const averageRating = useMemo(() => {
    return reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  }, [reviews]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  if (error || !tool) return <div className="flex flex-col items-center justify-center min-h-screen text-center px-4"><AlertCircle className="w-12 h-12 text-red-500" /> <span className="mt-4 text-xl font-semibold">{error || 'Tool not found'}</span><Link to="/tools" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg">Back to Tools</Link></div>;

  return (
    <div className="bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Tools</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
            <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
                    <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-1 ring-gray-200">
                        {tool.logo_url ? <img src={tool.logo_url} alt={`${tool.name} logo`} className="w-full h-full rounded-2xl object-cover"/> : <span className="text-gray-500 text-lg font-semibold">{tool.name.charAt(0)}</span>}
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105 flex items-center justify-center gap-2">
                        <span>Visit Website</span><ExternalLink className="w-5 h-5" />
                    </a>
                </div>
                <div className="md:w-2/3 p-8 md:p-12">
                    <span className="inline-block text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-3">{tool.category}</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">{tool.name}</h1>
                    <div className="flex items-center gap-3 mb-6">
                        <StarRating rating={averageRating} />
                        <span className="text-gray-600 font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">{tool.description}</p>
                    {tool.features && tool.features.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Key Features</h3>
                            <ul className="space-y-3">
                                {tool.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /><span>{feature}</span></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ratings & Reviews</h2>
          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-12 transform transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                {user.user_metadata.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Your avatar" className="w-12 h-12 rounded-full"/> : <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-7 h-7 text-gray-400"/></div>}
                <h3 className="text-xl font-semibold">Leave a Review</h3>
              </div>
              <div className="mb-4">
                <label className="font-semibold mb-2 block">Your Rating</label>
                <StarRating rating={userReview.rating} onRatingChange={(r) => setUserReview({ ...userReview, rating: r })} interactive={true} size="lg" />
              </div>
              <textarea value={userReview.comment} onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })} placeholder="Share your experience with this tool..." className="w-full p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 transition-shadow" rows={4}></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={submitting || userReview.rating === 0} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all shadow-md transform hover:scale-105">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  <span>{submitting ? 'Submitting...' : 'Submit Review'}</span> 
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center mb-12 ring-1 ring-gray-200">
              <p className="font-medium"><Link to="/auth" className="font-semibold text-blue-600 hover:underline">Sign in</Link> to share your thoughts and help the community.</p>
            </div>
          )}

          <div className="space-y-8">
            {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 flex gap-4 items-start">
                    <div className="flex-shrink-0">
                        {/* @ts-ignore */}
                        {review.user?.avatar_url ? <img src={review.user.avatar_url} alt={review.user.full_name} className="w-12 h-12 rounded-full"/> : <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-7 h-7 text-gray-400"/></div>}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                             {/* @ts-ignore */}
                            <p className="font-bold text-gray-800">{review.user?.full_name || 'Anonymous'}</p>
                            <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="my-1"><StarRating rating={review.rating} size="sm" /></div>
                        {review.comment && <p className="text-gray-600 mt-2 prose prose-sm max-w-none">{review.comment}</p>}
                    </div>
                </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500 text-center py-10">Be the first to leave a review for this tool!</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
