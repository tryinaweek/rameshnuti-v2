"use client";

import { useCallback, useState } from "react";

import { BuildsManager } from "./BuildsManager";
import { GptsManager } from "./GptsManager";

interface AdminFile {
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  downloads: number | null;
}

interface AdminWorkshop {
  slug: string;
  title: string;
  createdAt: string;
  files: AdminFile[];
  totalDownloads: number | null;
  emailsCaptured: number | null;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState<"workshops" | "gpts" | "builds">("workshops");
  const [workshops, setWorkshops] = useState<AdminWorkshop[]>([]);
  const [statsAvailable, setStatsAvailable] = useState(true);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");

  const headers = { "x-admin-password": password };

  const refresh = useCallback(
    async (pw: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/workshops", {
          headers: { "x-admin-password": pw },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || `Failed (${res.status})`);
          return false;
        }
        setWorkshops(data.workshops);
        setStatsAvailable(data.statsAvailable);
        return true;
      } catch {
        setError("Network error — could not reach API");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleLogin = async () => {
    setError("");
    if (await refresh(password)) setAuthenticated(true);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/workshops", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Created workshop "${data.workshop.title}"`);
      setNewTitle("");
      await refresh(password);
    } else {
      setError(data.error || "Failed to create workshop");
    }
    setCreating(false);
  };

  const handleUpload = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    setUploading(true);
    setError("");
    setMessage("");
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workshop", slug);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) {
        setError(`Failed to upload ${file.name}`);
        setUploading(false);
        return;
      }
    }
    setMessage(`Uploaded ${fileList.length} file(s)`);
    setUploading(false);
    await refresh(password);
    e.target.value = "";
  };

  const handleDelete = async (url: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const res = await fetch("/api/admin/files", {
      method: "DELETE",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      setMessage(`Deleted ${name}`);
      await refresh(password);
    } else {
      setError(`Failed to delete ${name}`);
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/workshops/${slug}`;
    void navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(""), 1500);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!authenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-6 bg-white text-slate-900 font-sans">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Control Panel</h1>
            <p className="text-xs text-slate-500">
              Enter your admin passphrase to manage workshops.
            </p>
          </div>
          <div className="bg-slate-light border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="premium-input w-full px-4 py-3 text-sm focus:border-teal-accent transition-colors"
            />
            {error && <p className="text-red-600 text-xs font-semibold px-1">{error}</p>}
            <button onClick={handleLogin} className="btn-primary w-full py-3.5 text-sm">
              {loading ? "Checking..." : "Authenticate"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const open = workshops.find((w) => w.slug === openSlug) ?? null;

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <div className="h-[3px] w-full bg-sig-bar" />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-left">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {(["workshops", "gpts", "builds"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSection(tab);
                    setOpenSlug(null);
                  }}
                  className={`text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    section === tab
                      ? "bg-teal-accent text-white border-teal-accent"
                      : "text-slate-500 bg-slate-50 border-slate-200 hover:text-slate-900"
                  }`}
                >
                  {tab === "workshops"
                    ? "Workshops"
                    : tab === "gpts"
                      ? "GPT Garden"
                      : "Build With Me"}
                </button>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {section === "gpts"
                ? "GPT Garden"
                : section === "builds"
                  ? "Build With Me"
                  : open
                    ? open.title
                    : "Workshops"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {section === "gpts"
                ? "/gpts — hide, edit, or add the custom GPTs shown on the public page."
                : section === "builds"
                  ? "/build — write next Saturday's edition, preview it, then publish."
                  : open
                    ? `/workshops/${open.slug}`
                    : "Each workshop has its own unlock page, files, and download stats."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {open && (
              <button
                onClick={() => setOpenSlug(null)}
                className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 hover:text-slate-900 bg-slate-50 px-3.5 py-2 rounded-lg transition-colors border border-slate-200"
              >
                &larr; All Workshops
              </button>
            )}
            <button
              onClick={() => {
                setAuthenticated(false);
                setPassword("");
                setOpenSlug(null);
              }}
              className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 px-3.5 py-2 rounded-lg transition-colors border border-slate-200"
            >
              Lock Session
            </button>
          </div>
        </div>

        {section === "gpts" ? (
          <GptsManager password={password} />
        ) : section === "builds" ? (
          <BuildsManager password={password} />
        ) : (
          <>
        {/* Stats hint */}
        {!statsAvailable && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-xs font-semibold text-left">
            Download &amp; email counts are off. Add the{" "}
            <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> env var to the
            rameshnuti-v2 Vercel project (Supabase &rarr; Settings &rarr; API &rarr; service_role)
            and redeploy.
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-xs font-semibold text-left">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-3 text-xs font-semibold text-left">
            {message}
          </div>
        )}

        {!open ? (
          <>
            {/* New workshop */}
            <div className="bg-slate-light border border-slate-200 rounded-2xl p-6 text-left space-y-3">
              <h2 className="text-sm font-mono font-bold text-teal-accent uppercase tracking-widest">
                New Workshop
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder='e.g. "SG Frisco September 2026"'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="premium-input flex-1 px-4 py-2.5 text-sm focus:border-teal-accent transition-colors"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating || !newTitle.trim()}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>

            {/* Workshop cards */}
            <div className="grid gap-4 text-left">
              {workshops.map((w) => (
                <div
                  key={w.slug}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-900 tracking-tight truncate">
                        {w.title}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        /workshops/{w.slug}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpenSlug(w.slug)}
                      className="btn-primary px-4 py-2 text-xs shrink-0"
                    >
                      Open &rarr;
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600 font-mono">
                    <span>
                      <strong className="text-slate-900">{w.files.length}</strong> files
                    </span>
                    <span>
                      <strong className="text-slate-900">{w.totalDownloads ?? "—"}</strong>{" "}
                      downloads
                    </span>
                    <span>
                      <strong className="text-slate-900">{w.emailsCaptured ?? "—"}</strong>{" "}
                      emails
                    </span>
                    <button
                      onClick={() => copyLink(w.slug)}
                      className="text-teal-accent font-bold hover:underline cursor-pointer"
                    >
                      {copied === w.slug ? "Copied!" : "Copy visitor link"}
                    </button>
                  </div>
                </div>
              ))}
              {workshops.length === 0 && !loading && (
                <p className="text-slate-500 text-sm bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
                  No workshops yet. Create the first one above.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Upload into this workshop */}
            <div className="bg-slate-light border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-sm text-left">
              <h2 className="text-sm font-mono font-bold text-teal-accent uppercase tracking-widest mb-4">
                Upload to {open.title}
              </h2>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-accent/30 rounded-xl p-8 cursor-pointer bg-white transition-all duration-300 ${
                  uploading ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                <span className="text-2xl mb-2 text-teal-accent">&uarr;</span>
                <p className="text-slate-900 text-sm font-semibold">
                  {uploading ? "Uploading files..." : "Click to select files"}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Any file becomes a download card automatically — no naming rules.
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleUpload(open.slug, e)}
                  className="hidden"
                />
              </label>
            </div>

            {/* File list with counts */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Files ({open.files.length})
                </h2>
                <button
                  onClick={() => copyLink(open.slug)}
                  className="text-xs font-bold text-teal-accent hover:underline cursor-pointer"
                >
                  {copied === open.slug ? "Copied!" : `Copy visitor link`}
                </button>
              </div>

              {open.files.length === 0 ? (
                <p className="text-slate-500 text-sm bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
                  No files yet. Upload workshop assets above.
                </p>
              ) : (
                <div className="grid gap-3">
                  {open.files.map((file) => (
                    <div
                      key={file.url}
                      className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-bold truncate tracking-wide text-slate-900">
                          {file.name}
                        </p>
                        <p className="text-slate-400 text-[10px] font-mono">
                          {formatSize(file.size)} &middot;{" "}
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
                          title="Downloads"
                        >
                          &darr; {file.downloads ?? "—"}
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-teal-accent bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg transition-colors hover:bg-teal-100/50"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(file.url, file.name)}
                          className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-100/50 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
          </>
        )}
      </div>
    </div>
  );
}
