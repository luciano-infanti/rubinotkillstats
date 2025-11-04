import { Card, CardContent } from "@/components/ui/card";
import { GlobalStats } from "@/lib/types";

export function StatsCards({ stats }: { stats: GlobalStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Total Bosses", value: stats.totalBosses },
        { label: "Killed Today", value: stats.killedToday },
        { label: "World", value: stats.world },
        { label: "Last Updated", value: stats.lastUpdated },
      ].map((s) => (
        <Card key={s.label}>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-semibold mt-2">{s.value ?? "—"}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
