"use client";

import { useEffect, useMemo, useState } from "react";

type Invoice = {
  id: string;
  clientName: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
};

export default function RevenueChart({ months = 6 }: { months?: number }) {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("invoices");
      const invoices: Invoice[] = raw ? JSON.parse(raw) : [];

      // compute totals per month for the last `months` months
      const now = new Date();
      const buckets: Record<string, number> = {};
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        buckets[key] = 0;
      }

      invoices.forEach((inv) => {
        if (inv.status === "paid") {
          const d = new Date(inv.dueDate || Date.now());
          const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
          if (key in buckets) buckets[key] += inv.amount;
        }
      });

      const lbls: string[] = [];
      const vals: number[] = [];
      Object.keys(buckets).forEach((k) => {
        vals.push(Math.round(buckets[k] * 100) / 100);
        const [y, m] = k.split("-");
        const monthName = new Date(Number(y), Number(m) - 1, 1).toLocaleString(undefined, { month: "short" });
        lbls.push(monthName);
      });

      setData(vals);
      setLabels(lbls);
      setTotal(vals.reduce((s, v) => s + v, 0));
    } catch (err) {
      setData([]);
      setLabels([]);
      setTotal(0);
    }
  }, [months]);

  const max = useMemo(() => Math.max(1, ...(data.length ? data : [0])), [data]);

  // Build points for an SVG polyline
  const points = useMemo(() => {
    if (!data || data.length === 0) return "";
    const w = 300; // viewbox width
    const h = 60; // viewbox height
    const gap = w / Math.max(1, data.length - 1);
    return data
      .map((v, i) => {
        const x = Math.round(i * gap);
        const y = Math.round(h - (v / max) * h);
        return `${x},${y}`;
      })
      .join(" ");
  }, [data, max]);

  // area path
  const areaPath = useMemo(() => {
    if (!data || data.length === 0) return "";
    const w = 300;
    const h = 60;
    const gap = w / Math.max(1, data.length - 1);
    const coords = data.map((v, i) => {
      const x = i * gap;
      const y = h - (v / max) * h;
      return [x, y];
    });
    let d = `M ${coords[0][0]} ${coords[0][1]}`;
    for (let i = 1; i < coords.length; i++) {
      d += ` L ${coords[i][0]} ${coords[i][1]}`;
    }
    // close to bottom
    d += ` L ${w} ${h} L 0 ${h} Z`;
    return d;
  }, [data, max]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm text-gray-500 dark:text-gray-400">Recent revenue</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Last {months} months</div>
        </div>

        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 300 60" className="w-full h-16">
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaPath && <path d={areaPath} fill="url(#g1)" />}
            {points && <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />}
          </svg>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            {labels.map((l, i) => (
              <div key={l + i} className="truncate" style={{ width: `${100 / Math.max(1, labels.length)}%`, textAlign: "center" }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
