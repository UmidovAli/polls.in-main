import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export default function Footer() {
  const faqs = [
    {
      q: "Is it really free?",
      a: "Yes! Our free tier allows unlimited voting and up to 3 active polls at any time. You only pay if you need advanced features like the live dashboard or unlimited active polls."
    },
    {
      q: "Is voting anonymous?",
      a: "You can choose. Poll creators can toggle 'Anonymous Mode' on or off for each poll. When on, voter identities are completely hidden."
    },
    {
      q: "What happens when a poll ends?",
      a: "The poll stops accepting new votes. If you're on the free tier, the results are then revealed to everyone. Pro users can see results live while the poll is active."
    },
    {
      q: "How many people can vote?",
      a: "There is no hard limit on the number of voters. Our infrastructure scales automatically to handle thousands of concurrent votes."
    },
    {
      q: "Do voters need an account?",
      a: "Yes, voters sign in with one click using their Yandex account. This ensures one vote per person and prevents spam, without the hassle of creating new passwords."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FAQ Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-zinc-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-zinc-50 transition-colors"
                >
                  <span className="font-medium text-zinc-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-zinc-600 border-t border-zinc-100 bg-zinc-50/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-zinc-50 rounded-3xl p-12 border border-zinc-100 mb-16">
          <h2 className="text-4xl font-bold text-zinc-900 mb-6">Launch a poll in 30 seconds.</h2>
          <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams making faster, better decisions.
          </p>
          <button className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-medium px-8 py-4 rounded-xl text-lg transition-colors inline-flex items-center justify-center gap-2 shadow-sm mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M14.5 4H9.5C6.5 4 4 6.5 4 9.5V14.5C4 17.5 6.5 20 9.5 20H14.5C17.5 20 20 17.5 20 14.5V9.5C20 6.5 17.5 4 14.5 4Z" fill="currentColor"/>
              <path d="M10.5 15.5L15.5 9.5H13.5L10.5 13.5L8.5 11.5H6.5L10.5 15.5Z" fill="white"/>
            </svg>
            Start free with Yandex
          </button>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            3 polls started in the last 5 minutes
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-zinc-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; {new Date().getFullYear()} Yandex Polls Platform. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
