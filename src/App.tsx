'use client';

import { useState, useEffect } from 'react';
import {
  ActiveScreen,
  MainTab,
  TargetSettings,
  BusinessProfile,
  Prospect,
  ActionItem,
  ClosingRecord,
} from './types';
import { appStorage } from './lib/storage';
import { useProspects } from './features/prospects/useProspects';
import { useSalesTarget } from './features/targets/useSalesTarget';
import { useDailyActions } from './features/actions/useDailyActions';
import { useClosings } from './features/closings/useClosings';
import { useBusinessProfile } from './features/business/useBusinessProfile';
import { AppShell } from './components/layout/AppShell';
import { ScreenLanding } from './components/screens/ScreenLanding';
import { ScreenTargetSetup } from './components/screens/ScreenTargetSetup';
import { ScreenBusinessScan } from './components/screens/ScreenBusinessScan';
import { ScreenMoneyPlan } from './components/screens/ScreenMoneyPlan';
import { ScreenHome } from './components/screens/ScreenHome';
import { ScreenAction } from './components/screens/ScreenAction';
import { ScreenRadar } from './components/screens/ScreenRadar';
import { ScreenProspectDetail } from './components/screens/ScreenProspectDetail';
import { ScreenMoneyLeak } from './components/screens/ScreenMoneyLeak';
import { ScreenResultClosing } from './components/screens/ScreenResultClosing';
import { AddProspectModal } from './components/common/AddProspectModal';

export default function App() {
  const [mounted, setMounted] = useState(false);

  // Navigation State decoupled through appStorage
  const [currentScreen, setCurrentScreenState] = useState<ActiveScreen>('landing');
  const [activeTab, setActiveTabState] = useState<MainTab>('home');

  useEffect(() => {
    setMounted(true);
    const savedScreen = appStorage.getItem<ActiveScreen>('dinamis_screen');
    if (savedScreen) setCurrentScreenState(savedScreen);

    const savedTab = appStorage.getItem<MainTab>('dinamis_tab');
    if (savedTab) setActiveTabState(savedTab);
  }, []);

  const setCurrentScreen = (screen: ActiveScreen) => {
    setCurrentScreenState(screen);
    appStorage.setItem('dinamis_screen', screen);
  };

  const setActiveTab = (tab: MainTab) => {
    setActiveTabState(tab);
    appStorage.setItem('dinamis_tab', tab);
  };

  // Feature Hooks & Repository Layer
  const {
    target: targetSettings,
    progressPercentage: targetPercent,
    updateTarget,
    recordAchieved,
    reload: reloadTarget,
  } = useSalesTarget();

  const { profile: businessProfile, updateProfile } = useBusinessProfile();

  const {
    prospects,
    hotProspects,
    moneyLeaks,
    selectedProspect,
    setSelectedProspect,
    addProspect,
    updateProspect,
    addActivity,
    resolveLeak,
    resetToDemo,
  } = useProspects();

  const {
    actions,
    toggleAction,
    resetDaily: resetActions,
  } = useDailyActions();

  const {
    closings,
    addClosing,
  } = useClosings();

  // Sub-screen and Modal State
  const [prefillClosingProspect, setPrefillClosingProspect] = useState<Prospect | null>(null);
  const [isAddProspectOpen, setIsAddProspectOpen] = useState(false);

  // Handlers
  const handleResetDemo = async () => {
    await resetToDemo();
    await resetActions();
    await reloadTarget();
    setCurrentScreen('main');
    setActiveTab('home');
    setSelectedProspect(null);
  };

  const handleRestartJourney = () => {
    setCurrentScreen('landing');
  };

  const handleStartLanding = () => {
    setCurrentScreen('target-setup');
  };

  const handleQuickDemo = () => {
    setCurrentScreen('main');
    setActiveTab('home');
  };

  const handleTargetSaved = async (newTarget: TargetSettings) => {
    await updateTarget(newTarget);
    setCurrentScreen('business-scan');
  };

  const handleBusinessSaved = async (newProfile: BusinessProfile) => {
    await updateProfile(newProfile);
    setCurrentScreen('money-plan');
  };

  const handleStartFromPlan = () => {
    setCurrentScreen('main');
    setActiveTab('home');
  };

  const handleUpdateAction = async (updated: ActionItem) => {
    await toggleAction(updated.id);
  };

  const handleResetActions = async () => {
    await resetActions();
  };

  const handleAddProspect = async (newProspect: Prospect) => {
    await addProspect(newProspect);
  };

  const handleSelectProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setCurrentScreen('prospect-detail');
  };

  const handleFollowUpNow = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setCurrentScreen('prospect-detail');
  };

  const handleProspectStatusUpdate = async (
    prospectId: string,
    actionType: 'follow-up' | 'closing' | 'unsuccessful' | 'later'
  ) => {
    if (actionType === 'follow-up') {
      await updateProspect(prospectId, {
        lastActivity: 'Sudah di-follow-up hari ini',
        daysInactive: 0,
      });
      await addActivity(prospectId, {
        event: 'Follow-up berhasil dilakukan',
        timeAgo: 'Hari ini',
      });
    } else if (actionType === 'later') {
      await updateProspect(prospectId, {
        lastActivity: 'Dijadwalkan hubungi lagi nanti',
      });
      await addActivity(prospectId, {
        event: 'Dijadwalkan untuk dihubungi kembali nanti',
        timeAgo: 'Hari ini',
      });
    } else if (actionType === 'unsuccessful') {
      await updateProspect(prospectId, {
        priority: 'COLD',
        lastActivity: 'Belum berhasil closing',
      });
      await addActivity(prospectId, {
        event: 'Status: Belum berhasil saat ini',
        timeAgo: 'Hari ini',
      });
    }
  };

  const handleTriggerClosingFromProspect = (prospect: Prospect) => {
    setPrefillClosingProspect(prospect);
    setCurrentScreen('main');
    setActiveTab('result');
  };

  const handleResolveLeak = async (leakId: string) => {
    const rawId = leakId.replace('leak-', '');
    await resolveLeak(rawId);
  };

  const handleRecordClosing = async (recordData: Omit<ClosingRecord, 'id' | 'date'>) => {
    const profitAmount =
      recordData.profitCommission > 0
        ? recordData.profitCommission
        : recordData.saleAmount;

    await addClosing({
      customerName: recordData.customerName,
      saleAmount: recordData.saleAmount,
      profitCommission: profitAmount,
      source: recordData.source,
      date: 'Hari ini',
      prospectId: recordData.prospectId,
    });

    // Update target achieved amount and sync
    await recordAchieved(profitAmount);
    await reloadTarget();

    // If linked to a prospect, mark as closed
    if (recordData.prospectId) {
      await updateProspect(recordData.prospectId, {
        closed: true,
        lastActivity: 'Closing berhasil',
      });
    }

    setPrefillClosingProspect(null);
  };

  // Status Metrics
  const hotProspectsCount = hotProspects.length;
  const pendingActionsCount = actions.filter((a) => !a.isCompleted && a.completedCount < a.targetCount).length;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center font-extrabold text-black text-sm animate-pulse">
          D
        </div>
      </div>
    );
  }

  return (
    <AppShell
      currentScreen={currentScreen}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setCurrentScreen('main');
        setActiveTab(tab);
      }}
      onBack={() => {
        if (currentScreen === 'prospect-detail') {
          setCurrentScreen('main');
          setActiveTab('radar');
        } else if (currentScreen === 'money-leak') {
          setCurrentScreen('main');
          setActiveTab('home');
        }
      }}
      onResetDemo={handleResetDemo}
      onRestartJourney={handleRestartJourney}
      targetPercent={targetPercent}
      hotProspectsCount={hotProspectsCount}
      pendingActionsCount={pendingActionsCount}
    >
      {/* SCREEN 1: LANDING */}
      {currentScreen === 'landing' && (
        <ScreenLanding
          onStart={handleStartLanding}
          onQuickDemo={handleQuickDemo}
        />
      )}

      {/* SCREEN 2: TARGET SETUP */}
      {currentScreen === 'target-setup' && (
        <ScreenTargetSetup
          initialSettings={targetSettings}
          onSaveAndNext={handleTargetSaved}
          onBack={() => setCurrentScreen('landing')}
        />
      )}

      {/* SCREEN 3: BUSINESS SCAN */}
      {currentScreen === 'business-scan' && (
        <ScreenBusinessScan
          initialProfile={businessProfile}
          onSaveAndNext={handleBusinessSaved}
          onBack={() => setCurrentScreen('target-setup')}
        />
      )}

      {/* SCREEN 4: MONEY PLAN */}
      {currentScreen === 'money-plan' && (
        <ScreenMoneyPlan
          targetSettings={targetSettings}
          onStartActions={handleStartFromPlan}
        />
      )}

      {/* SCREEN 5 / MAIN TABS */}
      {currentScreen === 'main' && (
        <>
          {activeTab === 'home' && (
            <ScreenHome
              targetSettings={targetSettings}
              prospects={prospects}
              moneyLeaks={moneyLeaks}
              actions={actions}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenMoneyLeak={() => setCurrentScreen('money-leak')}
              onOpenTargetEdit={() => setCurrentScreen('target-setup')}
            />
          )}

          {activeTab === 'radar' && (
            <ScreenRadar
              prospects={prospects}
              onSelectProspect={handleSelectProspect}
              onOpenAddModal={() => setIsAddProspectOpen(true)}
              onFollowUpNow={handleFollowUpNow}
            />
          )}

          {activeTab === 'action' && (
            <ScreenAction
              actions={actions}
              onUpdateAction={handleUpdateAction}
              onResetActions={handleResetActions}
            />
          )}

          {activeTab === 'result' && (
            <ScreenResultClosing
              targetSettings={targetSettings}
              closingHistory={closings}
              onRecordClosing={handleRecordClosing}
              onGoToActions={() => setActiveTab('action')}
              prefillProspect={prefillClosingProspect}
            />
          )}
        </>
      )}

      {/* SCREEN 8: PROSPECT DETAIL */}
      {currentScreen === 'prospect-detail' && selectedProspect && (
        <ScreenProspectDetail
          prospect={selectedProspect}
          onBack={() => {
            setCurrentScreen('main');
            setActiveTab('radar');
          }}
          onUpdateStatus={handleProspectStatusUpdate}
          onTriggerClosing={handleTriggerClosingFromProspect}
        />
      )}

      {/* SCREEN 9: MONEY LEAK */}
      {currentScreen === 'money-leak' && (
        <ScreenMoneyLeak
          moneyLeaks={moneyLeaks}
          onResolveLeak={handleResolveLeak}
          onBack={() => {
            setCurrentScreen('main');
            setActiveTab('home');
          }}
          onResetLeaks={handleResetDemo}
        />
      )}

      {/* MODAL: ADD PROSPECT */}
      <AddProspectModal
        isOpen={isAddProspectOpen}
        onClose={() => setIsAddProspectOpen(false)}
        onAddProspect={handleAddProspect}
      />
    </AppShell>
  );
}
