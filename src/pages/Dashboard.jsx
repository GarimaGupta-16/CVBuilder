import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Plus, Trash2, Edit, Download } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      if (!token) return;
      
      const { data } = await axios.get('http://localhost:5000/api/resume/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(data);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.delete(`http://localhost:5000/api/resume/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(resumes.filter(r => r._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCreateNew = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post('http://localhost:5000/api/resume/create', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/builder/${data._id}`);
    } catch (error) {
      console.error('Creation failed:', error);
    }
  };

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-text-muted font-medium bg-brand-bg">Loading your career portfolio...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="container mx-auto p-6 max-w-7xl mt-8 relative">
        {/* Decorative Orbs */}
        <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-brand-500/10 rounded-full filter blur-[100px] z-0"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 relative z-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Hello, <span className="text-gradient">{user?.name}</span></h1>
            <p className="text-text-muted mt-2 font-medium">Manage your resumes and prepare for interviews</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Resume
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {resumes.length === 0 ? (
            <div className="col-span-full py-24 text-center glass-card border-none bg-brand-surface/50">
              <div className="w-20 h-20 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
                <FileText className="w-10 h-10 text-brand-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No resumes yet</h3>
              <p className="text-text-muted mb-8 font-medium">Create your first ATS-friendly resume to get started</p>
              <button 
                onClick={handleCreateNew}
                className="btn-secondary"
              >
                Start Building Now
              </button>
            </div>
          ) : (
            resumes.map((resume) => (
              <div key={resume._id} className="glass-card p-6 flex flex-col h-[280px] hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/builder/${resume._id}`)}>
                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-400 border border-brand-500/30 shadow-sm group-hover:scale-105 transition-transform">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="text-xs text-brand-400 font-bold bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full shadow-sm">
                    {resume.templateId.toUpperCase()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-400 transition-colors">
                  {resume.resumeData?.personal?.name ? `${resume.resumeData.personal.name}'s Resume` : 'Untitled Resume'}
                </h3>
                <p className="text-xs text-text-muted mb-6 font-mono font-medium">
                  Last modified: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                  <Link to={`/builder/${resume._id}`} className="text-sm font-semibold text-text-secondary hover:text-white flex items-center transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                  <div className="flex gap-3">
                    <button className="text-text-muted hover:text-brand-400 transition-colors" title="Manage Downloads inside Editor" onClick={(e) => e.stopPropagation()}>
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(resume._id); }}
                      className="text-text-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
