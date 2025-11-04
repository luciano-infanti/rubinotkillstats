"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  async function handleSubmit() {
    if (!text.trim()) {
      setStatus({ type: "error", message: "Please paste some data first" });
      return;
    }

    setStatus({ type: "loading", message: "Parsing and saving..." });

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: `Successfully saved ${data.inserted} of ${data.total} entries for world "${data.world}"`,
        });
        // Clear textarea after successful upload
        setText("");
      } else {
        setStatus({
          type: "error",
          message: data.error || "An error occurred",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to connect to server",
      });
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Update Boss Kill Data</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paste Daily Dump</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full h-96 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Paste your RubinOT boss kill tracker dump here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={status.type === "loading"}
              className="min-w-[120px]"
            >
              {status.type === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Parse & Save"
              )}
            </Button>

            {status.message && (
              <div className="flex items-center gap-2">
                {status.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {status.type === "error" && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span
                  className={
                    status.type === "success"
                      ? "text-green-600"
                      : status.type === "error"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }
                >
                  {status.message}
                </span>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Format:</strong> Paste the complete output from the RubinOT
              Boss Kill Tracker. The system will automatically parse boss names,
              kill dates, and kill counts.
            </p>
            <p>
              Each boss entry should contain a "History" line with dates in
              DD/MM/YYYY format and kill counts like: <code>02/11/2025 (2x)</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
