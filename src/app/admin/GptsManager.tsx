"use client";

import { useCallback, useEffect, useState } from "react";

interface AdminGpt {
  id: string;
  name: string;
  description: string;
  category: string | null;
  icon: string | null;
  url: string | null;
  active?: boolean;
}

const EMPTY_FORM = { id: "", name: "", description: "", category: "", icon: "", url: "" };

export function GptsManager({ password }: { password: string }) {
  const [gpts, setGpts] = useState<AdminGpt[]>([]);
  const [hasActiveColumn, setHasActiveColumn] = useState(true);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const headers = { "x-admin-password": password, "Content-Type": "application/json" };

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/gpts", { headers: { "x-admin-password": password } });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load GPTs");
      return;
    }
    setGpts(data.gpts);
    setHasActiveColumn(data.hasActiveColumn);
  }, [password]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const startEdit = (gpt: AdminGpt) => {
    setForm({
      id: gpt.id,
      name: gpt.name,
      description: gpt.description,
      category: gpt.category ?? "",
      icon: gpt.icon ?? "",
      url: gpt.url ?? "",
    });
    setEditing(true);
    setMessage("");
    setError("");
  };

  const save = async (overrides: Partial<AdminGpt> = {}) => {
    setSaving(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/gpts", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...form, ...overrides }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(form.id ? "GPT updated" : "GPT added");
      setForm(EMPTY_FORM);
      setEditing(false);
      await refresh();
    } else {
      setError(data.error || "Save failed");
    }
    setSaving(false);
  };

  const toggleActive = async (gpt: AdminGpt) => {
    setError("");
    const res = await fetch("/api/admin/gpts", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...gpt, active: !(gpt.active ?? true) }),
    });
    if (res.ok) {
      await refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Toggle failed — has the active column been added?");
    }
  };

  const remove = async (gpt: AdminGpt) => {
    if (!confirm(`Delete "${gpt.name}" permanently? Hiding it (active toggle) is usually enough.`))
      return;
    const res = await fetch("/api/admin/gpts", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id: gpt.id }),
    });
    if (res.ok) {
      setMessage(`Deleted ${gpt.name}`);
      await refresh();
    } else {
      setError("Delete failed");
    }
  };

  const field =
    "premium-input w-full px-3.5 py-2.5 text-sm focus:border-teal-accent transition-colors";

  return (
    <div className="space-y-8 text-left">
      {!hasActiveColumn && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-xs font-semibold">
          Hide/show toggles need the <code className="font-mono">active</code> column — run the
          one-line SQL from the handoff in the Supabase SQL editor.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-xs font-semibold">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-3 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Add / edit form */}
      <div className="bg-slate-light border border-slate-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-mono font-bold text-teal-accent uppercase tracking-widest">
          {editing ? "Edit GPT" : "Add a GPT"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className={field}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={field}
            placeholder="Category (e.g. Writing)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className={field}
            placeholder="Emoji icon (e.g. ✍️)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
          <input
            className={field}
            placeholder="URL (https://chatgpt.com/g/…)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </div>
        <textarea
          className={`${field} min-h-[90px]`}
          placeholder="Description — what it does, who it's for"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2">
          <button
            onClick={() => void save()}
            disabled={saving}
            className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Add GPT"}
          </button>
          {editing && (
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditing(false);
              }}
              className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          GPTs ({gpts.length})
        </h2>
        {gpts.map((gpt) => {
          const isActive = gpt.active ?? true;
          return (
            <div
              key={gpt.id}
              className={`bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm ${
                isActive ? "" : "opacity-50"
              }`}
            >
              <div className="min-w-0 flex items-center gap-3">
                <span className="text-xl shrink-0">{gpt.icon ?? "🤖"}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate text-slate-900">
                    {gpt.name}
                    {!isActive && (
                      <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase">
                        hidden
                      </span>
                    )}
                  </p>
                  <p className="text-slate-400 text-[10px] font-mono truncate">
                    {gpt.category ?? "—"} · {gpt.url}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasActiveColumn && (
                  <button
                    onClick={() => void toggleActive(gpt)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isActive
                        ? "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100"
                        : "text-teal-accent bg-teal-50 border-teal-100 hover:bg-teal-100/50"
                    }`}
                  >
                    {isActive ? "Hide" : "Show"}
                  </button>
                )}
                <button
                  onClick={() => startEdit(gpt)}
                  className="text-[11px] font-bold text-teal-accent bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg hover:bg-teal-100/50 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => void remove(gpt)}
                  className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100/50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
