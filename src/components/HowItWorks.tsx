import { motion } from 'motion/react';
import { LogIn, Edit3, Share2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <LogIn className="w-6 h-6 text-yellow-600" />,
      title: "Sign in with Yandex",
      description: "One click, no password required."
    },
    {
      icon: <Edit3 className="w-6 h-6 text-yellow-600" />,
      title: "Create your poll",
      description: "Title + options + end time."
    },
    {
      icon: <Share2 className="w-6 h-6 text-yellow-600" />,
      title: "Share & watch live",
      description: "Link or QR code, real-time results."
    }
  ];

  return (
    <section className="py-20 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">How it works</h2>
          <p className="text-lg text-zinc-600">Three simple steps to your first live poll.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-zinc-100 -z-10"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-yellow-200/50">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">{step.title}</h3>
              <p className="text-zinc-600 max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
