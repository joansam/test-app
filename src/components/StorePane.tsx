import type { GameState } from '../types';
import { BOOK_PRICE_COPPER } from '../constants';

interface Props {
  state: GameState;
  setState: (updater: (s: GameState) => GameState) => void;
}

export default function StorePane({ state, setState }: Props) {
  function tryBuy(book: 'speed' | 'trading') {
    if (state.books[book]) return;
    if (state.cashCopper < BOOK_PRICE_COPPER) return;
    setState((s) => {
      const next = { ...s };
      next.cashCopper -= BOOK_PRICE_COPPER;
      next.books = { ...s.books, [book]: true } as any;
      next.skills = { ...s.skills, [book]: { ...s.skills[book], unlocked: true } } as any;
      return next;
    });
  }
  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
      <strong>Store</strong>
      <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        <button disabled={state.books.speed || state.cashCopper < BOOK_PRICE_COPPER} onClick={() => tryBuy('speed')}>
          Buy Skill Book: Speed — {BOOK_PRICE_COPPER} cp {state.books.speed ? '(owned)' : ''}
        </button>
        <button disabled={state.books.trading || state.cashCopper < BOOK_PRICE_COPPER} onClick={() => tryBuy('trading')}>
          Buy Skill Book: Trading — {BOOK_PRICE_COPPER} cp {state.books.trading ? '(owned)' : ''}
        </button>
      </div>
    </div>
  );
}


