import { BossDaily } from "./types";

export function parseDump(raw: string): { world: string; rows: BossDaily[] } {
  // Extract world name from header
  const worldMatch = raw.match(/RubinOT Boss Kill Tracker -\s*(.+)/);
  const world = worldMatch ? worldMatch[1].trim() : "Unknown";

  // Split by boss blocks (sections separated by ---)
  const blocks = raw.split(/\n---\n/).map(b => b.trim()).filter(Boolean);
  const rows: BossDaily[] = [];

  for (const block of blocks) {
    // Extract boss name
    const bossMatch = block.match(/^Boss:\s*(.+)$/m);
    if (!bossMatch) continue;
    
    const boss = bossMatch[1].trim();

    // Extract history line
    const historyMatch = block.match(/^History:\s*(.+)$/m);
    if (!historyMatch) continue;

    const historyLine = historyMatch[1].trim();
    
    // Skip if no history
    if (/None/i.test(historyLine) || historyLine === "None") continue;

    // Parse history entries: "02/11/2025 (2x), 03/11/2025 (4x)"
    const entries = historyLine.split(/,\s*/);
    
    for (const entry of entries) {
      const entryMatch = entry.match(/(\d{2}\/\d{2}\/\d{4})\s*\((\d+)x\)/);
      if (!entryMatch) continue;

      const [, dmy, killsStr] = entryMatch;
      const [dd, mm, yyyy] = dmy.split("/");
      const date = `${yyyy}-${mm}-${dd}`; // Convert to ISO format YYYY-MM-DD
      const kills = Number(killsStr);

      rows.push({ boss, date, kills, world });
    }
  }

  return { world, rows };
}
