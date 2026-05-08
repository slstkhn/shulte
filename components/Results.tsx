"use client";

import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils";

export interface RoundResult {
  round: number;
  timeMs: number;
  errors: number;
}

interface ResultsProps {
  results: RoundResult[];
}

export function Results({ results }: ResultsProps) {
  const totalTime = results.reduce((s, r) => s + r.timeMs, 0);
  const totalErrors = results.reduce((s, r) => s + r.errors, 0);
  const avg = results.length ? totalTime / results.length : 0;
  const best = results.reduce(
    (best, r) => (r.timeMs < best.timeMs ? r : best),
    results[0]
  );

  return (
    <motion.div
      className="wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="title">Готово</h1>
      <p className="subtitle">3 раунда позади</p>

      <div className="grid">
        <div className="stat">
          <span className="lbl">Сумма времени</span>
          <span className="val mono">{formatTime(totalTime)}</span>
        </div>
        <div className="stat">
          <span className="lbl">В среднем</span>
          <span className="val mono">{formatTime(avg)}</span>
        </div>
        <div className="stat">
          <span className="lbl">Лучший раунд</span>
          <span className="val mono">
            #{best.round} • {formatTime(best.timeMs)}
          </span>
        </div>
        <div className="stat">
          <span className="lbl">Ошибки всего</span>
          <span className={`val ${totalErrors > 0 ? "warn" : ""}`}>
            {totalErrors}
          </span>
        </div>
      </div>

      <div className="rounds">
        {results.map((r) => (
          <div key={r.round} className="row">
            <span className="dot">#{r.round}</span>
            <span className="rt mono">{formatTime(r.timeMs)}</span>
            <span className={`re ${r.errors > 0 ? "warn" : ""}`}>
              {r.errors === 0 ? "без ошибок" : `${r.errors} ош.`}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .wrap {
          padding: 48px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .title {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--amber);
        }
        .subtitle {
          color: var(--text-dim);
          margin-top: 4px;
          margin-bottom: 28px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }
        .stat {
          background: var(--bg-elev);
          border: 1px solid rgba(245, 180, 0, 0.08);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lbl {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .val {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
        }
        .val.warn {
          color: var(--error);
        }
        .rounds {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .row {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          align-items: center;
          padding: 12px 16px;
          background: var(--bg-elev);
          border-radius: 12px;
        }
        .dot {
          color: var(--amber);
          font-weight: 700;
        }
        .rt {
          font-size: 16px;
          font-weight: 600;
        }
        .re {
          font-size: 13px;
          color: var(--text-dim);
        }
        .re.warn {
          color: var(--error);
        }
        .mono {
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
        }
      `}</style>
    </motion.div>
  );
}
