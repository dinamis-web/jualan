import { useState, useEffect, useCallback, useMemo } from 'react';
import { SalesTarget } from '../../types/models';
import { salesTargetRepository } from '../../services';

export function useSalesTarget() {
  const [target, setTarget] = useState<SalesTarget>({
    id: 'target-01',
    userId: 'demo-user-01',
    monthName: 'September',
    targetAmount: 5000000,
    achievedAmount: 1500000,
    avgCommission: 100000,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadTarget = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await salesTargetRepository.getTarget();
      if (data) setTarget(data);
    } catch (err) {
      console.error('Failed to load target:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTarget();
  }, [loadTarget]);

  const gap = useMemo(() => {
    return Math.max(target.targetAmount - target.achievedAmount, 0);
  }, [target.targetAmount, target.achievedAmount]);

  const progressPercentage = useMemo(() => {
    if (target.targetAmount <= 0) return 0;
    return Math.min(Math.round((target.achievedAmount / target.targetAmount) * 100), 100);
  }, [target.targetAmount, target.achievedAmount]);

  const requiredDeals = useMemo(() => {
    const unit = target.avgCommission || 100000;
    return Math.max(Math.ceil(gap / unit), 0);
  }, [gap, target.avgCommission]);

  const updateTarget = useCallback(async (newTarget: Partial<SalesTarget>) => {
    const updated = await salesTargetRepository.saveTarget({
      ...target,
      ...newTarget,
    });
    setTarget(updated);
    return updated;
  }, [target]);

  const recordAchieved = useCallback(async (profitAmount: number) => {
    const updated = await salesTargetRepository.updateAchieved(profitAmount);
    setTarget(updated);
    return updated;
  }, []);

  return {
    target,
    gap,
    progressPercentage,
    requiredDeals,
    isLoading,
    updateTarget,
    recordAchieved,
    reload: loadTarget,
  };
}
