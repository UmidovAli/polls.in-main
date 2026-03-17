import { motion } from 'motion/react';
import { Activity, Timer, Eye, Ghost, KeyRound, CheckSquare } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Activity className="w-5 h-5" />,
      title: "See votes update live",
      description: "Superuser dashboard shows bars animating as votes come in. No refreshing needed."
    },
    {
      icon: <Timer className="w-5 h-5" />,
      title: "Auto-close timer",
      description: "Set an exact end time. Poll closes automatically, results revealed to all."
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Role-based visibility",
      description: "Superusers see live data. Regular users see results only after the poll ends."
    },
    {
      icon: <Ghost className="w-5 h-5" />,
      title: "Anonymous mode",
      description: "Toggle to hide voter identities. Useful for sensitive team decisions."
    },
    {
      icon: <KeyRound className="w-5 h-5" />,
      title: "One-click Yandex login",
      description: "No passwords to remember. Voters are always authenticated securely."
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      title: "Multi-choice polls",
      description: "Allow voters to select multiple options. Ideal for preference surveys."
    }
  ];

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Everything you need. Nothing you don't.</h2>
          <p className="text-lg text-zinc-600">Built for speed and clarity, with powerful features just beneath the surface.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-700 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
