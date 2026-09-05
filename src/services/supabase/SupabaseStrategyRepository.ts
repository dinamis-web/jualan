import { IStrategyRepository } from '../contracts/IStrategyRepository';
import { Strategy } from '../../types/models';
import { LocalStrategyRepository } from '../local/LocalStrategyRepository';

export class SupabaseStrategyRepository implements IStrategyRepository {
  private fallback = new LocalStrategyRepository();

  async getStrategies(): Promise<Strategy[]> {
    try {
      const res = await fetch('/api/strategies');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            rank: d.rank,
            title: d.title,
            label: d.label,
            labelColor: d.labelColor || d.label_color,
            description: d.description,
            iconKey: d.iconKey || d.icon_key,
            iconColor: d.iconColor || d.icon_color,
          }));
        }
      }
    } catch (err) {
      console.warn('[SupabaseStrategyRepository] getStrategies error:', err);
    }
    return this.fallback.getStrategies();
  }
}
