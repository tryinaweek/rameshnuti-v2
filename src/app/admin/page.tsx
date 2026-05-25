"use client";

import { useState, useCallback } from "react";

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const headers = { "x-admin-password": password };

  const loadFiles = useCallback(async (pw: string) => {
    const res = await fetch("/api/admin/files", {
      headers: { "x-admin-password": pw },
    });
    if (!res.ok) {
      setError("Failed to load files");
      return;
    }
    const data = await res.json();
    setFiles(data.files);
  }, []);

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/files", { headers });
      const data = await res.json();
      if (res.ok) {
        setAuthenticated(true);
        setFiles(data.files);
      } else {
        setError(data.error || `Login failed (${res.status})`);
      }
    } catch (err) {
      setError("Network error — could not reach API");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    setUploading(true);
    setError("");
    setMessage("");

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);

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
    await loadFiles(password);
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
      await loadFiles(password);
    } else {
      setError(`Failed to delete ${name}`);
    }
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Control Panel
            </h1>
            <p className="text-xs text-slate-500">
              Enter your admin passphrase to access assets management.
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
            {error && (
              <p className="text-red-600 text-xs font-semibold px-1">{error}</p>
            )}
            <button
              onClick={handleLogin}
              className="btn-primary w-full py-3.5 text-sm"
            >
              Authenticate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Signature Brand Bar */}
      <div className="h-[3px] w-full bg-sig-bar" />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-left">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Workshop Assets Manager
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload n8n JSON models, prompts, and PDF guides to Vercel Blob.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthenticated(false);
              setPassword("");
            }}
            className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 px-3.5 py-2 rounded-lg transition-colors border border-slate-200"
          >
            Lock Session
          </button>
        </div>

        {/* Upload Block */}
        <div className="bg-slate-light border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-sm text-left">
          <h2 className="text-sm font-mono font-bold text-teal-accent uppercase tracking-widest mb-4">Upload Assets</h2>
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
              n8n JSON, PDF, TXT, or markdown files
            </p>
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

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

        {/* File List */}
        <div className="space-y-4 text-left">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Uploaded Files ({files.length})
          </h2>
          
          {files.length === 0 ? (
            <p className="text-slate-500 text-sm bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
              No files uploaded yet. Add workshop assets to list them here.
            </p>
          ) : (
            <div className="grid gap-3">
              {files.map((file) => {
                const name = file.pathname.replace("workshop/", "");
                return (
                  <div
                    key={file.url}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-bold truncate tracking-wide text-slate-900">
                        {name}
                      </p>
                      <p className="text-slate-400 text-[10px] font-mono">
                        {formatSize(file.size)} &middot; {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-teal-accent bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg transition-colors hover:bg-teal-100/50"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(file.url, name)}
                        className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-100/50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reference Cheat Sheet */}
        <div className="bg-slate-light border border-slate-200 rounded-2xl p-6 space-y-3 text-left">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Required Filenames Reference
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Ensure assets are named exactly as shown below so the buttons on the workshop download page link correctly:
          </p>
          <ul className="space-y-1.5 text-xs font-mono text-slate-600 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <li className="flex items-center gap-2">
              <span className="text-teal-accent font-bold">&middot;</span> research_workflow_n8n.json
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">&middot;</span> AI_Agent_Workshop_OnePager.pdf
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">&middot;</span> agent_prompt.txt
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-accent font-bold">&middot;</span> evaluation_prompt.txt
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
