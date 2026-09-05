import React from 'react';
import { MainTab } from '../../types';
import { Home, Radio, Flame, Trophy } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  hotProspectsCount: number;
  pendingActionsCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  hotProspectsCount,
  pendingActionsCount,
}) => {
  const tabs = [
    {
      id: 'home' as MainTab,
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'radar' as MainTab,
      label: 'Radar',
      icon: Radio,
      badge: hotProspectsCount > 0 ? `${hotProspectsCount}` : null,
      badgeColor: 'bg-[#10B981] text-black',
    },
    {
      id: 'action' as MainTab,
      label: 'Action',
      icon: Flame,
      badge: pendingActionsCount > 0 ? `${pendingActionsCount}` : null,
      badgeColor: 'bg-[#F59E0B] text-black',
    },
    {
      id: 'result' as MainTab,
      label: 'Result',
      icon: Trophy,
      badge: null,
    },
  ];

  return (
    <nav
      id="bottom-navigation"
      className="sticky bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#10B981] font-bold'
                  : 'text-gray-500 hover:text-gray-300 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-mono font-black rounded-full ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#10B981] mt-0.5 shadow-[0_0_6px_#10B981]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
