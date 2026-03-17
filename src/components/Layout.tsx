import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, Plus } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 font-sans selection:bg-[#FFD700]/30">
      <header className="bg-[#1a1a2e] border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
            <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center">
              <span className="text-black text-lg">Y</span>
            </div>
            Polls
          </Link>

          <div className="flex items-center gap-4">
            {(user.role === 'superuser' || user.role === 'admin') && (
              <Link to="/create" className="hidden sm:flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Создать опрос
              </Link>
            )}
            
            {user.role === 'admin' && (
              <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <img src={user.avatar_url || 'https://i.pravatar.cc/150'} alt={user.display_name} className="w-8 h-8 rounded-full border border-zinc-700" />
              <span className="text-sm font-medium hidden md:block">{user.display_name}</span>
              <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 transition-colors ml-2">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
