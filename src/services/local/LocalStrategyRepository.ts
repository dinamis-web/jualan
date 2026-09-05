import { IStrategyRepository } from '../contracts/IStrategyRepository';
import { Strategy } from '../../types/models';

export class LocalStrategyRepository implements IStrategyRepository {
  private strategies: Strategy[] = [
    {
      id: 'strat-1',
      rank: 1,
      title: 'CUSTOMER LAMA',
      label: 'Prioritas utama',
      labelColor: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40',
      description: 'Mulai dari orang yang sudah mengenal layananmu.',
      iconKey: 'users',
      iconColor: 'text-[#10B981] bg-[#10B981]/15',
    },
    {
      id: 'strat-2',
      rank: 2,
      title: 'REFERRAL',
      label: 'Peluang tinggi',
      labelColor: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40',
      description: 'Minta rekomendasi dari customer yang puas.',
      iconKey: 'user-plus',
      iconColor: 'text-[#F59E0B] bg-[#F59E0B]/15',
    },
    {
      id: 'strat-3',
      rank: 3,
      title: 'FOLLOW-UP AKTIF',
      label: 'Tambah peluang',
      labelColor: 'bg-white/10 text-gray-300 border-white/20',
      description: 'Jangkau calon customer yang relevan dan sudah bertanya harga.',
      iconKey: 'message-circle',
      iconColor: 'text-white bg-white/10',
    },
    {
      id: 'strat-4',
      rank: 4,
      title: 'PROSPEK SEKITAR',
      label: 'Bangun permintaan',
      labelColor: 'bg-white/10 text-gray-300 border-white/20',
      description: 'Buat orang sekitar sadar layananmu tersedia.',
      iconKey: 'map-pin',
      iconColor: 'text-white bg-white/10',
    },
  ];

  async getStrategies(): Promise<Strategy[]> {
    return this.strategies;
  }
}
