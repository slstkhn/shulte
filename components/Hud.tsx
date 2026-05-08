"use client";

import { formatTime } from "@/lib/utils";

interface HudProps {
  round: number;
  totalRounds: number;
  timeMs: number;
  errors: number;
}

export function Hud({ round, totalRounds, timeMs, errors }: HudProps) {
  return (
    <div className="hud">
      <div className="cell">
        <span className="label">Раунд</span>
        <span className="value">
          {round}
          <span className="muted">/{totalRounds}</span>
        </span>
      </div>
      <div className="cell center">
        <span className="label">Время</span>
        <span className="value mono">{formatTime(timeMs)}</span>
      </div>
      <div className="cell right">
        <span className="label">Ошибки</span>
        <span className={`value ${errors > 0 ? "warn" : ""}`}>{errors}</span>
      </div>

      <style jsx>{`
        .hud {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 12px 18px;
          margin-bottom: 22px;
          border-bottom: 1px solid rgba(245, 180, 0, 0.08);
        }
        .cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .center {
          align-items: center;
        }
        .right {
          align-items: flex-end;
        }
        .label {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .value {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
        }
        .value.warn {
          color: var(--error);
        }
        .mono {
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
        }
        .muted {
          color: var(--text-dim);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
