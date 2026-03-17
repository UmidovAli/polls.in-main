import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-zinc-600">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900">$0</span>
                <span className="text-zinc-500">/forever</span>
              </div>
              <p className="text-zinc-600 mt-4">Perfect for trying out the platform and small team decisions.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited voting', '3 active polls at a time', 'Results revealed after close', 'Standard support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 px-6 rounded-xl border-2 border-zinc-200 text-zinc-900 font-medium hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
              Start for free
            </button>
            <p className="text-center text-xs text-zinc-500 mt-4">No credit card required</p>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-xl flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$12</span>
                <span className="text-zinc-400">/month</span>
              </div>
              <p className="text-zinc-400 mt-4">For event hosts, educators, and power users.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited active polls', 'Live real-time dashboard', 'Export results to CSV', 'Priority support', 'Custom branding'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 px-6 rounded-xl bg-yellow-400 text-black font-medium hover:bg-yellow-500 transition-colors">
              Upgrade to Pro
            </button>
            <p className="text-center text-xs text-zinc-500 mt-4">Cancel anytime</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
