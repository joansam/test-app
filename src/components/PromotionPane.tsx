import type { GameState } from '../types';
import { PROMOTION_ACCURACY_LEVEL_REQUIRED } from '../constants';

interface Props {
  state: GameState;
  canPromote: boolean;
  onPromote: () => void;
}

export default function PromotionPane({ state, canPromote, onPromote }: Props) {
  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
      <strong>Promotion</strong>
      <div style={{ marginTop: 8 }}>
        Accuracy level: {state.skills.accuracy.level} / {PROMOTION_ACCURACY_LEVEL_REQUIRED}
      </div>
      <button disabled={!canPromote} onClick={onPromote} style={{ marginTop: 8 }}>
        Promote to Tavern Manager
      </button>
      <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>Unlocks brewing (stub) and management UI.</div>
    </div>
  );
}


