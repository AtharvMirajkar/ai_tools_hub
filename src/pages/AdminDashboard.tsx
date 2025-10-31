import { useEffect, useState } from 'react';
import { supabase, AITool } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Loader2 } from 'lucide-react';
import ToolFormModal from '../components/ToolFormModal';

export default function AdminDashboard() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: role } = await supabase.rpc('get_user_role');
        if (role !== 'admin') {
          navigate('/tools');
        }
      } else {
        navigate('/auth');
      }
    };

    checkUser();
    fetchTools();
  }, [navigate]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('ai_tools').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      setError('Failed to fetch tools.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const openModal = (tool: AITool | null = null) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleSave = () => {
    fetchTools();
    closeModal();
  };

  const handleDelete = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        const { error } = await supabase.from('ai_tools').delete().eq('id', id);
        if (error) throw error;
        setTools(tools.filter(tool => tool.id !== id));
      } catch (err) {
        alert('Failed to delete tool.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Tool
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tools.map(tool => (
                    <tr key={tool.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{tool.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 max-w-xs truncate">{tool.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openModal(tool)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(tool.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isModalOpen && (
          <ToolFormModal
            tool={selectedTool}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
