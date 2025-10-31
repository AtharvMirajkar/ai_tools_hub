import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, AITool } from '../lib/supabase';
import { Loader2, AlertCircle, ExternalLink, ChevronLeft, CheckCircle2, Tag, ArrowLeft } from 'lucide-react';

export default function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('ai_tools')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        
        setTool(data);
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError('Could not load the tool details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Tool...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tool Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The tool you are looking for does not exist or has been moved.'}</p>
          <Link 
            to="/tools"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Tools</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column (Logo & Links) */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center shadow-md mb-6">
              {tool.logo_url ? (
                <img src={tool.logo_url} alt={`${tool.name} logo`} className="w-full h-full rounded-2xl object-cover"/>
              ) : (
                <span className="text-gray-500">No Logo</span>
              )}
            </div>
            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-blue-600 text-white px-6 py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Visit Website
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Right Column (Details) */}
          <div className="md:col-span-2">
            <span className="inline-block text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-3">
                {tool.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{tool.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{tool.description}</p>

            {tool.features && tool.features.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h3>
                    <ul className="space-y-3">
                        {tool.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
