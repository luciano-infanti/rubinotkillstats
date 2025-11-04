export type BossDaily = {
  boss: string;
  date: string; // YYYY-MM-DD
  kills: number;
  world: string;
};

export type BossStats = {
  boss: string;
  lastKill?: string;
  killsToday: number;
  totalKills: number;
  avgDays?: number;
  nextSpawn?: string;
  daysSpawned: number;
};

export type GlobalStats = {
  totalBosses: number;
  killedToday: number;
  world: string;
  lastUpdated: string;
};
