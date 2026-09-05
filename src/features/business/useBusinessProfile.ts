import { useState, useEffect, useCallback } from 'react';
import { Business } from '../../types/models';
import { businessRepository } from '../../services';

export function useBusinessProfile() {
  const [profile, setProfile] = useState<Business>({
    id: 'biz-01',
    userId: 'demo-user-01',
    productOrService: 'Jasa cuci AC',
    avgSalePrice: 100000,
    buyerPersona: ['Rumah tangga', 'Perusahaan'],
    salesChannels: ['WhatsApp', 'Customer lama', 'Referral'],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await businessRepository.getProfile();
      if (data) setProfile(data);
    } catch (err) {
      console.error('Failed to load business profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async (updates: Partial<Business>) => {
    const updated = await businessRepository.saveProfile({
      ...profile,
      ...updates,
    });
    setProfile(updated);
    return updated;
  }, [profile]);

  return {
    profile,
    isLoading,
    updateProfile,
    reload: loadProfile,
  };
}
