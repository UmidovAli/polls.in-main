import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { user, loading, loginWithGoogle } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Загрузка...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка входа. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a2e] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-zinc-800"
      >
        <div className="w-16 h-16 bg-[#FFD700] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 4H9.5C6.5 4 4 6.5 4 9.5V14.5C4 17.5 6.5 20 9.5 20H14.5C17.5 20 20 17.5 20 14.5V9.5C20 6.5 17.5 4 14.5 4Z" fill="currentColor" className="text-black"/>
            <path d="M10.5 15.5L15.5 9.5H13.5L10.5 13.5L8.5 11.5H6.5L10.5 15.5Z" fill="white"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Добро пожаловать</h1>
        <p className="text-zinc-400 mb-8">Войдите, чтобы участвовать в опросах и видеть результаты.</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            className="w-full bg-[#FFD700] hover:bg-[#F2C200] text-black font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Войти через Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
