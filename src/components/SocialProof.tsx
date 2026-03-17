import { motion } from 'motion/react';
import { ShieldCheck, Lock, Zap, CheckCircle } from 'lucide-react';

export default function SocialProof() {
  const testimonials = [
    {
      quote: "We use it for every all-hands meeting. The live results keep the team engaged and the anonymous mode ensures honest feedback.",
      author: "Sarah Jenkins",
      role: "VP of Engineering",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      quote: "Setup takes literally 10 seconds. I drop the QR code on my presentation slide and the audience votes immediately.",
      author: "David Chen",
      role: "Conference Speaker",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      quote: "The auto-close timer is a game changer for my online classes. Students know exactly how much time they have left.",
      author: "Elena Rodriguez",
      role: "University Professor",
      avatar: "https://i.pravatar.cc/150?img=44"
    }
  ];

  return (
    <section className="py-24 bg-zinc-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Live Stats */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex flex-col items-center"
          >
            <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-4 tracking-tighter">
              14,382
            </span>
            <span className="text-xl text-zinc-400 font-medium tracking-wide uppercase">Votes cast today</span>
          </motion.div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700/50"
            >
              <p className="text-zinc-300 mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-medium text-white">{t.author}</div>
                  <div className="text-sm text-zinc-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-12 border-t border-zinc-800">
          <div className="flex flex-col items-center text-center gap-2">
            <ShieldCheck className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-zinc-400 font-medium">100% Yandex Verified</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Lock className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-zinc-400 font-medium">Data Encrypted</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-zinc-400 font-medium">0 Passwords Needed</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <CheckCircle className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-zinc-400 font-medium">GDPR-Ready</span>
          </div>
        </div>

      </div>
    </section>
  );
}
