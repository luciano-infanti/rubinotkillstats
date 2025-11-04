import { supabase } from "@/lib/supabase/client";
import { StatsCards } from "@/components/StatsCards";
import { MonstersTable } from "@/components/MonstersTable";
import { BossStats, GlobalStats } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const world = "Lunarian"; // Could be a dropdown later

  // Fetch all data needed
  const { data: bosses } = await supabase.from("bosses").select("id,name");

  const { data: worldData } = await supabase
    .from("worlds")
    .select("id")
    .eq("name", world)
    .single();

  let rows: any[] = [];
  if (worldData) {
    const { data } = await supabase
      .from("boss_daily_kills")
      .select("boss_id, day, kills, worlds(name), bosses(name)")
      .eq("world_id", worldData.id);
    rows = data || [];
  }

  const { data: lastUpload } = await supabase
    .from("raw_uploads")
    .select("uploaded_at")
    .order("uploaded_at", { ascending: false })
    .limit(1);

  // Build aggregates in JS
  const map = new Map<
    string,
    {
      boss: string;
      days: string[];
      killsPerDay: Record<string, number>;
      total: number;
      today: number;
    }
  >();

  const today = new Date().toISOString().slice(0, 10);

  rows?.forEach((r) => {
    const boss = (r as any).bosses?.name as string;
    if (!boss) return;

    const day = r.day as string;
    const kills = r.kills as number;

    if (!map.has(boss)) {
      map.set(boss, {
        boss,
        days: [],
        killsPerDay: {},
        total: 0,
        today: 0,
      });
    }

    const B = map.get(boss)!;
    B.days.push(day);
    B.killsPerDay[day] = kills;
    B.total += kills;
    if (day === today) B.today += kills;
  });

  // Calculate average days between spawns
  function avgGap(ds: string[]): number | undefined {
    const s = [...new Set(ds)].sort();
    if (s.length < 2) return undefined;

    let sum = 0;
    for (let i = 1; i < s.length; i++) {
      const a = new Date(s[i]);
      const b = new Date(s[i - 1]);
      sum += (Number(a) - Number(b)) / 86400000; // Convert ms to days
    }

    return Math.round(sum / (s.length - 1));
  }

  // Build table data
  const table: BossStats[] = [...map.values()].map((B) => {
    const last = B.days.length > 0 ? B.days.sort().at(-1) : undefined;
    const gap = avgGap(B.days);
    const next =
      last && gap
        ? new Date(new Date(last).getTime() + gap * 86400000)
            .toISOString()
            .slice(0, 10)
        : undefined;

    return {
      boss: B.boss,
      lastKill: last,
      killsToday: B.today,
      totalKills: B.total,
      avgDays: gap,
      nextSpawn: next,
      daysSpawned: [...new Set(B.days)].length,
    };
  });

  // Sort by last kill desc by default
  table.sort((a, b) => (b.lastKill || "").localeCompare(a.lastKill || ""));

  // Calculate global stats
  const stats: GlobalStats = {
    totalBosses: bosses?.length ?? 0,
    killedToday: table.filter((r) => r.killsToday > 0).length,
    world,
    lastUpdated: lastUpload?.[0]?.uploaded_at
      ? new Date(lastUpload[0].uploaded_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
  };

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">RubinOT Kill Stats</h1>
        <Link href="/upload">
          <Button>Upload Data</Button>
        </Link>
      </div>

      <StatsCards stats={stats} />
      <MonstersTable rows={table} />
    </main>
  );
}
