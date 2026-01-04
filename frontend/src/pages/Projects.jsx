import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Folder, Calendar, User, Trash2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project Created!');
      setNewProject({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      toast.error('Error creating project');
    }
  };

  const handleDelete = async (e, projectId) => {
    e.preventDefault(); // Stop clicking the card link
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('Project Deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* CHANGED: text-gray-900 -> text-white */}
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          {/* CHANGED: text-gray-500 -> text-gray-400 */}
          <p className="text-gray-400 mt-1">Manage and track your ongoing work</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          // CHANGED: hover:bg-indigo-700 -> hover:bg-indigo-500
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition shadow-sm font-medium"
        >
          {showForm ? 'Cancel' : <><Plus className="h-5 w-5" /> New Project</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        // CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 animate-fade-in-down">
          {/* CHANGED: text-gray-800 -> text-white */}
          <h2 className="text-lg font-bold text-white mb-4">Create New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              {/* CHANGED: text-gray-700 -> text-gray-300 */}
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
              <input 
                // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                className="w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="e.g. Website Redesign"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
            </div>
            <div>
              {/* CHANGED: text-gray-700 -> text-gray-300 */}
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea 
                // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                className="w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Briefly describe the project goals..."
                rows="3"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>
            {/* CHANGED: hover:bg-indigo-700 -> hover:bg-indigo-500 */}
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 font-medium">
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="group block">
            {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700, hover:border-indigo-200 -> hover:border-indigo-500 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 hover:shadow-md hover:border-indigo-500 transition-all duration-200 h-full flex flex-col relative">
              
              {/* Card Header with Delete Button */}
              <div className="flex justify-between items-start mb-4">
                {/* CHANGED: bg-indigo-50 -> bg-indigo-900/50, text-indigo-600 -> text-indigo-400 */}
                <div className="p-2 bg-indigo-900/50 text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Folder className="h-6 w-6" />
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
                    project.status === 'active' 
                      // CHANGED: bg-green-50 -> bg-green-900/30, text-green-700 -> text-green-400, border-green-100 -> border-green-800
                      ? 'bg-green-900/30 text-green-400 border border-green-800' 
                      // CHANGED: bg-gray-100 -> bg-gray-700, text-gray-600 -> text-gray-400, border-gray-200 -> border-gray-600
                      : 'bg-gray-700 text-gray-400 border border-gray-600'
                  }`}>
                    {project.status}
                  </span>
                  <button 
                    onClick={(e) => handleDelete(e, project.id)}
                    // CHANGED: text-gray-400 -> text-gray-500, hover:text-red-600 -> hover:text-red-400, hover:bg-red-50 -> hover:bg-red-900/20
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-all z-10"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* CHANGED: text-gray-900 -> text-white, group-hover:text-indigo-600 -> group-hover:text-indigo-400 */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
              {/* CHANGED: text-gray-500 -> text-gray-400 */}
              <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">{project.description}</p>
              
              {/* CHANGED: border-gray-100 -> border-gray-700, text-gray-400 -> text-gray-500 */}
              <div className="pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {project.creator?.fullName || 'Unknown'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {projects.length === 0 && !showForm && (
        // CHANGED: bg-white -> bg-gray-800, border-gray-300 -> border-gray-700
        <div className="text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-700">
          {/* CHANGED: text-gray-300 -> text-gray-600 */}
          <div className="mx-auto h-12 w-12 text-gray-600 mb-4">
            <Folder className="h-full w-full" />
          </div>
          {/* CHANGED: text-gray-900 -> text-white */}
          <h3 className="text-lg font-medium text-white">No projects yet</h3>
          {/* CHANGED: text-gray-500 -> text-gray-400 */}
          <p className="text-gray-400 mt-1">Get started by creating your first project.</p>
        </div>
      )}
    </div>
  );
}