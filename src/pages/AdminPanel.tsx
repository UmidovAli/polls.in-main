import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Users, BarChart3, Trash2, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('created_at', 'desc')));
        const pollsSnap = await getDocs(query(collection(db, 'polls'), orderBy('created_at', 'desc')));
        
        setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPolls(pollsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Ошибка при обновлении роли");
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    // We can't use window.confirm in iframe, so we'll just delete it directly for now
    // In a real app, we'd use a custom modal
    try {
      await deleteDoc(doc(db, 'polls', pollId));
      setPolls(polls.filter(p => p.id !== pollId));
    } catch (error) {
      console.error("Error deleting poll:", error);
      alert("Ошибка при удалении опроса");
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-24 bg-[#1a1a2e] rounded-2xl border border-zinc-800">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Доступ запрещён</h3>
        <p className="text-zinc-400">Только администраторы могут просматривать эту страницу.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center text-zinc-500 py-12">Загрузка...</div>;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-sm text-zinc-400">Пользователей</div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{polls.length}</div>
            <div className="text-sm text-zinc-400">Всего опросов</div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{polls.filter(p => p.status === 'active').length}</div>
            <div className="text-sm text-zinc-400">Активных опросов</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Пользователи</h2>
        <div className="bg-[#1a1a2e] rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-zinc-300 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Пользователь</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Роль</th>
                <th className="px-6 py-4 font-medium">Последний вход</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={u.avatar_url || 'https://i.pravatar.cc/150'} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-white">{u.display_name}</span>
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === user.id}
                      className="bg-[#0f0f0f] border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#FFD700] disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="superuser">Superuser</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {u.last_login ? formatDistanceToNow(new Date(u.last_login), { locale: ru, addSuffix: true }) : 'Никогда'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Управление опросами</h2>
        <div className="bg-[#1a1a2e] rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-zinc-300 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Название</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium">Создан</th>
                <th className="px-6 py-4 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {polls.map(p => (
                <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {p.status === 'active' ? 'Активен' : 'Завершён'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(p.created_at), { locale: ru, addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeletePoll(p.id)}
                      className="text-zinc-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
