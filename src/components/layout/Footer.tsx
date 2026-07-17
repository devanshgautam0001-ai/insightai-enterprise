import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-xs font-mono">
      <span>© 2026 InsightAI Inc. All rights reserved.</span>
      <div className="flex gap-6 mt-2 sm:mt-0">
        <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#security" className="hover:text-white transition-colors">Enterprise Security</a>
      </div>
    </footer>
  );
};
