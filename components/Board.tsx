"use client";

import { motion, AnimatePresence } from "framer-motion";
import { hapticError, hapticTap } from "@/lib/telegram";

interface BoardProps {
  numbers: number[]; // 10 чисел в позициях 0..9
  current: number; // следующее ожидаемое число (1..10)
  onCorrect: (n: number) => void;
  onWrong: (n: number) => void;
  isLocked: boolean;
}

export function Board({
  numbers,
  current,
  onCorrect,
  onWrong,
  isLocked,
}: BoardProps) {
  return (
    <div className="board">
      {numbers.map((n, idx) => {
        const isActive = n === current;
        const isDone = n < current;

        return (
          <button
            key={idx}
            className={`cell ${isActive ? "is-active" : ""} ${
              isDone ? "is-done" : ""
            }`}
            disabled={isLocked || isDone}
            onClick={() => {
              if (isLocked) return;
              if (n === current) {
                hapticTap();
                onCorrect(n);
              } else if (n > current) {
                hapticError();
                onWrong(n);
              }
            }}
            aria-label={`Число ${n}`}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  key={`label-${n}`}
                  className="cell-label"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.18 }}
                >
                  {n}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}

      <style jsx>{`
        .board {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 14px;
          width: 100%;
          padding: 0 8px;
        }

        .cell {
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background: var(--amber-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 120ms ease, background 200ms ease,
            box-shadow 250ms ease;
          position: relative;
        }

        .cell:not(:disabled):active {
          transform: scale(0.92);
        }

        .cell.is-active {
          background: var(--amber);
          box-shadow:
            0 0 0 4px rgba(245, 180, 0, 0.12),
            0 0 28px 4px var(--amber-glow);
        }

        .cell.is-done {
          background: transparent;
          opacity: 0;
          transition: opacity 280ms ease;
        }

        .cell-label {
          font-size: clamp(20px, 6vw, 28px);
          font-weight: 700;
          color: #1a1300;
          letter-spacing: -0.02em;
        }

        /* На больших экранах поле не должно растягиваться чересчур */
        @media (min-width: 480px) {
          .board {
            max-width: 420px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
