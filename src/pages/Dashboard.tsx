import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'polls'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          ends_at: data.ends_at?.toDate ? data.ends_at.toDate() : new Date(data.ends_at),
          created_at: data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at),
        };
      });
      setPolls(pollsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching polls:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="text-center text-zinc-500 py-12">Загрузка опросов...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Опросы</h1>
        {(user?.role === 'superuser' || user?.role === 'admin') && (
          <Link to="/create" className="sm:hidden bg-[#FFD700] hover:bg-[#F2C200] text-black font-medium px-4 py-2 rounded-xl transition-colors">
            Создать
          </Link>
        )}
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-24 bg-[#1a1a2e] rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Нет активных опросов</h3>
          <p className="text-zinc-400">Пока никто не создал ни одного опроса.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll, i) => (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#1a1a2e] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white line-clamp-2">{poll.title}</h3>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                  poll.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {poll.status === 'active' ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Активен
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Завершён
                    </>
                  )}
                </div>
              </div>

              <p className="text-zinc-400 text-sm mb-6 line-clamp-2 flex-1">{poll.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock className="w-4 h-4" />
                  {poll.status === 'active' ? (
                    <span>До конца {formatDistanceToNow(new Date(poll.ends_at), { locale: ru })}</span>
                  ) : (
                    <span>Завершён {formatDistanceToNow(new Date(poll.ends_at), { locale: ru, addSuffix: true })}</span>
                  )}
                </div>
                
                <Link 
                  to={`/poll/${poll.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    poll.status === 'active' 
                      ? 'bg-[#FFD700] hover:bg-[#F2C200] text-black' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  {poll.status === 'active' ? 'Участвовать' : 'Результаты'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
