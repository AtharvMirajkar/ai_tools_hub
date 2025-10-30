import { useState, useEffect, FormEvent } from 'react';
import { supabase, AITool } from '../lib/supabase';
import { X } from 'lucide-react';

interface ToolFormModalProps {
  tool: AITool | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ToolFormModal({ tool, onClose, onSave }: ToolFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    url: '',
    sort_order: 100,
    features: '',
    is_featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        category: tool.category,
        description: tool.description,
        url: tool.url,
        sort_order: tool.sort_order || 100,
        features: (tool.features || []).join(', '),
        is_featured: tool.is_featured || false,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        url: '',
        sort_order: 100,
        features: '',
        is_featured: false,
      });
    }
  }, [tool]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      const dataToSubmit = {
        ...formData,
        features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (tool) {
        response = await supabase.from('ai_tools').update(dataToSubmit).eq('id', tool.id);
      } else {
        response = await supabase.from('ai_tools').insert([dataToSubmit]);
      }

      if (response.error) {
        throw response.error;
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-2xl font-bold text-gray-900">{tool ? 'Edit Tool' : 'Add New Tool'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              <textarea id="features" name="features" rows={3} value={formData.features} onChange={handleChange} placeholder="Comma-separated, e.g., AI Chatbot, Image Generation" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input type="number" id="sort_order" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="flex items-center">
              <input id="is_featured" name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">Feature this tool</label>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end items-center p-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
