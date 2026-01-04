import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function RegisterTenant() {
  const [formData, setFormData] = useState({
    tenantName: '',
    subdomain: '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls POST /api/auth/register-tenant
      await api.post('/auth/register-tenant', formData);
      toast.success('Organization registered! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    // CHANGED: bg-gray-50 -> bg-gray-900
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* CHANGED: bg-white -> bg-gray-800, added border border-gray-700 */}
      <div className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 rounded shadow-md">
        {/* CHANGED: text-gray-900 (implied) -> text-white */}
        <h2 className="mb-6 text-2xl font-bold text-center text-white">Register Organization</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Organization Details */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Company Name</label>
            <input 
              name="tenantName" 
              required 
              onChange={handleChange} 
              // CHANGED: bg-white -> bg-gray-700, border-gray-200 -> border-gray-600, text-white
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="e.g. Acme Inc" 
            />
          </div>
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Subdomain</label>
            <input 
              name="subdomain" 
              required 
              onChange={handleChange} 
              // CHANGED: bg-white -> bg-gray-700, border-gray-200 -> border-gray-600, text-white
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="e.g. acme" 
            />
            {/* CHANGED: text-gray-500 -> text-gray-400 */}
            <p className="text-xs text-gray-400 mt-1">Your URL will be: acme.saas-platform.com (or similar)</p>
          </div>

          {/* CHANGED: hr default color -> border-gray-600 */}
          <hr className="my-4 border-gray-600" />

          {/* Admin Details */}
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Admin Name</label>
            <input 
              name="adminFullName" 
              required 
              onChange={handleChange} 
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Admin Email</label>
            <input 
              type="email" 
              name="adminEmail" 
              required 
              onChange={handleChange} 
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            {/* CHANGED: text-gray-700 -> text-gray-300 */}
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              name="adminPassword" 
              required 
              onChange={handleChange} 
              // CHANGED: Dark input styles
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>

          <button type="submit" className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500">
            Register Organization
          </button>
        </form>

        <div className="mt-4 text-center">
            {/* CHANGED: text-blue-600 -> text-blue-400 */}
            <Link to="/login" className="text-sm text-blue-400 hover:underline">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
}