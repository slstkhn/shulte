// Fisher–Yates
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(ms: number): string {
  const totalCs = Math.floor(ms / 10); // сотые доли секунды
  const s = Math.floor(totalCs / 100);
  const cs = totalCs % 100;
  return `${s}.${cs.toString().padStart(2, "0")}`;
}
