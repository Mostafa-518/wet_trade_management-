import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTrades } from "@/hooks/useTrades";
import { useApiMutation } from "@/hooks/core/useApiMutation";
import { estimateService } from "@/services/estimateService";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  item_name: z.string().min(2, "Item name is required"),
  unit: z.string().min(1, "Unit is required"),
  trade_id: z.string().optional(),
  quantity: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), {
      message: "Quantity must be a positive number",
    }),
  currency: z.string().default("EGP"),
});

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
            <CardTitle>Create Draft Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <EstimatorForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentDrafts />
          </CardContent>
        </Card>

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

function EstimatorForm() {
  const { trades, isLoading } = useTrades();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: "",
      unit: "m²",
      trade_id: undefined,
      quantity: undefined,
      currency: "EGP",
    },
  });

  const { executeAsync, isPending } = useApiMutation(estimateService.createDraft, {
    successMessage: "Draft estimate created",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await executeAsync(values as any);
    form.reset({ ...form.getValues(), item_name: "" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="trade_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading trades..." : "Select trade (optional)"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trades.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="item_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 20mm plaster on walls" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., m²" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (optional)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 1500" value={field.value as any ?? ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EGP">EGP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-3 flex justify-end gap-2">
          <Button type="submit" disabled={isPending}>Save Draft</Button>
        </div>
      </form>
    </Form>
  );
}

function RecentDrafts() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["estimates", "recent"],
    queryFn: () => estimateService.listMyRecent(10),
    staleTime: 60_000,
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading recent drafts...</div>;
  if (error) return <div className="text-sm text-destructive">Failed to load drafts</div>;
  if (!data.length) return <div className="text-sm text-muted-foreground">No drafts yet.</div>;

  return (
    <ul className="space-y-2">
      {data.map((e: any) => (
        <li key={e.id} className="flex items-center justify-between border rounded-md p-2">
          <div className="text-sm">
            <div className="font-medium">
              {e.item_name} <span className="text-muted-foreground">({e.unit})</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Created {new Date(e.created_at).toLocaleString()}
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
            {e.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default RateEstimator;
