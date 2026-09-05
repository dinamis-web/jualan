import { useState, useEffect, useCallback, useMemo } from 'react';
import { Closing } from '../../types/models';
import { closingRepository } from '../../services';

export function useClosings() {
  const [closings, setClosings] = useState<Closing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClosings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await closingRepository.getAll();
      setClosings(data);
    } catch (err) {
      console.error('Failed to load closings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClosings();
  }, [loadClosings]);

  const totalSales = useMemo(
    () => closings.reduce((sum, c) => sum + c.saleAmount, 0),
    [closings]
  );

  const totalProfit = useMemo(
    () => closings.reduce((sum, c) => sum + c.profitCommission, 0),
    [closings]
  );

  const addClosing = useCallback(async (newClosing: Omit<Closing, 'id'>) => {
    const created = await closingRepository.create(newClosing);
    setClosings((prev) => [created, ...prev]);
    return created;
  }, []);

  return {
    closings,
    totalSales,
    totalProfit,
    isLoading,
    addClosing,
    reload: loadClosings,
  };
}
