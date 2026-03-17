import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mic2, GraduationCap, Globe2 } from 'lucide-react';

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(0);

  const cases = [
    {
      id: 'teams',
      icon: <Users className="w-4 h-4" />,
      title: 'Teams & Companies',
      headline: 'Make quick decisions without the meeting.',
      description: 'Perfect for retrospective votes, anonymous feedback sessions, and deciding where to order lunch.',
      demo: {
        question: 'How should we handle the Q3 roadmap?',
        options: ['Delay feature X, focus on bugs', 'Push through as planned', 'Cut scope, keep deadline']
      }
    },
    {
      id: 'events',
      icon: <Mic2 className="w-4 h-4" />,
      title: 'Events & Conferences',
      headline: 'Engage your audience in real-time.',
      description: 'Run live audience Q&A, session ratings, and real-time show-of-hands right from the stage.',
      demo: {
        question: 'Which topic should we cover next?',
        options: ['Advanced React Patterns', 'State Machines', 'Performance Tuning']
      }
    },
    {
      id: 'educators',
      icon: <GraduationCap className="w-4 h-4" />,
      title: 'Educators',
      headline: 'Keep students engaged and accountable.',
      description: 'Run class quizzes with a countdown timer. Reveal results only after the deadline passes.',
      demo: {
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome']
      }
    },
    {
      id: 'communities',
      icon: <Globe2 className="w-4 h-4" />,
      title: 'Communities',
      headline: 'Transparent decisions for online groups.',
      description: 'Run preference polls and group decisions with verifiable, transparent results.',
      demo: {
        question: 'When should we host the next meetup?',
        options: ['Thursday evening', 'Saturday afternoon', 'Sunday morning']
      }
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Who is it for?</h2>
          <p className="text-lg text-zinc-600">Tailored for any group that needs to decide together.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            {cases.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                  activeTab === idx 
                    ? 'bg-zinc-900 text-white shadow-md' 
                    : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === idx ? 'bg-zinc-800' : 'bg-white shadow-sm'}`}>
                  {c.icon}
                </div>
                <span className="font-medium">{c.title}</span>
              </button>
            ))}
          </div>

          <div className="w-full lg:w-2/3 bg-zinc-50 rounded-3xl p-8 border border-zinc-100 min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full grid md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4">{cases[activeTab].headline}</h3>
                  <p className="text-zinc-600 leading-relaxed mb-6">{cases[activeTab].description}</p>
                  <button className="text-zinc-900 font-medium inline-flex items-center gap-1 hover:text-yellow-600 transition-colors">
                    See how it works <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                  <div className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">Live Preview</div>
                  <h4 className="font-semibold text-zinc-900 mb-4">{cases[activeTab].demo.question}</h4>
                  <div className="space-y-3">
                    {cases[activeTab].demo.options.map((opt, i) => (
                      <div key={i} className="p-3 rounded-lg border border-zinc-200 text-sm text-zinc-700 flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-zinc-300"></div>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
