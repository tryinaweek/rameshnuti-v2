"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

interface PersonRecord {
  app: string;
  table: string;
  source: string | null;
  at: string | null;
  origin: string | null;
}

interface Person {
  email: string;
  name: string | null;
  apps: string[];
  firstSeen: string | null;
  origin: string | null;
  records: PersonRecord[];
}

interface Directory {
  people: Person[];
  apps: string[];
  failed: string[];
  totalRecords: number;
}

/**
 * Everyone who has ever given an address to any of the products in this
 * database, merged by email so one person is one row no matter how many
 * products they signed up to.
 */
export function PeopleManager({ password }: { password: string }) {
  const [data, setData] = useState<Directory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [app, setApp] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  // Substack catch-up: addresses in the last downloaded import file.
  const [exported, setExported] = useState<string[] | null>(null);
  const [substackMsg, setSubstackMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/people", {
        headers: { "x-admin-password": password },
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || `Failed (${res.status})`);
        return;
      }
      setData(body);
    } catch {
      setError("Network error — could not reach the API");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.people.filter((p) => {
      if (app !== "all" && !p.apps.includes(app)) return false;
      if (!q) return true;
      return (
        p.email.includes(q) ||
        (p.name ?? "").toLowerCase().includes(q) ||
        p.apps.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [data, query, app]);

  const perApp = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of data?.people ?? []) {
      for (const a of p.apps) counts.set(a, (counts.get(a) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [data]);

  const csvCell = (value: string) => {
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const exportCsv = () => {
    const rows = [
      ["email", "name", "applications", "joined", "came_from"],
      ...visible.map((p) => [
        p.email,
        p.name ?? "",
        p.apps.join(" | "),
        p.firstSeen ?? "",
        p.origin ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(
      new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `people-${app === "all" ? "all" : app.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Everyone THE LIST has that Substack hasn't confirmed, as the CSV
   * Substack's own importer takes. The supported fallback for any signup the
   * automatic sync couldn't hand over.
   */
  const downloadSubstackCatchUp = async () => {
    setSubstackMsg("");
    const res = await fetch("/api/admin/substack", { headers: { "x-admin-password": password } });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubstackMsg(body.error || `Export failed (${res.status})`);
      return;
    }
    const csv = await res.text();
    const emails = csv
      .split("\n")
      .slice(1)
      .map((line) => line.split(",")[0].replace(/^"|"$/g, "").trim())
      .filter(Boolean);
    if (emails.length === 0) {
      setExported(null);
      setSubstackMsg("Nothing to catch up: every address on the list is already synced to Substack.");
      return;
    }
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `substack-import-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(emails);
    setSubstackMsg(
      `${emails.length} address${emails.length === 1 ? "" : "es"} downloaded. Import the file in Substack (Settings → Subscribers → Import), then mark them synced here.`,
    );
  };

  const markExportedSynced = async () => {
    if (!exported) return;
    const res = await fetch("/api/admin/substack", {
      method: "POST",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify({ emails: exported }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSubstackMsg(body.error || `Could not mark synced (${res.status})`);
      return;
    }
    setExported(null);
    setSubstackMsg(`Marked ${body.marked} of ${body.of} as synced.`);
  };

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

  if (loading) return <p className="text-slate-500 text-sm">Loading people…</p>;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-5 text-sm">
        {error}
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{data.people.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
            unique people
          </p>
        </div>
        {perApp.slice(0, 3).map(([label, n]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{n}</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 truncate">
              {label}
            </p>
          </div>
        ))}
      </div>

      {data.failed.length > 0 && (
        <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2.5">
          Could not read: {data.failed.join(", ")}. Those signups are missing from this view.
        </p>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search email, name, or app"
          className="premium-input px-4 py-2.5 text-sm flex-1"
        />
        <select
          value={app}
          onChange={(e) => setApp(e.target.value)}
          className="premium-input px-4 py-2.5 text-sm sm:w-56 cursor-pointer"
        >
          <option value="all">All applications</option>
          {data.apps.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button
          onClick={exportCsv}
          className="btn-primary px-5 py-2.5 text-xs whitespace-nowrap cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      {/* Substack is the one mailing list; this catches anyone the automatic
          sync missed. */}
      <div className="bg-slate-light border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Substack catch-up.</strong> Anyone on the list
            Substack hasn&apos;t confirmed yet, in Substack&apos;s import format.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={downloadSubstackCatchUp}
              className="btn-secondary px-4 py-2 text-xs whitespace-nowrap cursor-pointer"
            >
              Download for Substack
            </button>
            {exported && (
              <button
                onClick={markExportedSynced}
                className="btn-primary px-4 py-2 text-xs whitespace-nowrap cursor-pointer"
              >
                I imported them
              </button>
            )}
          </div>
        </div>
        {substackMsg && <p className="text-xs text-slate-600">{substackMsg}</p>}
      </div>

      <p className="text-xs text-slate-500">
        Showing {visible.length} of {data.people.length} people, merged from{" "}
        {data.totalRecords} signup records.
      </p>

      {/* Directory */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-bold">Email</th>
              <th className="px-4 py-2.5 font-bold">Name</th>
              <th className="px-4 py-2.5 font-bold">Applications</th>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap">Joined</th>
              <th className="px-4 py-2.5 font-bold">Came from</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((p) => (
              <Fragment key={p.email}>
                <tr
                  onClick={() => setExpanded(expanded === p.email ? null : p.email)}
                  className="bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-mono">{p.email}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.name ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    <span className="flex flex-wrap gap-1">
                      {p.apps.map((a) => (
                        <span
                          key={a}
                          className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          {a}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono whitespace-nowrap">
                    {fmt(p.firstSeen)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 truncate max-w-[14rem]">
                    {p.origin ?? <span className="text-slate-300">not captured</span>}
                  </td>
                </tr>
                {expanded === p.email && (
                  <tr className="bg-slate-50">
                    <td colSpan={5} className="px-4 py-3">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                        {p.records.length} signup record
                        {p.records.length === 1 ? "" : "s"}
                      </p>
                      <div className="space-y-1">
                        {p.records.map((r, i) => (
                          <div
                            key={`${r.table}-${i}`}
                            className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600"
                          >
                            <span className="font-bold text-slate-900">{r.app}</span>
                            <span className="font-mono text-slate-400">{r.table}</span>
                            {r.source && <span>source: {r.source}</span>}
                            {r.at && <span className="text-slate-400">{fmt(r.at)}</span>}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
