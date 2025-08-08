export const DAY_DURATION_MS = 60_000; // 1 minute (halved)
export const ORDER_TIMEOUT_MS = 12_000; // 12 seconds

// Customers/day dynamics
export const INITIAL_CUSTOMERS_PER_DAY = 8; // increase by ~3 customers/day
export const BASELINE_DEMAND_GROWTH_PER_DAY = 0.02; // +2% per day
export const REPUTATION_GROWTH_PER_CUSTOMER = 0.002; // +0.2% per served customer
export const MAX_TOWN_POPULATION = 1_000;
export const MAX_DAILY_MARKET_FRACTION = 0.10; // 10% of pop per day
export const DEMAND_SATURATION_DECREASE_PER_SALE = 0.001; // -0.1% per any product sold

// Pricing & currency
export const COPPER_PER_SILVER = 100;
export const BASE_ALE_PRICE_COPPER = 10; // 10 copper base

// Quality tiers (each +20% over previous)
export const QUALITY_TIER_LABELS = [
  'poor',
  'plain',
  'basic',
  'decent',
  'good',
  'great',
  'scrumptious',
  'exceptional',
  'legendary',
] as const;

export const QUALITY_PER_TIER_MULTIPLIER = 1.2; // compounding per tier

// Minigame zones initial widths
export const INITIAL_ZONE_RED = 0.5; // 50%
export const INITIAL_ZONE_YELLOW = 0.3; // 30%
export const INITIAL_ZONE_GREEN = 0.1; // 10% (halved); used when computing from base; green is centered

// Tips
export const TIP_MULTIPLIER_RED = 0.0;
export const TIP_MULTIPLIER_YELLOW = 0.10;
export const TIP_MULTIPLIER_GREEN = 0.30;
export const CUSTOMER_SERVICE_TIP_BONUS_PER_LEVEL = 0.02; // +2% tips per level compounding
export const REPUTATION_TIP_BONUS_PER_POINT = 0.001; // +0.1% tips per reputation point

// Wage
export const WAGE_BASE_THRESHOLD_ORDERS = 7;
export const WAGE_BASE_COPPER = 20;
export const WAGE_PER_EXTRA_ORDER_COPPER = 5;

// Skills
export const MAX_SKILL_LEVEL = 10;
export const SKILL_XP_BASE_TO_LEVEL = 20; // base XP to reach level 1
export const SKILL_XP_GROWTH_PER_LEVEL = 1.2; // exponential growth factor per level
export const ACCURACY_GREEN_XP = 2; // XP gain for green hit
export const ACCURACY_YELLOW_XP = 1; // XP gain for yellow hit
export const ACCURACY_RED_XP = 0; // none for red

// Accuracy zone growth per level (relative points to reallocate from red to green)
export const ACCURACY_GREEN_WIDTH_DELTA_PER_LEVEL = 0.02; // +2% to green
export const ACCURACY_RED_WIDTH_DELTA_PER_LEVEL = -0.02; // -2% from red

// Books pricing (copper)
export const BOOK_PRICE_COPPER = 50;

// Promotion
export const PROMOTION_ACCURACY_LEVEL_REQUIRED = 5;

// Brewing stubs
export const BREW_TIME_MS = DAY_DURATION_MS; // 1 day
export const BREW_YIELD_PINTS = 10;
export const BREW_WASTE_START_FRACTION = 0.25; // 25%
export const BREW_WASTE_FLOOR_FRACTION = 0.05; // 5% (no magic)
export const STORAGE_CAPACITY_UNITS = 50;
export const BARREL_STORAGE_UNITS = 10;
export const INGREDIENT_STORAGE_UNITS = 1;

// UI
export const AUTOSAVE_ON_DAY_END = false; // disable persistence for now

// Speed skill effects
export const SPEED_INDICATOR_MULTIPLIER_PER_LEVEL = 0.05; // +5% indicator speed per level
export const SPEED_POUR_COOLDOWN_MS = 600; // base cooldown between pours
export const SPEED_COOLDOWN_REDUCTION_PER_LEVEL = 0.08; // -8% per level (linear), min clamp applies
export const SPEED_MIN_COOLDOWN_MS = 120; // clamp

// Trading effects
export const BASE_ALE_COST_COPPER = 6; // per-serve cost (COGS) for ale from supplier
export const TRADING_DISCOUNT_PER_LEVEL = 0.01; // 1% compounded per level

export function computeQualityMultiplier(tierIndex: number): number {
  return Math.pow(QUALITY_PER_TIER_MULTIPLIER, tierIndex);
}


