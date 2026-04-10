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
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-midnight mb-6 text-center">
            Admin
          </h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terra-400 mb-3"
          />
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-midnight text-white py-3 rounded-lg font-bold text-sm hover:bg-midnight-light transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-midnight">
          Workshop File Manager
        </h1>
        <button
          onClick={() => {
            setAuthenticated(false);
            setPassword("");
          }}
          className="text-sm text-text-secondary hover:text-midnight transition-colors"
        >
          Lock
        </button>
      </div>

      {/* Upload */}
      <div className="bg-midnight rounded-xl p-6 mb-8">
        <h2 className="text-white text-sm font-bold mb-4">Upload Files</h2>
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 cursor-pointer hover:border-white/40 transition-colors ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <p className="text-white/60 text-sm mb-1">
            {uploading ? "Uploading..." : "Click to select files"}
          </p>
          <p className="text-white/30 text-xs">
            JSON, PDF, TXT, or any file type
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
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm mb-4">
          {message}
        </div>
      )}

      {/* File List */}
      <h2 className="text-lg font-bold text-midnight mb-4">
        Uploaded Files ({files.length})
      </h2>
      {files.length === 0 ? (
        <p className="text-text-secondary text-sm">
          No files uploaded yet. Upload your workshop resources above.
        </p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const name = file.pathname.replace("workshop/", "");
            return (
              <div
                key={file.url}
                className="bg-midnight rounded-xl p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {formatSize(file.size)} &middot;{" "}
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-mint text-xs font-semibold no-underline hover:underline shrink-0"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(file.url, name)}
                  className="text-red-400 text-xs font-semibold hover:text-red-300 transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* URL Reference */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-sm font-bold text-midnight mb-2">
          Expected file names
        </h3>
        <p className="text-text-secondary text-xs mb-3">
          Upload files with these exact names so the resources page links work:
        </p>
        <ul className="space-y-1 text-xs font-mono text-text-secondary">
          <li>research_workflow_n8n.json</li>
          <li>AI_Agent_Workshop_OnePager.pdf</li>
          <li>agent_prompt.txt</li>
          <li>evaluation_prompt.txt</li>
        </ul>
      </div>
    </div>
  );
}
