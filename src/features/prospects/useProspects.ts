import { useState, useEffect, useCallback, useMemo } from 'react';
import { Prospect, PriorityTier, ProspectStatus, ProspectActivity } from '../../types/models';
import { prospectRepository } from '../../services';

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [filterPriority, setFilterPriority] = useState<PriorityTier | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProspects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await prospectRepository.getAll();
      setProspects(data);
    } catch (err) {
      console.error('Failed to load prospects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProspects();
  }, [loadProspects]);

  // Derived collections
  const hotProspects = useMemo(
    () => prospects.filter((p) => p.priority === 'HOT' && !p.closed),
    [prospects]
  );

  const warmProspects = useMemo(
    () => prospects.filter((p) => p.priority === 'WARM' && !p.closed),
    [prospects]
  );

  const coldProspects = useMemo(
    () => prospects.filter((p) => p.priority === 'COLD' && !p.closed),
    [prospects]
  );

  const hotPotentialTotal = useMemo(
    () => hotProspects.reduce((sum, p) => sum + p.potential, 0),
    [hotProspects]
  );

  const moneyLeaks = useMemo(() => {
    return prospects
      .filter((p) => !p.closed && (p.isMoneyLeak || p.daysInactive >= 5 || p.status === 'Minta penawaran' || p.status === 'Minta dihubungi lagi'))
      .map((p) => ({
        id: 'leak-' + p.id,
        name: p.name.toUpperCase(),
        potential: p.potential,
        reason: p.leakReason || (p.daysInactive >= 5 ? `Tidak ada follow-up ${p.daysInactive} hari` : `Status: ${p.status}`),
        ctaText: p.status === 'Minta penawaran' ? 'FOLLOW-UP' : 'HUBUNGI',
        prospectId: p.id,
        resolved: Boolean(p.resolved),
      }));
  }, [prospects]);

  const totalLeakPotential = useMemo(() => {
    return moneyLeaks
      .filter((leak) => !leak.resolved)
      .reduce((sum, leak) => sum + leak.potential, 0);
  }, [moneyLeaks]);

  const activeLeaksCount = useMemo(() => {
    return moneyLeaks.filter((l) => !l.resolved).length;
  }, [moneyLeaks]);

  // Filtered list for Radar Screen
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      if (p.closed) return false;
      const matchesPriority = filterPriority === 'ALL' || p.priority === filterPriority;
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPriority && matchesSearch;
    });
  }, [prospects, filterPriority, searchQuery]);

  const addProspect = useCallback(
    async (newP: {
      name: string;
      potential: number;
      status: ProspectStatus;
      priority: PriorityTier;
      phone?: string;
      notes?: string;
      nextRecommendation?: string;
    }) => {
      const created = await prospectRepository.create(newP);
      setProspects((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateProspect = useCallback(async (id: string, updates: Partial<Prospect>) => {
    const updated = await prospectRepository.update(id, updates);
    setProspects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    if (selectedProspect?.id === id) {
      setSelectedProspect(updated);
    }
    return updated;
  }, [selectedProspect]);

  const addActivity = useCallback(
    async (prospectId: string, activity: { event: string; timeAgo?: string }) => {
      const act = await prospectRepository.addActivity(prospectId, activity);
      setProspects((prev) =>
        prev.map((p) => {
          if (p.id === prospectId) {
            return {
              ...p,
              lastActivity: activity.event,
              timeline: [act, ...(p.timeline || [])],
            };
          }
          return p;
        })
      );
      return act;
    },
    []
  );

  const resolveLeak = useCallback(async (prospectId: string) => {
    await prospectRepository.resolveLeak(prospectId);
    setProspects((prev) =>
      prev.map((p) => (p.id === prospectId ? { ...p, resolved: true, isMoneyLeak: false } : p))
    );
  }, []);

  const markClosing = useCallback(
    async (prospectId: string, customerName: string, amount: number, profit: number) => {
      await prospectRepository.markClosing(prospectId, customerName, amount, profit);
      setProspects((prev) =>
        prev.map((p) => (p.id === prospectId ? { ...p, closed: true } : p))
      );
    },
    []
  );

  const selectProspectById = useCallback(
    (id: string) => {
      const found = prospects.find((p) => p.id === id) || null;
      setSelectedProspect(found);
      return found;
    },
    [prospects]
  );

  const resetToDemo = useCallback(async () => {
    await prospectRepository.resetToDemo();
    await loadProspects();
  }, [loadProspects]);

  return {
    prospects,
    filteredProspects,
    hotProspects,
    warmProspects,
    coldProspects,
    hotPotentialTotal,
    moneyLeaks,
    totalLeakPotential,
    activeLeaksCount,
    selectedProspect,
    setSelectedProspect,
    selectProspectById,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    isLoading,
    addProspect,
    updateProspect,
    addActivity,
    resolveLeak,
    markClosing,
    resetToDemo,
    reload: loadProspects,
  };
}
