import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function PollCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endsAt, setEndsAt] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => setOptions([...options, '']);
  const handleRemoveOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (options.filter(o => o.trim()).length < 2) {
      alert('Добавьте минимум 2 варианта ответа');
      return;
    }
    if (!endsAt) {
      alert('Укажите время окончания');
      return;
    }
    if (!user) {
      alert('Необходимо авторизоваться');
      return;
    }

    setLoading(true);
    try {
      const formattedOptions = options.filter(o => o.trim()).map((opt, idx) => ({
        id: `opt_${idx}_${Date.now()}`,
        text: opt
      }));

      await addDoc(collection(db, 'polls'), {
        creator_id: user.id,
        title,
        description,
        options: formattedOptions,
        status: 'active',
        starts_at: serverTimestamp(),
        ends_at: new Date(endsAt),
        is_anonymous: isAnonymous,
        multiple_choice: multipleChoice,
        created_at: serverTimestamp()
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating poll:', error);
      alert(error.message || 'Ошибка создания опроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Создать опрос</h1>
        <p className="text-zinc-400">Настройте параметры и варианты ответов.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-zinc-800 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Вопрос</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              placeholder="Что будем обсуждать?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Описание (необязательно)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors resize-none h-24"
              placeholder="Дополнительная информация..."
            />
          </div>
        </div>

        <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-zinc-800 space-y-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Варианты ответов</label>
          
          {options.map((opt, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                required
                value={opt}
                onChange={e => handleOptionChange(i, e.target.value)}
                className="flex-1 bg-[#0f0f0f] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                placeholder={`Вариант ${i + 1}`}
              />
              {options.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveOption(i)}
                  className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}

          <button
            type="button"
            onClick={handleAddOption}
            className="w-full py-3 border border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить вариант
          </button>
        </div>

        <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-zinc-800 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Время завершения</label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={endsAt}
                onChange={e => setEndsAt(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 text-[#FFD700] focus:ring-[#FFD700] bg-[#0f0f0f]"
              />
              <div>
                <div className="font-medium text-white">Анонимное голосование</div>
                <div className="text-sm text-zinc-500">Имена проголосовавших будут скрыты</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={multipleChoice}
                onChange={e => setMultipleChoice(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 text-[#FFD700] focus:ring-[#FFD700] bg-[#0f0f0f]"
              />
              <div>
                <div className="font-medium text-white">Множественный выбор</div>
                <div className="text-sm text-zinc-500">Пользователи смогут выбрать несколько вариантов</div>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFD700] hover:bg-[#F2C200] text-black font-semibold py-4 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Создание...' : 'Запустить опрос'}
        </button>
      </form>
    </div>
  );
}
