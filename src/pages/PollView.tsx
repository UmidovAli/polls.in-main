import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { db } from '../firebase';
import { doc, getDoc, collection, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export default function PollView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const pollRef = doc(db, 'polls', id);
    const unsubscribePoll = onSnapshot(pollRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPoll(prev => ({
          ...(prev || {}),
          id: docSnap.id,
          ...data,
          ends_at: data.ends_at?.toDate ? data.ends_at.toDate() : new Date(data.ends_at),
          created_at: data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at),
        }));
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    });

    return () => unsubscribePoll();
  }, [id, navigate, user]);

  useEffect(() => {
    if (!id || !user || !poll) return;

    // Check user's vote
    const userVoteRef = doc(db, 'polls', id, 'votes', user.id);
    getDoc(userVoteRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedOptions(data.option_ids || []);
        setPoll(p => ({ ...p, userVotes: data.option_ids || [] }));
      }
    });

    // Listen to all votes for results
    const votesRef = collection(db, 'polls', id, 'votes');
    const unsubscribeVotes = onSnapshot(votesRef, (snapshot) => {
      const votes = snapshot.docs.map(doc => doc.data());
      const totalVotes = votes.length;
      
      const resultsMap: Record<string, number> = {};
      poll.options.forEach((opt: any) => {
        resultsMap[opt.id] = 0;
      });

      votes.forEach(vote => {
        vote.option_ids?.forEach((optId: string) => {
          if (resultsMap[optId] !== undefined) {
            resultsMap[optId]++;
          }
        });
      });

      const aggregatedResults = poll.options.map((opt: any) => ({
        option_id: opt.id,
        option_text: opt.text || opt.option_text,
        votes: resultsMap[opt.id],
        percentage: totalVotes > 0 ? Math.round((resultsMap[opt.id] / totalVotes) * 100) : 0
      }));

      setResults({
        results: aggregatedResults,
        total_votes: totalVotes,
        timestamp: new Date().toISOString()
      });
    });

    return () => unsubscribeVotes();
  }, [id, user, poll?.id]);

  const handleVote = async () => {
    if (selectedOptions.length === 0 || !user || !id) return;
    setVoting(true);
    try {
      const voteRef = doc(db, 'polls', id, 'votes', user.id);
      await setDoc(voteRef, {
        user_id: user.id,
        option_ids: selectedOptions,
        voted_at: serverTimestamp()
      });
      setPoll({ ...poll, userVotes: selectedOptions });
    } catch (error: any) {
      console.error('Error voting:', error);
      alert(error.message || 'Ошибка голосования');
    } finally {
      setVoting(false);
    }
  };

  const toggleOption = (optId: string) => {
    if (poll.userVotes?.length > 0) return; // Already voted
    if (poll.status !== 'active') return;

    if (poll.multiple_choice) {
      setSelectedOptions(prev => 
        prev.includes(optId) ? prev.filter(id => id !== optId) : [...prev, optId]
      );
    } else {
      setSelectedOptions([optId]);
    }
  };

  if (loading) return <div className="text-center py-12 text-zinc-500">Загрузка...</div>;
  if (!poll) return null;

  const hasVoted = poll.userVotes?.length > 0;
  const canSeeResults = poll.status === 'closed' || user?.role === 'superuser' || user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#1a1a2e] p-8 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
            poll.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
          }`}>
            {poll.status === 'active' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Идёт голосование
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Опрос завершён
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Clock className="w-4 h-4" />
            {poll.status === 'active' ? (
              <span>Осталось {formatDistanceToNow(new Date(poll.ends_at), { locale: ru })}</span>
            ) : (
              <span>Завершён {new Date(poll.ends_at).toLocaleString('ru-RU')}</span>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">{poll.title}</h1>
        {poll.description && <p className="text-zinc-400 text-lg mb-8">{poll.description}</p>}

        <div className="space-y-4 mb-8">
          {poll.options.map((opt: any) => {
            const isSelected = selectedOptions.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                disabled={hasVoted || poll.status !== 'active'}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'border-[#FFD700] bg-[#FFD700]/10' 
                    : 'border-zinc-800 bg-[#0f0f0f] hover:border-zinc-600'
                } ${(hasVoted || poll.status !== 'active') && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={`text-lg font-medium ${isSelected ? 'text-[#FFD700]' : 'text-zinc-300'}`}>
                  {opt.text || opt.option_text}
                </span>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-[#FFD700] bg-[#FFD700]' : 'border-zinc-600'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-black" />}
                </div>
              </button>
            );
          })}
        </div>

        {!hasVoted && poll.status === 'active' && (
          <button
            onClick={handleVote}
            disabled={selectedOptions.length === 0 || voting}
            className="w-full bg-[#FFD700] hover:bg-[#F2C200] text-black font-semibold py-4 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting ? 'Отправка...' : 'Проголосовать'}
          </button>
        )}

        {hasVoted && poll.status === 'active' && !canSeeResults && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Ваш голос учтён</h4>
              <p className="text-sm opacity-80 mt-1">Результаты будут доступны после завершения опроса.</p>
            </div>
          </div>
        )}
      </div>

      {canSeeResults && results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a2e] p-8 rounded-3xl border border-zinc-800 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Результаты</h2>
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="font-medium">{results.total_votes} голосов</span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.results} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="option_text" type="category" width={150} tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number) => [`${value} голосов`, 'Голоса']}
                />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]} animationDuration={1000}>
                  {results.results.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.votes > 0 ? '#FFD700' : '#3f3f46'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
