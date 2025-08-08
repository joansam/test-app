import { QUALITY_TIER_LABELS } from '../constants';
import type { GameState } from '../types';

interface Props {
  state: GameState;
  dayProgress: number;
  dayRemainingMs: number;
  priceCopper: number;
}

export default function StatsPane({ state, dayProgress, dayRemainingMs, priceCopper }: Props) {
  const timeLeftSec = Math.ceil(dayRemainingMs / 1000);
  const percent = Math.floor(dayProgress * 100);
  const aleTier = state.products.ale.qualityTierIndex;
  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Day {state.dayNumber}</strong>
        <div style={{ width: '100%', height: 8, background: '#222', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
          <div style={{ width: `${percent}%`, height: '100%', background: '#5a76ff' }} />
        </div>
        <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{percent}% elapsed • {timeLeftSec}s left</div>
      </div>
      <div>Cash: {state.cashCopper} cp</div>
      <div>Customers today (expected): {state.customersExpectedToday.toFixed(1)}</div>
      <div>Reputation: {(state.reputation * 100).toFixed(2)}%</div>
      <div>Demand Index: {state.demandIndex.toFixed(3)}</div>
      <div style={{ marginTop: 8 }}>
        <strong>Today</strong>: Served {state.statsToday.served}, Missed {state.statsToday.missed}, Tips {state.statsToday.tipsCopper} cp
      </div>
      <div style={{ marginTop: 8 }}>
        <strong>Ale</strong>: Price {priceCopper} cp • Quality {QUALITY_TIER_LABELS[aleTier]} (tier {aleTier})
      </div>
    </div>
  );
}


