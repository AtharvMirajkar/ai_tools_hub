import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase, AITool } from "../lib/supabase";
import AIToolCard from "./AIToolCard";

export default function ToolsGrid() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("ai_tools")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setTools(data || []);
    } catch (err) {
      console.error("Error fetching tools:", err);
      setError("Failed to load AI tools. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section
        id="tools"
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading AI tools...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="tools"
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold mb-2">
                Oops! Something went wrong
              </p>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchTools}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="tools"
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AI Tools
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked collection of the most powerful AI platforms and tools
            available today
          </p>
        </div>

        {tools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No AI tools found. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <AIToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
