import React, { useState } from 'react';
import { ActiveScreen, MainTab } from '../../types';
import { TopHeader } from './TopHeader';
import { BottomNavigation } from './BottomNavigation';
import { Smartphone, Monitor } from 'lucide-react';

interface AppShellProps {
  currentScreen: ActiveScreen;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onBack?: () => void;
  onResetDemo: () => void;
  onRestartJourney: () => void;
  targetPercent: number;
  hotProspectsCount: number;
  pendingActionsCount: number;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScreen,
  activeTab,
  onTabChange,
  onBack,
  onResetDemo,
  onRestartJourney,
  targetPercent,
  hotProspectsCount,
  pendingActionsCount,
  children,
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  // Show bottom nav only when inside main workspace tabs or prospect detail/money leak
  const showBottomNav =
    currentScreen === 'main' ||
    currentScreen === 'money-leak' ||
    currentScreen === 'prospect-detail';

  const showTopHeader =
    currentScreen !== 'landing';

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-start antialiased font-sans relative">
      {/* Desktop view switcher banner (only visible on large screens) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-4xl px-4 py-2 text-xs text-gray-400 border-b border-white/10 bg-[#121212]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">DINAMIS MONEY</span>
          <span className="text-gray-600">|</span>
          <span className="font-mono text-[11px]">Pratinjau Mobile-First (Optimasi 390px)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors font-mono text-xs"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Beralih Mode Layar Lebar</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Beralih Bingkai HP 390px</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container: phone frame or responsive wrapper */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-[#121212] min-h-screen ${
          deviceFrameMode
            ? 'max-w-[430px] sm:my-4 sm:min-h-[860px] sm:max-h-[920px] sm:rounded-[40px] sm:border-[8px] sm:border-[#262626] sm:shadow-[0_0_50px_rgba(0,0,0,0.9)] sm:overflow-y-auto sm:relative'
            : 'max-w-2xl'
        }`}
      >
        {/* Top Header */}
        {showTopHeader && (
          <TopHeader
            currentScreen={currentScreen}
            onBack={onBack}
            onResetDemo={onResetDemo}
            onRestartJourney={onRestartJourney}
            targetPercent={targetPercent}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden flex flex-col">
          {children}
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={onTabChange}
            hotProspectsCount={hotProspectsCount}
            pendingActionsCount={pendingActionsCount}
          />
        )}
      </div>
    </div>
  );
};
