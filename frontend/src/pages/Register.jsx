import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',       // Changed from 'name' to match backend
    email: '',
    password: '',
    tenantSubdomain: '', // Required to know which company to join
    role: 'User'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls POST /api/auth/register
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    // CHANGED: bg-gray-100 -> bg-gray-900
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* CHANGED: bg-white -> bg-gray-800, added border border-gray-700 */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 border border-gray-700 rounded shadow-md">
        {/* CHANGED: text-gray-900 (implied) -> text-white */}
        <h2 className="text-2xl font-bold text-center text-white">Join Workspace</h2>
        {/* CHANGED: text-gray-500 -> text-gray-400 */}
        <p className="text-sm text-center text-gray-400">Create an account in an existing organization</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Workspace Field */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Workspace ID (Subdomain)</label>
            <input
              type="text"
              name="tenantSubdomain"
              required
              placeholder="e.g. demo"
              // CHANGED: border-gray-300 -> border-gray-600, bg-gray-700, text-white, placeholder-gray-500
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.tenantSubdomain}
              onChange={handleChange}
            />
            {/* CHANGED: text-gray-500 -> text-gray-400 */}
            <p className="text-xs text-gray-400 mt-1">Ask your admin for the workspace subdomain.</p>
          </div>

          {/* Name Field */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              required
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Role Field */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <select
              name="role"
              // CHANGED: Dark select styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Tenant Admin</option>
            </select>
          </div>

          <button
            type="submit"
            // CHANGED: hover:bg-blue-700 (kept consistent), added focus ring
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            Register
          </button>
        </form>

        {/* CHANGED: text-gray-600 -> text-gray-400 */}
        <div className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          {/* CHANGED: text-blue-600 -> text-blue-400 */}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}