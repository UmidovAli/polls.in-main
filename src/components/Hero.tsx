import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Clock } from 'lucide-react';

export default function Hero() {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({ a: 45, b: 22, c: 18 });
  const [totalVotes, setTotalVotes] = useState(85);

  const handleVote = (option: 'a' | 'b' | 'c') => {
    if (voted) return;
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setTotalVotes(prev => prev + 1);
    setVoted(true);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
              Launch a poll in 30 seconds. <span className="text-yellow-500">See results live.</span>
            </h1>
            <p className="text-xl text-zinc-600 mb-8">
              The fastest way for teams, events, and communities to make decisions and gather feedback. No jargon, just results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-medium px-8 py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M14.5 4H9.5C6.5 4 4 6.5 4 9.5V14.5C4 17.5 6.5 20 9.5 20H14.5C17.5 20 20 17.5 20 14.5V9.5C20 6.5 17.5 4 14.5 4Z" fill="currentColor"/>
                  <path d="M10.5 15.5L15.5 9.5H13.5L10.5 13.5L8.5 11.5H6.5L10.5 15.5Z" fill="white"/>
                </svg>
                Start free with Yandex
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                ))}
              </div>
              <p><strong className="text-zinc-900 font-semibold">1,200+</strong> polls created this week</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/40 to-yellow-100/20 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-zinc-900">What should we build next?</h3>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'a', label: 'Dark Mode', votes: votes.a },
                  { id: 'b', label: 'API Access', votes: votes.b },
                  { id: 'c', label: 'Slack Integration', votes: votes.c }
                ].map((option) => {
                  const percentage = Math.round((option.votes / totalVotes) * 100);
                  return (
                    <div key={option.id} className="relative">
                      <button
                        onClick={() => handleVote(option.id as any)}
                        disabled={voted}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          voted 
                            ? 'border-zinc-200 bg-zinc-50 cursor-default' 
                            : 'border-zinc-200 hover:border-yellow-400 hover:bg-yellow-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex justify-between items-center relative z-10">
                          <span className="font-medium text-zinc-900">{option.label}</span>
                          {voted && <span className="text-zinc-500 font-medium">{percentage}%</span>}
                        </div>
                        {voted && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute left-0 top-0 bottom-0 bg-yellow-100 rounded-xl -z-0"
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-zinc-500 border-t border-zinc-100 pt-4">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>{totalVotes} votes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Ends in 2h 15m</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
