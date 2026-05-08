"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Board } from "@/components/Board";
import { Hud } from "@/components/Hud";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Results, type RoundResult } from "@/components/Results";
import { shuffle } from "@/lib/utils";
import {
  hapticHeavy,
  hapticSuccess,
  initTelegram,
} from "@/lib/telegram";

const TOTAL_ROUNDS = 3;
const TARGET_MAX = 10;

type Phase = "idle" | "playing" | "results";

function makeRound(): number[] {
  return shuffle(Array.from({ length: TARGET_MAX }, (_, i) => i + 1));
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(1);
  const [numbers, setNumbers] = useState<number[]>(() => makeRound());
  const [current, setCurrent] = useState(1);
  const [errors, setErrors] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);

  const startedAt = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  // Telegram init один раз
  useEffect(() => {
    initTelegram();
  }, []);

  // Запускаем/останавливаем таймер по фазе
  useEffect(() => {
    const tick = () => {
      if (startedAt.current != null) {
        setTimeMs(performance.now() - startedAt.current);
        rafId.current = requestAnimationFrame(tick);
      }
    };

    if (phase === "playing") {
      startedAt.current = performance.now();
      setTimeMs(0);
      rafId.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [phase, round]);

  const startRound = useCallback(() => {
    setNumbers(makeRound());
    setCurrent(1);
    setErrors(0);
    setPhase("playing");
  }, []);

  const handleCorrect = useCallback(
    (n: number) => {
      if (n < TARGET_MAX) {
        setCurrent(n + 1);
        return;
      }

      // Раунд закончен
      const finishedAt = performance.now();
      const elapsed =
        startedAt.current != null ? finishedAt - startedAt.current : 0;
      startedAt.current = null;

      const result: RoundResult = {
        round,
        timeMs: elapsed,
        errors,
      };

      const allResults = [...results, result];
      setResults(allResults);
      setTimeMs(elapsed);

      hapticSuccess();

      if (round >= TOTAL_ROUNDS) {
        setPhase("results");
      } else {
        // короткая пауза перед следующим раундом
        setPhase("idle");
        setRound((r) => r + 1);
      }
    },
    [errors, results, round]
  );

  const handleWrong = useCallback(() => {
    setErrors((e) => e + 1);
  }, []);

  const handleRestart = useCallback(() => {
    hapticHeavy();
    setResults([]);
    setRound(1);
    setNumbers(makeRound());
    setCurrent(1);
    setErrors(0);
    setTimeMs(0);
    setPhase("idle");
  }, []);

  const isPlaying = phase === "playing";
  const showResults = phase === "results";

  return (
    <main className="page">
      <div className="top">
        {!showResults && (
          <Hud
            round={round}
            totalRounds={TOTAL_ROUNDS}
            timeMs={timeMs}
            errors={errors}
          />
        )}

        <div className="board-wrap">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={`board-${round}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Board
                  numbers={numbers}
                  current={current}
                  onCorrect={handleCorrect}
                  onWrong={handleWrong}
                  isLocked={!isPlaying}
                />
              </motion.div>
            ) : (
              <Results key="results" results={results} />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bottom">
        {showResults ? (
          <PrimaryButton label="Сыграть ещё" onClick={handleRestart} />
        ) : !isPlaying ? (
          <PrimaryButton
            label={`Старт #${round}`}
            onClick={startRound}
          />
        ) : (
          <div className="hint">
            Нажимай по порядку: <span>{current}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          padding-top: var(--safe-top);
          padding-bottom: max(var(--safe-bottom), 16px);
        }
        .top {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .board-wrap {
          padding: 8px 16px 0;
          display: flex;
          flex-direction: column;
        }
        .bottom {
          padding: 16px 16px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 88px;
        }
        .hint {
          font-size: 14px;
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }
        .hint span {
          color: var(--amber);
          font-weight: 700;
          margin-left: 6px;
        }
      `}</style>
    </main>
  );
}
