import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Folder, LogOut, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SAFE USER PARSING 2.0 (Completely crash-proof)
  let user = { fullName: 'User', email: '' };
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.warn("User data corrupted, using default.");
    // Do NOT navigate here to avoid infinite loops, just use default user
  }

  const handleLogout = () => {
    localStorage.clear(); // Clear everything
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: Folder },
    { label: 'Team', path: '/users', icon: Users },
  ];

  return (
    // CHANGED: bg-gray-50 -> bg-gray-900 (Main dark background)
    <div className="min-h-screen flex bg-gray-900 text-white">
      
      {/* Sidebar for Desktop */}
      {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 fixed h-full z-10">
        
        {/* CHANGED: border-gray-100 -> border-gray-700 */}
        <div className="p-6 border-b border-gray-700 flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          {/* CHANGED: text-gray-800 -> text-white */}
          <span className="text-xl font-bold text-white">SaaS Platform</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                // CHANGED: Active/Hover states for dark mode
                // Active: bg-indigo-50 -> bg-indigo-900/50, text-indigo-700 -> text-indigo-300
                // Inactive: text-gray-600 -> text-gray-400, hover:bg-gray-50 -> hover:bg-gray-700, hover:text-white
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-900/50 text-indigo-300' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {/* CHANGED: Icon colors. text-indigo-600 -> text-indigo-400 */}
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CHANGED: border-gray-100 -> border-gray-700 */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            {/* CHANGED: bg-indigo-100 -> bg-gray-700, text-indigo-700 -> text-indigo-300 */}
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-indigo-300 font-bold text-xs">
              {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              {/* CHANGED: text-gray-900 -> text-white */}
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              {/* CHANGED: text-gray-500 -> text-gray-400 */}
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            // CHANGED: text-red-600 -> text-red-400, hover:bg-red-50 -> hover:bg-red-900/20
            className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      {/* CHANGED: bg-white -> bg-gray-800, border-gray-200 -> border-gray-700 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-20 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          {/* CHANGED: text-gray-800 -> text-white */}
          <span className="font-bold text-white">SaaS Platform</span>
        </div>
        {/* CHANGED: text-gray-600 -> text-gray-300 */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-70 z-10" onClick={() => setIsMobileMenuOpen(false)}>
          {/* CHANGED: bg-white -> bg-gray-800 */}
          <div className="bg-gray-800 w-64 h-full pt-20 p-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  // CHANGED: Same active logic as desktop
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === item.path ? 'bg-indigo-900/50 text-indigo-300' : 'text-gray-400'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                // CHANGED: Red text adjustment for dark mode
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg mt-4"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {/* Background is already set on the parent div */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}