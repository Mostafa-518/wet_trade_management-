import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RateEstimator() {
  // Basic SEO for this page
  useEffect(() => {
    const title = "AI-Powered Rate Estimator | Wet Trades Management";
    const description =
      "Estimate construction trade item rates using recorded items and AI-generated cost breakdowns with editable line items and live recalculation.";

    document.title = title;

    // Meta description
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">AI-Powered Rate Estimator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quickly generate accurate rate estimations for construction trade items using historical data and AI.
        </p>
      </header>

      <main className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Purpose & Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Designed for quantity surveyors, estimators, procurement, and site engineers.</li>
              <li>Deliver a reliable unit rate (e.g., EGP/m², EGP/m³) with a transparent AI-generated breakdown.</li>
              <li>Performance target: 1–3s per estimation with cached fallback.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Trade category</li>
              <li>Item name</li>
              <li>Unit of measurement</li>
              <li>Specifications (optional)</li>
              <li>Location / project type (optional)</li>
              <li>Quantity (optional)</li>
              <li>Advanced (optional): currency (default EGP), target margin %, uncertainty range</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Source & Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Search recorded items from the database by trade and unit first.</li>
              <li>Combine exact/lexical matches with semantic similarity (embeddings) for top-k candidates.</li>
              <li>Apply time-decay weighting to prioritize recent data; optional market/inflation adjustment.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Breakdown Logic</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Analyze matched history to calculate an estimated unit rate and confidence score.</li>
              <li>Generate editable breakdown lines: materials, labor, equipment, overhead/profit.</li>
              <li>Include key assumptions and reference source items used for grounding.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output Format & UX</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Rate summary: median, min–max, confidence, and top source references.</li>
              <li>Editable breakdown table with live recalculation, undo/redo, and reset-to-AI.</li>
              <li>AI notes and assumptions panel with visible inflation/market factors applied.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Save estimation (draft/final) and retrieve later.</li>
              <li>Export to PDF/Excel including assumptions and sources.</li>
              <li>Provide feedback (thumbs up/down + reason) to improve accuracy.</li>
              <li>Use in Subcontract: push final rate/lines into a new subcontract flow.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Backend: Supabase tables for estimates and line items with RLS; audit on insert/delete.</li>
              <li>Similarity via Edge Function (embeddings) and an AI breakdown generator function.</li>
              <li>Caching by input hash; client pricing engine recalculates edits instantly.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future Enhancements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Live market price APIs; scenario simulation (e.g., +10% cement).</li>
              <li>Benchmarking against industry averages; token-by-token streaming for AI notes.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pre-Implementation Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">All features, logic, data flow, and interactions must be reviewed and approved before coding the interactive estimator UI.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Inflation index source (internal vs CPI), k similar items, and time window.</li>
              <li>Confidence calculation formula and export branding requirements.</li>
              <li>Finalize permissions for who can edit/delete estimates.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default RateEstimator;
