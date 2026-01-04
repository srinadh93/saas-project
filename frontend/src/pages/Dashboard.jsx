import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Folder, CheckCircle, Clock, Plus, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    activeProjects: 0, 
    completedTasks: 0, 
    pendingTasks: 0 
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- SAFE USER PARSING (Prevents White Screen Crash) ---
  let user = { fullName: 'User' };
  try {
    const storedUser = localStorage.getItem('user');
    // Check if data exists and is NOT the string "undefined"
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.warn("Corrupted user data in Dashboard, using default.");
    // We don't clear storage here to avoid fighting with other components
  }
  // ------------------------------------------------------

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch Projects
        const projectsRes = await api.get('/projects');
        const projects = projectsRes.data.data || [];

        // Simple Stats Calculation
        const activeProjects = projects.filter(p => p.status === 'active').length;
        
        setStats({
          activeProjects,
          completedTasks: 0, 
          pendingTasks: 0    
        });

        setRecentProjects(projects.slice(0, 3)); 
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        // Don't show error if it's just a 401 (auth) issue, let the router handle redirect
        if (err.response && err.response.status !== 401) {
            setError("Failed to load dashboard data.");
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    // CHANGED: text-gray-500 -> text-gray-400
    <div className="flex justify-center items-center h-64 text-gray-400">
      {/* CHANGED: border-indigo-600 -> border-indigo-500 */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-2"></div>
      Loading Dashboard...
    </div>
  );

  if (error) return (
    // CHANGED: bg-red-50 -> bg-red-900/20, text-red-600 -> text-red-400, border-red-200 -> border-red-800
    <div className="p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-800">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* CHANGED: text-gray-900 -> text-white */}
          <h1 className="text-3xl font-bold text-white">Welcome back, {user.fullName}!</h1>
          {/* CHANGED: text-gray-500 -> text-gray-400 */}
          <p className="text-gray-400 mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <Link 
          to="/projects" 
          // CHANGED: hover:bg-indigo-700 -> hover:bg-indigo-500
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition shadow-sm font-medium"
        >
          <Plus className="h-5 w-5" /> New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center gap-4">
          {/* CHANGED: bg-blue-50 -> bg-blue-900/30, text-blue-600 -> text-blue-400 */}
          <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg">
            <Folder className="h-6 w-6" />
          </div>
          <div>
            {/* CHANGED: text-gray-500 -> text-gray-400 */}
            <p className="text-sm text-gray-400 font-medium">Active Projects</p>
            {/* CHANGED: text-gray-900 -> text-white */}
            <h3 className="text-2xl font-bold text-white">{stats.activeProjects}</h3>
          </div>
        </div>

        {/* Card 2 */}
        {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center gap-4">
          {/* CHANGED: bg-green-50 -> bg-green-900/30, text-green-600 -> text-green-400 */}
          <div className="p-3 bg-green-900/30 text-green-400 rounded-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            {/* CHANGED: text-gray-500 -> text-gray-400 */}
            <p className="text-sm text-gray-400 font-medium">Completed Tasks</p>
            {/* CHANGED: text-gray-900 -> text-white */}
            <h3 className="text-2xl font-bold text-white">{stats.completedTasks}</h3>
          </div>
        </div>

        {/* Card 3 */}
        {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 flex items-center gap-4">
          {/* CHANGED: bg-orange-50 -> bg-orange-900/30, text-orange-600 -> text-orange-400 */}
          <div className="p-3 bg-orange-900/30 text-orange-400 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            {/* CHANGED: text-gray-500 -> text-gray-400 */}
            <p className="text-sm text-gray-400 font-medium">Pending Tasks</p>
            {/* CHANGED: text-gray-900 -> text-white */}
            <h3 className="text-2xl font-bold text-white">{stats.pendingTasks}</h3>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          {/* CHANGED: text-gray-900 -> text-white */}
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {/* CHANGED: text-gray-400 -> text-gray-500 */}
            <Activity className="h-5 w-5 text-gray-500" /> Recent Activity
          </h2>
          {/* CHANGED: text-indigo-600 -> text-indigo-400 */}
          <Link to="/projects" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="block group">
                {/* CHANGED: bg-gray-50 -> bg-gray-700/30, hover:bg-gray-700, border-gray-100 -> border-gray-700 */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700 transition border border-gray-700">
                  <div className="flex items-center gap-4">
                    {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-600, text-gray-400 -> text-gray-300 */}
                    {/* group-hover:border-indigo-200 -> group-hover:border-indigo-500, group-hover:text-indigo-600 -> group-hover:text-indigo-400 */}
                    <div className="h-10 w-10 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-gray-300 font-bold text-sm group-hover:border-indigo-500 group-hover:text-indigo-400 transition">
                      {project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      {/* CHANGED: text-gray-900 -> text-white, group-hover:text-indigo-600 -> group-hover:text-indigo-400 */}
                      <h4 className="font-semibold text-white group-hover:text-indigo-400 transition">{project.name}</h4>
                      {/* CHANGED: text-gray-500 -> text-gray-400 */}
                      <p className="text-xs text-gray-400">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    project.status === 'active' 
                      // CHANGED: bg-green-100 -> bg-green-900/30, text-green-700 -> text-green-400
                      ? 'bg-green-900/30 text-green-400' 
                      // CHANGED: bg-gray-200 -> bg-gray-600, text-gray-600 -> text-gray-300
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // CHANGED: text-gray-500 -> text-gray-400
          <div className="text-center py-10 text-gray-400">
            No projects yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}