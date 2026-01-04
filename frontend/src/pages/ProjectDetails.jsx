import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, CheckCircle, Clock, Trash2, Plus } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', status: 'todo' });

  const fetchProjectData = async () => {
    try {
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data.data);
      
      // Assuming the backend returns tasks inside the project object or we fetch them separately
      // Adjust this based on your actual API response structure. 
      // If tasks are nested: setTasks(projectRes.data.data.Tasks || []);
      // If separate endpoint:
      const tasksRes = await api.get(`/tasks?projectId=${id}`); 
      setTasks(tasksRes.data.data);
      
    } catch (error) {
      toast.error('Failed to load project details');
    }
  };

  useEffect(() => { fetchProjectData(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      toast.success('Task added');
      setNewTask({ title: '', status: 'todo' });
      setShowTaskForm(false);
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task updated');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (!project) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* CHANGED: text-gray-500 -> text-gray-400, hover:text-indigo-600 -> hover:text-indigo-400 */}
      <Link to="/projects" className="flex items-center text-gray-400 hover:text-indigo-400 transition">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
      </Link>

      {/* Project Header */}
      {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            {/* CHANGED: text-gray-900 -> text-white */}
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            {/* CHANGED: text-gray-500 -> text-gray-400 */}
            <p className="text-gray-400">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
            project.status === 'active' 
              // CHANGED: bg-green-100 -> bg-green-900/30, text-green-800 -> text-green-400
              ? 'bg-green-900/30 text-green-400' 
              // CHANGED: bg-gray-100 -> bg-gray-700, text-gray-600 -> text-gray-300
              : 'bg-gray-700 text-gray-300'
          }`}>
            {project.status}
          </span>
        </div>
        {/* CHANGED: text-gray-500 -> text-gray-400 */}
        <div className="mt-6 flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {tasks.filter(t => t.status === 'done').length} / {tasks.length} Tasks Completed
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          {/* CHANGED: text-gray-900 -> text-white */}
          <h2 className="text-xl font-bold text-white">Tasks</h2>
          <button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            // CHANGED: bg-indigo-600 -> bg-indigo-600 (kept same), hover:bg-indigo-700 -> hover:bg-indigo-500
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition shadow-sm text-sm font-medium"
          >
            {showTaskForm ? 'Cancel' : <><Plus className="h-4 w-4" /> Add Task</>}
          </button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          // CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 mb-6 animate-fade-in-down">
            <form onSubmit={handleCreateTask} className="flex gap-4">
              <input 
                // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white, placeholder-gray-400
                className="flex-1 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
              <select 
                // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                className="border border-gray-600 px-4 py-2 rounded-lg outline-none bg-gray-700 text-white"
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 font-medium">
                Save
              </button>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            // CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700
            <div key={task.id} className="group bg-gray-800 p-4 rounded-lg border border-gray-700 hover:shadow-md transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  task.status === 'done' 
                    // CHANGED: bg-green-100 -> bg-green-900/30, text-green-600 -> text-green-400
                    ? 'bg-green-900/30 text-green-400' : 
                  task.status === 'in_progress' 
                    // CHANGED: bg-blue-100 -> bg-blue-900/30, text-blue-600 -> text-blue-400
                    ? 'bg-blue-900/30 text-blue-400' 
                    // CHANGED: bg-gray-100 -> bg-gray-700, text-gray-400 -> text-gray-400
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {task.status === 'done' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`font-medium ${
                    task.status === 'done' 
                      // CHANGED: text-gray-400 -> text-gray-500
                      ? 'text-gray-500 line-through' 
                      // CHANGED: text-gray-900 -> text-white
                      : 'text-white'
                  }`}>
                    {task.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select 
                  // CHANGED: text-gray-500 -> text-gray-400, hover:text-indigo-600 -> hover:text-indigo-400
                  className="text-sm border-none bg-transparent font-medium text-gray-400 focus:ring-0 cursor-pointer hover:text-indigo-400"
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                >
                  <option className="bg-gray-800 text-white" value="todo">To Do</option>
                  <option className="bg-gray-800 text-white" value="in_progress">In Progress</option>
                  <option className="bg-gray-800 text-white" value="done">Done</option>
                </select>

                {/* DELETE BUTTON */}
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  // CHANGED: text-gray-300 -> text-gray-600, hover:text-red-500 -> hover:text-red-400, hover:bg-red-50 -> hover:bg-red-900/20
                  className="text-gray-600 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && !showTaskForm && (
            // CHANGED: bg-gray-50 -> bg-gray-800/50, border-gray-300 -> border-gray-700
            <div className="text-center py-10 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
              {/* CHANGED: text-gray-500 -> text-gray-400 */}
              <p className="text-gray-400">No tasks found for this project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}