export type SkillKey = 'accuracy' | 'customerService' | 'speed' | 'trading';

export interface SkillState {
  level: number;
  xp: number;
  unlocked: boolean;
}

export interface Skills {
  accuracy: SkillState;
  customerService: SkillState;
  speed: SkillState; // gated by book
  trading: SkillState; // gated by book
}

export interface ProductState {
  name: string;
  qualityTierIndex: number; // 0..8
  soldToday: number;
}

export interface StoreBooks {
  speed: boolean;
  trading: boolean;
}

export interface BrewingState {
  unlocked: boolean;
  inProgress: boolean;
  readyAtMs: number | null;
  storageUsed: number;
}

export interface GameState {
  dayNumber: number; // starts at 1
  dayStartMs: number;
  cashCopper: number;
  reputation: number; // dimensionless; affects customers and tips
  customersExpectedToday: number; // fractional; used for Poisson rate
  demandIndex: number; // baseline demand factor
  products: Record<string, ProductState>; // keyed by product id (e.g., 'ale')
  skills: Skills;
  books: StoreBooks;
  brewing: BrewingState;
  statsToday: {
    served: number;
    missed: number;
    tipsCopper: number;
    wageCopper: number;
    revenueCopper: number;
    purchasesCopper: number;
  };
}

export type ZoneResult = 'red' | 'yellow' | 'green';


