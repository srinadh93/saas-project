import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenantSubdomain: '' // Required for regular users
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      
      // Save token and user info
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    // CHANGED: bg-gray-100 -> bg-gray-900 (Dark Background)
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      
      {/* CHANGED: bg-white -> bg-gray-800 (Dark Card), Added border-gray-700 */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 border border-gray-700 rounded shadow-md">
        
        <div className="text-center">
          {/* CHANGED: text color to white */}
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          {/* CHANGED: text-gray-500 -> text-gray-400 */}
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Workspace Field */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">
              Workspace (Subdomain)
            </label>
            <input
              type="text"
              name="tenantSubdomain"
              placeholder="e.g. demo (Leave empty for Super Admin)"
              // CHANGED: Added bg-gray-700, text-white, border-gray-600, placeholder-gray-500
              className="w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2"
              value={formData.tenantSubdomain}
              onChange={handleChange}
            />
          </div>

          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              required
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            // CHANGED: Added focus ring offset for dark mode accessibility
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>

        {/* Footer Links */}
        {/* CHANGED: text-gray-600 -> text-gray-400 */}
        <div className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          {/* CHANGED: text-blue-600 -> text-blue-400 (Lighter blue is better on dark) */}
          <Link to="/register" className="font-medium text-blue-400 hover:underline">
            Register User
          </Link>
          <span className="mx-2">|</span>
          <Link to="/register-tenant" className="font-medium text-blue-400 hover:underline">
            Register Organization
          </Link>
        </div>

      </div>
    </div>
  );
}