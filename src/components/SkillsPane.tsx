import type { GameState, SkillKey } from '../types';
import {
  ACCURACY_GREEN_WIDTH_DELTA_PER_LEVEL,
  ACCURACY_RED_WIDTH_DELTA_PER_LEVEL,
  CUSTOMER_SERVICE_TIP_BONUS_PER_LEVEL,
  REPUTATION_TIP_BONUS_PER_POINT,
  INITIAL_ZONE_GREEN,
  INITIAL_ZONE_RED,
  BASE_ALE_COST_COPPER,
  TRADING_DISCOUNT_PER_LEVEL,
} from '../constants';

function xpToNextLevel(level: number): number {
  return Math.round(20 * Math.pow(1.2, level));
}

function formatPct(n: number) {
  return `${Math.round(n * 100)}%`;
}

import { useState } from 'react';

function Tooltip({ content, children }: { content: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '100%',
            marginTop: 6,
            background: '#111',
            color: '#ddd',
            border: '1px solid #333',
            borderRadius: 6,
            padding: 8,
            fontSize: 12,
            minWidth: 240,
            zIndex: 10,
            boxShadow: '0 6px 16px rgba(0,0,0,0.35)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

interface Props {
  state: GameState;
}

export default function SkillsPane({ state }: Props) {
  const entries: Array<[SkillKey, string]> = [
    ['accuracy', 'Accuracy'],
    ['customerService', 'Customer Service'],
    ['speed', 'Speed'],
    ['trading', 'Trading'],
  ];
  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8 }}>
      <strong>Skills</strong>
      <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        {entries.map(([key, label]) => {
          const s = state.skills[key];
          const next = xpToNextLevel(s.level);
          const prog = Math.min(1, s.xp / next);

          let details: React.ReactNode = null;
          if (key === 'accuracy') {
            const red = Math.max(0.1, INITIAL_ZONE_RED + ACCURACY_RED_WIDTH_DELTA_PER_LEVEL * s.level);
            const green = Math.min(0.7, INITIAL_ZONE_GREEN + ACCURACY_GREEN_WIDTH_DELTA_PER_LEVEL * s.level);
            const yellow = Math.max(0.05, 1 - red - green);
            details = (
              <div>
                <div><strong>Levels by use</strong>: +2 XP on green, +1 on yellow, 0 on red.</div>
                <div style={{ marginTop: 4 }}><strong>Effect</strong>: Grows Green {formatPct(ACCURACY_GREEN_WIDTH_DELTA_PER_LEVEL)} / level; Shrinks Red {formatPct(-ACCURACY_RED_WIDTH_DELTA_PER_LEVEL)} / level.</div>
                <div style={{ marginTop: 4 }}><strong>Current zones</strong>: Red {formatPct(red)}, Yellow {formatPct(yellow)}, Green {formatPct(green)}</div>
                <div style={{ marginTop: 4 }}><strong>Next level XP</strong>: {next} (have {s.xp})</div>
              </div>
            );
          } else if (key === 'customerService') {
            const tipMult = Math.pow(1 + CUSTOMER_SERVICE_TIP_BONUS_PER_LEVEL, s.level) * (1 + state.reputation * REPUTATION_TIP_BONUS_PER_POINT);
            details = (
              <div>
                <div><strong>Levels by use</strong>: +1 XP per served drink.</div>
                <div style={{ marginTop: 4 }}><strong>Effect</strong>: Tips × (1+{(CUSTOMER_SERVICE_TIP_BONUS_PER_LEVEL * 100).toFixed(0)}%)^level × (1 + reputation × {(REPUTATION_TIP_BONUS_PER_POINT * 100).toFixed(1)}%).</div>
                <div style={{ marginTop: 4 }}><strong>Current tip multiplier</strong>: {tipMult.toFixed(3)}×</div>
                <div style={{ marginTop: 4 }}><strong>Next level XP</strong>: {next} (have {s.xp})</div>
              </div>
            );
          } else if (key === 'speed') {
            const patienceMult = Math.pow(1.1, s.level);
            details = (
              <div>
                <div><strong>Unlock</strong>: Buy the Speed skill book in the Store.</div>
                <div style={{ marginTop: 4 }}><strong>Effect</strong>: Customers wait longer before leaving. Patience × 1.1 per level.</div>
                <div style={{ marginTop: 4 }}><strong>Current patience multiplier</strong>: {patienceMult.toFixed(3)}×</div>
                <div style={{ marginTop: 4 }}><strong>Next level XP</strong>: {next} (have {s.xp})</div>
              </div>
            );
          } else if (key === 'trading') {
            const cost = Math.max(0, Math.round(BASE_ALE_COST_COPPER * Math.pow(1 - TRADING_DISCOUNT_PER_LEVEL, s.level)));
            details = (
              <div>
                <div><strong>Unlock</strong>: Buy the Trading skill book in the Store.</div>
                <div style={{ marginTop: 4 }}><strong>Effect</strong>: Reduces input costs by 1% compounded per level.</div>
                <div style={{ marginTop: 4 }}><strong>Ale COGS now</strong>: {cost} cp (base {BASE_ALE_COST_COPPER} cp)</div>
                <div style={{ marginTop: 4 }}><strong>Next level XP</strong>: {next} (have {s.xp})</div>
              </div>
            );
          }
          return (
            <div key={key} style={{ opacity: s.unlocked ? 1 : 0.7 }}>
              <Tooltip
                content={details}
              >
                <div>
                  {label} {s.unlocked ? '' : '(locked)'} — Lv {s.level}
                </div>
              </Tooltip>
              <div style={{ width: '100%', height: 6, background: '#222', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ width: `${prog * 100}%`, height: '100%', background: '#3db370' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


