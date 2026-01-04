import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Search, Mail, Shield, User, Trash2, Plus } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'user' });

  // --- SAFE USER PARSING (Fixes White Screen Crash) ---
  let currentUser = { role: 'user' };
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.warn("Corrupted user data in Users page");
  }
  const isAdmin = currentUser.role === 'tenant_admin';
  // ----------------------------------------------------

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      toast.success('Team member added successfully');
      setShowModal(false);
      setFormData({ fullName: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the team?")) return;
    
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User removed successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* CHANGED: text-gray-900 -> text-white */}
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          {/* CHANGED: text-gray-500 -> text-gray-400 */}
          <p className="text-gray-400 mt-1">Manage access and roles for your organization</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            // CHANGED: hover:bg-indigo-700 -> hover:bg-indigo-500
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" /> Add Member
          </button>
        )}
      </div>

      {/* Users Table */}
      {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {/* CHANGED: divide-gray-200 -> divide-gray-700 */}
          <table className="min-w-full divide-y divide-gray-700">
            {/* CHANGED: bg-gray-50 -> bg-gray-900/50 */}
            <thead className="bg-gray-900/50">
              <tr>
                {/* CHANGED: text-gray-500 -> text-gray-400 */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            {/* CHANGED: bg-white -> bg-gray-800, divide-gray-200 -> divide-gray-700 */}
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                // CHANGED: hover:bg-gray-50 -> hover:bg-gray-700
                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {/* CHANGED: bg-indigo-100 -> bg-indigo-900, text-indigo-600 -> text-indigo-300, border-indigo-200 -> border-indigo-700 */}
                        <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold border border-indigo-700">
                          {user.fullName?.[0] || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        {/* CHANGED: text-gray-900 -> text-white */}
                        <div className="text-sm font-medium text-white">{user.fullName}</div>
                        {/* CHANGED: text-gray-500 -> text-gray-400 */}
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                      user.role === 'tenant_admin' 
                        // CHANGED: bg-purple-100 -> bg-purple-900/30, text-purple-800 -> text-purple-300, border-purple-200 -> border-purple-700
                        ? 'bg-purple-900/30 text-purple-300 border border-purple-700' 
                        // CHANGED: bg-green-100 -> bg-green-900/30, text-green-800 -> text-green-300, border-green-200 -> border-green-700
                        : 'bg-green-900/30 text-green-300 border border-green-700'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* CHANGED: bg-green-100 -> bg-green-900/30, text-green-800 -> text-green-300 */}
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-300">
                      Active
                    </span>
                  </td>
                  {/* CHANGED: text-gray-500 -> text-gray-400 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  
                  {/* Delete Button Column */}
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id !== currentUser.id ? (
                        <button 
                          onClick={() => handleDelete(user.id)}
                          // CHANGED: text-gray-400 -> text-gray-500, hover:text-red-600 -> hover:text-red-400, hover:bg-red-50 -> hover:bg-red-900/20
                          className="text-gray-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      ) : (
                        // CHANGED: text-gray-400 -> text-gray-600
                        <span className="text-xs text-gray-600 italic">You</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && !loading && (
           // CHANGED: text-gray-500 -> text-gray-400
           <div className="p-8 text-center text-gray-400">No team members found.</div>
        )}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
          {/* CHANGED: bg-white -> bg-gray-800 */}
          <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-700">
            {/* CHANGED: border-gray-100 -> border-gray-700, bg-gray-50 -> bg-gray-900 */}
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
              {/* CHANGED: text-gray-900 -> text-white */}
              <h3 className="text-lg font-bold text-white">Add Team Member</h3>
              {/* CHANGED: text-gray-400 -> text-gray-500, hover:text-gray-600 -> hover:text-gray-300 */}
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                {/* CHANGED: text-gray-700 -> text-gray-300 */}
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  {/* CHANGED: text-gray-400 -> text-gray-500 */}
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input 
                    type="text" 
                    required
                    // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                {/* CHANGED: text-gray-700 -> text-gray-300 */}
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  {/* CHANGED: text-gray-400 -> text-gray-500 */}
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input 
                    type="email" 
                    required
                    // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                {/* CHANGED: text-gray-700 -> text-gray-300 */}
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  {/* CHANGED: text-gray-400 -> text-gray-500 */}
                  <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input 
                    type="password" 
                    required
                    // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                {/* CHANGED: text-gray-700 -> text-gray-300 */}
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select 
                  // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User (Read/Write assigned tasks)</option>
                  <option value="tenant_admin">Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  // CHANGED: border-gray-300 -> border-gray-600, text-gray-700 -> text-gray-300, hover:bg-gray-50 -> hover:bg-gray-700
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  // CHANGED: hover:bg-indigo-700 -> hover:bg-indigo-500
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium transition shadow-sm"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}