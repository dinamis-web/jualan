import { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyAction } from '../../types/models';
import { dailyActionRepository } from '../../services';

export function useDailyActions() {
  const [actions, setActions] = useState<DailyAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<DailyAction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadActions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dailyActionRepository.getAll();
      setActions(data);
    } catch (err) {
      console.error('Failed to load actions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const completedCount = useMemo(
    () => actions.filter((a) => a.isCompleted).length,
    [actions]
  );

  const totalCount = actions.length;

  const progressPercentage = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const incrementAction = useCallback(async (actionId: string) => {
    const updated = await dailyActionRepository.increment(actionId);
    setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
    if (selectedAction?.id === actionId) {
      setSelectedAction(updated);
    }
    return updated;
  }, [selectedAction]);

  const toggleAction = useCallback(async (actionId: string) => {
    const updated = await dailyActionRepository.toggleCompleted(actionId);
    setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
    if (selectedAction?.id === actionId) {
      setSelectedAction(updated);
    }
    return updated;
  }, [selectedAction]);

  const resetDaily = useCallback(async () => {
    const fresh = await dailyActionRepository.resetDaily();
    setActions(fresh);
    return fresh;
  }, []);

  return {
    actions,
    completedCount,
    totalCount,
    progressPercentage,
    selectedAction,
    setSelectedAction,
    isLoading,
    incrementAction,
    toggleAction,
    resetDaily,
    reload: loadActions,
  };
}
