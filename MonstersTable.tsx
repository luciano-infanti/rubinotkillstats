"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BossStats } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";

type SortField = keyof BossStats;
type SortDirection = "asc" | "desc";

export function MonstersTable({ rows }: { rows: BossStats[] }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("lastKill");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSorted = useMemo(() => {
    let filtered = rows;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((row) =>
        row.boss.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle undefined values
      if (aVal === undefined) aVal = sortDirection === "asc" ? Infinity : -Infinity;
      if (bVal === undefined) bVal = sortDirection === "asc" ? Infinity : -Infinity;

      // String comparison
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Numeric comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [rows, search, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search boss..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("boss")}
              >
                <div className="flex items-center gap-2">
                  Boss
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("lastKill")}
              >
                <div className="flex items-center gap-2">
                  Last Kill
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort("killsToday")}
              >
                <div className="flex items-center justify-end gap-2">
                  Kills Today
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort("totalKills")}
              >
                <div className="flex items-center justify-end gap-2">
                  Total Kills
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort("avgDays")}
              >
                <div className="flex items-center justify-end gap-2">
                  Avg Days
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("nextSpawn")}
              >
                <div className="flex items-center gap-2">
                  Next Expected
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No bosses found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((row) => (
                <TableRow key={row.boss}>
                  <TableCell className="font-medium">{row.boss}</TableCell>
                  <TableCell>{formatDate(row.lastKill)}</TableCell>
                  <TableCell className="text-right">
                    {row.killsToday > 0 ? (
                      <Badge variant="default">{row.killsToday}</Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{row.totalKills}</TableCell>
                  <TableCell className="text-right">
                    {row.avgDays ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(row.nextSpawn)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSorted.length} of {rows.length} bosses
      </div>
    </div>
  );
}
