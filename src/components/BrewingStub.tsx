import { useEffect } from 'react';
import { BARREL_STORAGE_UNITS, BREW_TIME_MS, BREW_WASTE_FLOOR_FRACTION, BREW_WASTE_START_FRACTION, BREW_YIELD_PINTS, STORAGE_CAPACITY_UNITS } from '../constants';
import type { GameState } from '../types';

interface Props {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
}

export default function BrewingStub({ state, setState }: Props) {
  const inProgress = state.brewing.inProgress;
  const readyAt = state.brewing.readyAtMs;

  useEffect(() => {
    if (!inProgress || !readyAt) return;
    const id = setInterval(() => {
      if (Date.now() >= readyAt) {
        setState((s) => ({
          ...s,
          brewing: { ...s.brewing, inProgress: false, readyAtMs: null },
          // in a fuller build, we would add brewed items to inventory
        }));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [inProgress, readyAt, setState]);

  function startBrew() {
    if (inProgress) return;
    setState((s) => ({
      ...s,
      brewing: { ...s.brewing, inProgress: true, readyAtMs: Date.now() + BREW_TIME_MS },
    }));
  }

  const remainingSec = readyAt ? Math.max(0, Math.ceil((readyAt - Date.now()) / 1000)) : 0;

  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
      <strong>Brewing (Stub)</strong>
      <div style={{ marginTop: 8 }}>Storage used: {state.brewing.storageUsed} / {STORAGE_CAPACITY_UNITS} units</div>
      <div style={{ marginTop: 4 }}>Barrels occupy {BARREL_STORAGE_UNITS} units. Ingredients occupy 1 unit each.</div>
      <div style={{ marginTop: 4 }}>Waste: starts {Math.round(BREW_WASTE_START_FRACTION * 100)}%, floors at {Math.round(BREW_WASTE_FLOOR_FRACTION * 100)}%.</div>
      {inProgress ? (
        <div style={{ marginTop: 8 }}>Brewing... ready in {remainingSec}s. Yield {BREW_YIELD_PINTS} pints.</div>
      ) : (
        <button onClick={startBrew} style={{ marginTop: 8 }}>Start Brew (1 day)</button>
      )}
    </div>
  );
}


