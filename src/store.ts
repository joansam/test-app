import { useEffect, useState } from 'react';
import type { GameState, SkillKey, ZoneResult } from './types';
import {
  ACCURACY_GREEN_WIDTH_DELTA_PER_LEVEL,
  ACCURACY_RED_WIDTH_DELTA_PER_LEVEL,
  ACCURACY_GREEN_XP,
  ACCURACY_YELLOW_XP,
  ACCURACY_RED_XP,
  // AUTOSAVE_ON_DAY_END,
  BASE_ALE_PRICE_COPPER,
  BASE_ALE_COST_COPPER,
  BASELINE_DEMAND_GROWTH_PER_DAY,
  DEMAND_SATURATION_DECREASE_PER_SALE,
  INITIAL_CUSTOMERS_PER_DAY,
  MAX_DAILY_MARKET_FRACTION,
  MAX_TOWN_POPULATION,
  // ORDER_TIMEOUT_MS,
  PROMOTION_ACCURACY_LEVEL_REQUIRED,
  // QUALITY_TIER_LABELS,
  REPUTATION_GROWTH_PER_CUSTOMER,
  TIP_MULTIPLIER_GREEN,
  TIP_MULTIPLIER_RED,
  TIP_MULTIPLIER_YELLOW,
  // CUSTOMER_SERVICE_TIP_BONUS_PER_LEVEL,
  // REPUTATION_TIP_BONUS_PER_POINT,
  WAGE_BASE_COPPER,
  WAGE_BASE_THRESHOLD_ORDERS,
  WAGE_PER_EXTRA_ORDER_COPPER,
  DAY_DURATION_MS,
  TRADING_DISCOUNT_PER_LEVEL,
  computeQualityMultiplier,
} from './constants';

// const STORAGE_KEY = 'tavern_mvp_save_v1';

function defaultGameState(now: number): GameState {
  return {
    dayNumber: 1,
    dayStartMs: now,
    cashCopper: 50,
    reputation: 0,
    customersExpectedToday: INITIAL_CUSTOMERS_PER_DAY,
    demandIndex: 1.0,
    products: {
      ale: {
        name: 'Ale',
        qualityTierIndex: 1, // plain
        soldToday: 0,
      },
    },
    skills: {
      accuracy: { level: 0, xp: 0, unlocked: true },
      customerService: { level: 0, xp: 0, unlocked: true },
      speed: { level: 0, xp: 0, unlocked: false },
      trading: { level: 0, xp: 0, unlocked: false },
    },
    books: { speed: false, trading: false },
    brewing: { unlocked: false, inProgress: false, readyAtMs: null, storageUsed: 0 },
    statsToday: { served: 0, missed: 0, tipsCopper: 0, wageCopper: 0, revenueCopper: 0, purchasesCopper: 0 },
  };
}

function load(): GameState | null {
  // Persistence disabled for now
  return null;
}

export function useGameStore() {
  const [state, setState] = useState<GameState>(() => load() ?? defaultGameState(Date.now()));
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Tick timer for UI updates
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  // Derived helpers
  const dayElapsedMs = Math.max(0, nowMs - state.dayStartMs);
  const dayProgress = Math.min(1, dayElapsedMs / DAY_DURATION_MS);
  const dayRemainingMs = Math.max(0, DAY_DURATION_MS - dayElapsedMs);

  function save() {
    // no-op while persistence is disabled
  }

  // Skill XP curve
  function xpToNextLevel(level: number): number {
    const base = 20;
    const growth = 1.2;
    return Math.round(base * Math.pow(growth, level));
  }

  function grantSkillXp(key: SkillKey, amount: number) {
    setState((s) => {
      const current = s.skills[key];
      if (!current.unlocked || amount <= 0) return s;
      let xp = current.xp + amount;
      let level = current.level;
      let needed = xpToNextLevel(level);
      while (xp >= needed && level < 10) {
        xp -= needed;
        level += 1;
        needed = xpToNextLevel(level);
      }
      return { ...s, skills: { ...s.skills, [key]: { ...current, xp, level } } };
    });
  }

  // Pricing and tips
  function computeAlePriceCopper(): number {
    const tierIndex = state.products.ale.qualityTierIndex;
    const qualityMult = computeQualityMultiplier(tierIndex);
    const demand = state.demandIndex;
    return Math.round(BASE_ALE_PRICE_COPPER * qualityMult * demand);
  }

  function computeTipMultiplier(): number {
    const cs = state.skills.customerService.level;
    const repBonus = 1 + state.reputation * 0.001;
    return Math.pow(1 + 0.02, cs) * repBonus;
  }

  function computeAleCostCopper(): number {
    const tradingLevel = state.skills.trading.level;
    const discount = Math.pow(1 - TRADING_DISCOUNT_PER_LEVEL, tradingLevel);
    return Math.max(0, Math.round(BASE_ALE_COST_COPPER * discount));
  }

  function handleServe(result: ZoneResult) {
    const basePrice = computeAlePriceCopper();
    let tipBaseMult = 0;
    if (result === 'green') tipBaseMult = TIP_MULTIPLIER_GREEN;
    else if (result === 'yellow') tipBaseMult = TIP_MULTIPLIER_YELLOW;
    else tipBaseMult = TIP_MULTIPLIER_RED;

    const rawTip = Math.round(basePrice * tipBaseMult * computeTipMultiplier());
    const tip = randomizeTipCopper(rawTip, tipBaseMult > 0);
    const revenue = basePrice; // selling one ale
    const cogs = computeAleCostCopper();

    setState((s) => ({
      ...s,
      cashCopper: s.cashCopper + revenue + tip - cogs,
      statsToday: {
        ...s.statsToday,
        served: s.statsToday.served + 1,
        tipsCopper: s.statsToday.tipsCopper + tip,
        revenueCopper: s.statsToday.revenueCopper + revenue,
        purchasesCopper: s.statsToday.purchasesCopper + cogs,
      },
      products: {
        ...s.products,
        ale: { ...s.products.ale, soldToday: s.products.ale.soldToday + 1 },
      },
      // demand saturation
      demandIndex: Math.max(0.5, s.demandIndex * (1 - DEMAND_SATURATION_DECREASE_PER_SALE)),
      // reputation growth
      reputation: s.reputation + REPUTATION_GROWTH_PER_CUSTOMER,
    }));

    // Skill XP
    if (result === 'green') grantSkillXp('accuracy', ACCURACY_GREEN_XP);
    if (result === 'yellow') grantSkillXp('accuracy', ACCURACY_YELLOW_XP);
    if (result === 'red') grantSkillXp('accuracy', ACCURACY_RED_XP);
    grantSkillXp('customerService', 1);
  }

  function handleMissedOrder() {
    setState((s) => ({
      ...s,
      statsToday: { ...s.statsToday, missed: s.statsToday.missed + 1 },
    }));
  }

  function endOfDay() {
    // wage
    setState((s) => {
      const served = s.statsToday.served;
      let wage = 0;
      if (served >= WAGE_BASE_THRESHOLD_ORDERS) {
        wage = WAGE_BASE_COPPER + Math.max(0, served - WAGE_BASE_THRESHOLD_ORDERS) * WAGE_PER_EXTRA_ORDER_COPPER;
      }

      // next day expected customers
      const baselineGrowth = 1 + BASELINE_DEMAND_GROWTH_PER_DAY;
      const repGrowth = 1 + s.reputation;
      const nextExpected = s.customersExpectedToday * baselineGrowth * repGrowth;
      const maxDaily = MAX_TOWN_POPULATION * MAX_DAILY_MARKET_FRACTION;

      const next: GameState = {
        ...s,
        cashCopper: s.cashCopper + wage,
        statsToday: { ...s.statsToday, wageCopper: wage },
      };

      const resetForNext: GameState = {
        ...next,
        dayNumber: s.dayNumber + 1,
        dayStartMs: Date.now(),
        customersExpectedToday: Math.min(nextExpected, maxDaily),
        demandIndex: s.demandIndex * (1 + BASELINE_DEMAND_GROWTH_PER_DAY),
        products: {
          ...s.products,
          ale: { ...s.products.ale, soldToday: 0 },
        },
        statsToday: { served: 0, missed: 0, tipsCopper: 0, wageCopper: 0, revenueCopper: 0, purchasesCopper: 0 },
      };

      // Persistence disabled
      return resetForNext;
    });
  }

  function resetSave() {
    const fresh = defaultGameState(Date.now());
    setState(fresh);
  }

  // Minigame zone computation with accuracy level
  function getZones() {
    const acc = state.skills.accuracy.level;
    // Start with requested proportions: red 60%, yellow 30%, green 10%, but keep green centered
    let green = 0.1 + ACCURACY_GREEN_WIDTH_DELTA_PER_LEVEL * acc;
    green = Math.min(0.7, Math.max(0.05, green));
    let remaining = 1 - green;
    // Allocate remaining between red and yellow with ratio 60:30 (2:1)
    let red = (2 / 3) * remaining;
    let yellow = remaining - red;
    // Accuracy can also shrink red slightly per level
    red = Math.max(0.05, red + ACCURACY_RED_WIDTH_DELTA_PER_LEVEL * acc);
    yellow = Math.max(0.05, 1 - red - green);
    return { red, yellow, green };
  }

  // Promotion flag
  const canPromote = state.skills.accuracy.level >= PROMOTION_ACCURACY_LEVEL_REQUIRED;

  return {
    state,
    setState,
    nowMs,
    dayProgress,
    dayRemainingMs,
    save,
    resetSave,
    computeAlePriceCopper,
    computeAleCostCopper,
    handleServe,
    handleMissedOrder,
    endOfDay,
    getZones,
    canPromote,
  } as const;
}

// --- Random tip helpers ---
function samplePoisson(lambda: number): number {
  // Knuth's algorithm
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function sampleSkellam(lambda: number): number {
  // Difference of two independent Poisson(lambda)
  const a = samplePoisson(lambda);
  const b = samplePoisson(lambda);
  return a - b;
}

function randomizeTipCopper(baseTip: number, hasBaseTip: boolean): number {
  if (baseTip <= 0) return 0;
  // Skellam(λ=1) mostly in [-3,3]; map each step to 10% for max ±30%
  const diff = sampleSkellam(1);
  const clamped = Math.max(-3, Math.min(3, diff));
  const factor = 1 + clamped * 0.1;
  const randomized = Math.round(baseTip * factor);
  const floored = Math.max(hasBaseTip ? 1 : 0, randomized);
  return floored;
}


