import React from 'react';
import { Palette, Check } from 'lucide-react';
import { DashboardThemeType } from '../../types/dashboard';

interface ThemeManagerProps {
  activeTheme: DashboardThemeType;
  onChangeTheme: (theme: DashboardThemeType) => void;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({ activeTheme, onChangeTheme }) => {
  const skins: Array<{ id: DashboardThemeType; name: string; desc: string; colors: string[] }> = [
    {
      id: 'glass',
      name: 'Cosmic Glassmorphism',
      desc: 'Reflective frosted glass headers with deep dark void backing. High visibility corporate layout.',
      colors: ['bg-zinc-950', 'bg-purple-500', 'bg-violet-600']
    },
    {
      id: 'midnight',
      name: 'Midnight Deep Blue',
      desc: 'Subtle slate blue containers with electric navy borders. Ideal for command centers.',
      colors: ['bg-[#030712]', 'bg-blue-600', 'bg-sky-500']
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      desc: 'Glowing fuchsia and bright cyan accents over rich violet card backing. Extreme high-contrast.',
      colors: ['bg-[#090514]', 'bg-pink-500', 'bg-[#00ffcc]']
    },
    {
      id: 'emerald',
      name: 'Forest Emerald',
      desc: 'Deep warm emerald greens paired with light mint text markers. Comfort visual aesthetics.',
      colors: ['bg-[#021c15]', 'bg-emerald-600', 'bg-teal-500']
    },
    {
      id: 'nordic-light',
      name: 'Nordic Clean Light',
      desc: 'Clean grey-white backplane with solid ink lines. High readability paper feel.',
      colors: ['bg-[#f4f4f5]', 'bg-indigo-600', 'bg-zinc-800']
    }
  ];

  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs space-y-4">
      {/* Header title */}
      <div className="flex items-center space-x-2 pb-3.5 border-b border-white/5">
        <Palette className="w-4 h-4 text-purple-400" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Workspace Aesthetics Skins</h4>
          <p className="text-[10px] font-mono text-zinc-500">Fine-tune background light & color filters</p>
        </div>
      </div>

      {/* Preset theme list cards */}
      <div className="space-y-2.5">
        {skins.map((skin) => (
          <div
            key={skin.id}
            onClick={() => onChangeTheme(skin.id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              activeTheme === skin.id
                ? 'bg-purple-500/10 border-purple-500 shadow-sm'
                : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
            }`}
          >
            <div className="space-y-1.5 truncate pr-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-zinc-200 text-[11px]">{skin.name}</span>
                {activeTheme === skin.id && (
                  <span className="text-[8px] bg-purple-500 text-white font-mono uppercase px-1 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed whitespace-normal">
                {skin.desc}
              </p>
              {/* Color dots preview */}
              <div className="flex items-center space-x-1 pt-1">
                {skin.colors.map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full border border-white/10 ${c}`} />
                ))}
              </div>
            </div>

            {activeTheme === skin.id && (
              <div className="p-1 rounded-full bg-purple-500 text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ThemeManager;
