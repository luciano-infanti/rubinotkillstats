import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { parseDump } from "@/lib/parse";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid text field" },
        { status: 400 }
      );
    }

    const { world, rows } = parseDump(text);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No valid boss data found in the text" },
        { status: 400 }
      );
    }

    // Ensure world exists
    let { data: worldRow, error: worldError } = await supabase
      .from("worlds")
      .select("id")
      .eq("name", world)
      .maybeSingle();

    let world_id = worldRow?.id as string | undefined;

    if (!world_id) {
      const { data: inserted, error: insertError } = await supabase
        .from("worlds")
        .insert({ name: world })
        .select("id")
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: `Failed to insert world: ${insertError.message}` },
          { status: 500 }
        );
      }

      world_id = inserted!.id;
    }

    // Process each boss and their kills
    let successCount = 0;
    const errors: string[] = [];

    for (const r of rows) {
      try {
        // Ensure boss exists
        let { data: bossRow } = await supabase
          .from("bosses")
          .select("id")
          .eq("name", r.boss)
          .maybeSingle();

        let boss_id = bossRow?.id as string | undefined;

        if (!boss_id) {
          const { data: ins, error: bossError } = await supabase
            .from("bosses")
            .insert({ name: r.boss })
            .select("id")
            .single();

          if (bossError) {
            errors.push(`Boss ${r.boss}: ${bossError.message}`);
            continue;
          }

          boss_id = ins!.id;
        }

        // Upsert daily kills
        const { error: killsError } = await supabase
          .from("boss_daily_kills")
          .upsert(
            {
              boss_id,
              world_id,
              day: r.date,
              kills: r.kills,
            },
            { onConflict: "boss_id,world_id,day" }
          );

        if (killsError) {
          errors.push(`Kill data for ${r.boss} on ${r.date}: ${killsError.message}`);
        } else {
          successCount++;
        }
      } catch (err) {
        errors.push(`Unexpected error for ${r.boss}: ${err}`);
      }
    }

    // Save raw upload for audit
    await supabase.from("raw_uploads").insert({
      raw_text: text,
      world_id,
    });

    return NextResponse.json({
      ok: true,
      world,
      inserted: successCount,
      total: rows.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
