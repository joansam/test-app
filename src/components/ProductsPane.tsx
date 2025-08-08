import { QUALITY_TIER_LABELS, computeQualityMultiplier } from '../constants';
import type { GameState } from '../types';

interface Props {
  state: GameState;
  priceCopper: number;
}

export default function ProductsPane({ state, priceCopper }: Props) {
  const ale = state.products.ale;
  const tierLabel = QUALITY_TIER_LABELS[ale.qualityTierIndex];
  const qualityMult = computeQualityMultiplier(ale.qualityTierIndex);
  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
      <strong>Products</strong>
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div><strong>Ale</strong> — {tierLabel}</div>
            <div style={{ fontSize: 12, color: '#aaa' }} title={`Price is base × quality × demand. Base=10, quality=${qualityMult.toFixed(3)}, demand=${state.demandIndex.toFixed(3)}`}>
              Price: {priceCopper} cp
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Sold today: {ale.soldToday}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>COGS today: {state.statsToday.purchasesCopper} cp</div>
          </div>
        </div>
      </div>
    </div>
  );
}


