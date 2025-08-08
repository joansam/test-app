import { useEffect, useMemo, useRef, useState } from 'react';
import type { ZoneResult } from '../types';

interface Props {
  zones: { red: number; yellow: number; green: number };
  onResolve: (result: ZoneResult) => void;
  active: boolean; // whether at least one customer is present
  activationNonce: number; // increments when first customer arrives after idle
  activeCount: number; // number of active customers to display prominently
  patienceMultiplier?: number; // visual indicator only
  easing?: 'linear' | 'easeInOut';
}

export default function TimingMinigame({ zones, onResolve, active, activationNonce, activeCount, easing = 'easeInOut' }: Props) {
  const [position, setPosition] = useState(0); // 0..1 across the bar
  const posRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);

  // Slight randomization of speed per render
  const baseSpeed = useMemo(() => 0.6 + Math.random() * 0.5, []); // fraction per second

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      let next = posRef.current;
      if (active) {
        next = posRef.current + baseSpeed * dt * dirRef.current;
      }
      if (next > 1) {
        next = 1 - (next - 1);
        dirRef.current = -1;
      } else if (next < 0) {
        next = -next;
        dirRef.current = 1;
      }
      posRef.current = next;
      setPosition(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseSpeed, active]);

  // When the first customer arrives after idle, jump to a random position and random direction
  useEffect(() => {
    if (!active) return;
    const p = Math.random();
    posRef.current = p;
    setPosition(p);
    dirRef.current = Math.random() < 0.5 ? -1 : 1;
    // eslint-disable-next-line no-console
    console.log('[TimingMinigame] activated -> pos', p.toFixed(2));
  }, [activationNonce, active]);

  function resolveClick() {
    // eslint-disable-next-line no-console
    console.log('[TimingMinigame] click', { position: posRef.current, zones });
    const rSide = zones.red / 2;
    const ySide = zones.yellow / 2;
    const g = zones.green;
    // Symmetric boundaries
    const greenStart = rSide + ySide;
    const greenEnd = greenStart + g;
    let result: ZoneResult = 'yellow';
    if (position < rSide) result = 'red';
    else if (position > 1 - rSide) result = 'red';
    else if (position >= greenStart && position <= greenEnd) result = 'green';
    else result = 'yellow';
    onResolve(result);
  }

  // Spacebar to pour when active
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (active) {
          e.preventDefault();
          resolveClick();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  function handlePress(e?: React.SyntheticEvent) {
    if (e) e.preventDefault();
    resolveClick();
  }

  return (
    <div style={{ width: '100%', padding: '12px 0' }}>
      <div
        onMouseDown={handlePress}
        onTouchStart={handlePress}
        style={{ position: 'relative', width: '100%', height: 24, background: '#222', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', userSelect: 'none' }}
      >
        {(() => {
          const rSide = zones.red / 2;
          const ySide = zones.yellow / 2;
          const g = zones.green;
          const leftRedW = rSide * 100;
          const leftYellowW = ySide * 100;
          const greenW = g * 100;
          const rightYellowW = ySide * 100;
          const rightRedW = rSide * 100;
          const leftRedL = 0;
          const leftYellowL = leftRedW;
          const greenL = leftRedW + leftYellowW;
          const rightYellowL = greenL + greenW;
          const rightRedL = rightYellowL + rightYellowW;
          return (
            <>
              <div style={{ position: 'absolute', left: `${leftRedL}%`, top: 0, bottom: 0, width: `${leftRedW}%`, background: '#ac2b2b' }} />
              <div style={{ position: 'absolute', left: `${leftYellowL}%`, top: 0, bottom: 0, width: `${leftYellowW}%`, background: '#caa232' }} />
              <div style={{ position: 'absolute', left: `${greenL}%`, top: 0, bottom: 0, width: `${greenW}%`, background: '#2b9c4a' }} />
              <div style={{ position: 'absolute', left: `${rightYellowL}%`, top: 0, bottom: 0, width: `${rightYellowW}%`, background: '#caa232' }} />
              <div style={{ position: 'absolute', left: `${rightRedL}%`, top: 0, bottom: 0, width: `${rightRedW}%`, background: '#ac2b2b' }} />
            </>
          );
        })()}

        <div
          role="button"
          style={{
            position: 'absolute',
            top: -6,
            bottom: -6,
            left: `${position * 100}%`,
            width: 2,
            background: 'white',
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            pointerEvents: 'none',
          }}
        />
        {/* customer timeout bar at bottom */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: '#111' }}>
          {/* Filled by parent via CSS variable if provided */}
          <div style={{ width: 'var(--timeout-pct, 0%)', height: '100%', background: '#ff9d2d', transition: 'width 100ms linear' }} />
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>Click anywhere on the bar to pour.</div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600 }}>
        Active customers: {activeCount}
      </div>
      <div style={{ marginTop: 4, fontSize: 11, color: '#aaa' }}>
        Zones: Red {(zones.red * 100).toFixed(0)}% • Yellow {(zones.yellow * 100).toFixed(0)}% • Green {(zones.green * 100).toFixed(0)}%
      </div>
      {typeof patienceMultiplier === 'number' && (
        <div style={{ marginTop: 2, fontSize: 11, color: '#aaa' }}>Patience × {patienceMultiplier.toFixed(2)}</div>
      )}
    </div>
  );
}


