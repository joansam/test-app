import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from './store';
import TimingMinigame from './components/TimingMinigame';
import StatsPane from './components/StatsPane';
import SkillsPane from './components/SkillsPane';
import StorePane from './components/StorePane';
import ProductsPane from './components/ProductsPane';
import PromotionPane from './components/PromotionPane';
import BrewingStub from './components/BrewingStub';
import { DAY_DURATION_MS, ORDER_TIMEOUT_MS } from './constants';

type Order = { id: number; expiresAt: number };

export default function App() {
  const store = useGameStore();
  const priceCopper = store.computeAlePriceCopper();

  // Poisson arrivals over the day
  const [orders, setOrders] = useState<Order[]>([]);
  const [activationNonce, setActivationNonce] = useState(0);
  const [nextExpiryPct, setNextExpiryPct] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const nextIdRef = useRef(1);

  // spawn orders using Poisson process with rate lambda = expected/day / dayDuration
  useEffect(() => {
    const lambdaPerMs = store.state.customersExpectedToday / DAY_DURATION_MS;
    const cutoffTime = store.state.dayStartMs + DAY_DURATION_MS;
    let raf = 0;
    let last = performance.now();
    let carry = 0;

    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      const closing = Date.now() >= cutoffTime;
      if (!closing && !isPaused) {
        // expected arrivals in dt
        carry += lambdaPerMs * dt;
        // spawn floor(carry) arrivals
        let arrivals = Math.floor(carry);
        if (arrivals > 0) {
          carry -= arrivals;
          setOrders((prev) => {
            const now = Date.now();
            // Speed skill increases patience (timeout) by +10% per level
            const patienceMult = Math.pow(1.1, store.state.skills.speed.level);
            const added: Order[] = Array.from({ length: arrivals }, () => ({ id: nextIdRef.current++, expiresAt: now + Math.round(ORDER_TIMEOUT_MS * patienceMult) }));
            // eslint-disable-next-line no-console
            console.log('[Orders] +', arrivals, 'active ->', prev.length + arrivals);
            if (prev.length === 0) setActivationNonce((n) => n + 1);
            return [...prev, ...added];
          });
        }
      }
      // expire orders
      setOrders((prev) => {
        const now = Date.now();
        const [active, expired] = partition(prev, (o) => o.expiresAt > now);
        // compute time to the next expiry (for clock/progress)
        if (active.length > 0) {
          const soonest = Math.min(...active.map((o) => o.expiresAt));
          const total = ORDER_TIMEOUT_MS;
          const remaining = Math.max(0, soonest - now);
          setNextExpiryPct(Math.round(((total - remaining) / total) * 100));
        } else {
          setNextExpiryPct(0);
        }
        if (expired.length) {
          // eslint-disable-next-line no-console
          console.log('[Orders] expired', expired.length);
          store.handleMissedOrder();
        }
        return active;
      });
      // keep ticking after cutoff to expire remaining customers; stop only when paused
      if (isPaused) return;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [store.state.dayStartMs, store.state.customersExpectedToday, isPaused]);

  // End of day handler
  useEffect(() => {
    if (store.dayProgress >= 1 && !isPaused) {
      // If customers are still active, wait until queue clears
      if (orders.length > 0) return;
      setIsPaused(true);
    }
  }, [store.dayProgress, isPaused, orders.length]);

  // Space to start next day
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.key === ' ') && isPaused) {
        e.preventDefault();
        store.endOfDay();
        setIsPaused(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPaused, store]);

  function onResolve(result: 'red' | 'yellow' | 'green') {
    if (orders.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[Pour] blocked: no active orders');
      return; // no active orders
    }
    // consume one order (front of queue)
    setOrders((prev) => prev.slice(1));
    // debug log
    // eslint-disable-next-line no-console
    console.log('[Pour]', {
      result,
      servedSoFar: store.state.statsToday.served,
      priceCopper,
      demandIndex: store.state.demandIndex,
      reputation: store.state.reputation,
      zones: store.getZones(),
      activeOrdersBefore: orders.length,
    });
    store.handleServe(result);
  }

  function partition<T>(arr: T[], pred: (t: T) => boolean): [T[], T[]] {
    const a: T[] = [], b: T[] = [];
    for (const it of arr) (pred(it) ? a : b).push(it);
    return [a, b];
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h2>Bartender Prototype</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <StatsPane state={store.state} dayProgress={store.dayProgress} dayRemainingMs={store.dayRemainingMs} priceCopper={priceCopper} />
          <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Orders Queue</strong>
              <div title={`Orders expire after ${ORDER_TIMEOUT_MS / 1000}s`} style={{ fontSize: 12, color: '#aaa' }}>
                Active: {orders.length}
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ '--timeout-pct': `${nextExpiryPct}%`, opacity: isPaused ? 0.4 : 1 } as React.CSSProperties}>
                <TimingMinigame
                  zones={store.getZones()}
                  onResolve={onResolve}
                  active={orders.length > 0 && !isPaused}
                  activationNonce={activationNonce}
                  activeCount={orders.length}
                  patienceMultiplier={Math.pow(1.1, store.state.skills.speed.level)}
                />
              </div>
              {isPaused && (
                <div style={{ marginTop: 12, padding: 8, border: '1px dashed #555', borderRadius: 6, textAlign: 'center' }}>
                  Day {store.state.dayNumber} complete. Press Space to start the next day.
                </div>
              )}
            </div>
          </div>
          <ProductsPane state={store.state} priceCopper={priceCopper} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <SkillsPane state={store.state} />
          <StorePane state={store.state} setState={store.setState} />
          <PromotionPane
            state={store.state}
            canPromote={store.canPromote}
            onPromote={() => store.setState((s) => ({ ...s, brewing: { ...s.brewing, unlocked: true } }))}
          />
          {store.state.brewing.unlocked && <BrewingStub state={store.state} setState={store.setState} />}
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={store.save}>Save</button>
        <button onClick={store.resetSave}>Reset Save</button>
      </div>
    </div>
  );
}

