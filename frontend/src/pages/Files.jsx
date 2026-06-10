import { useEffect, useState } from "react";
import { listFiles, deleteFile } from "../lib/api";

function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function Files() {
  const [files, setFiles] = useState(null);
  const [err, setErr] = useState(null);

  const load = async () => {
    try { setFiles(await listFiles()); }
    catch (e) { setErr(e.message); }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this file?")) return;
    try {
      await deleteFile(id);
      setFiles((cur) => cur.filter((f) => f._id !== id));
    } catch (e) { alert(e.response?.data?.error || e.message); }
  };

  if (err) return <p className="err">{err}</p>;
  if (!files) return <p>Loading…</p>;
  if (!files.length) return <p className="muted">No files yet. Upload some!</p>;

  return (
    <section>
      <h2>Files</h2>
      <div className="grid">
        {files.map((f) => (
          <div className="tile" key={f._id}>
            <div className="media">
              {f.fileType === "video" ? (
                <video src={f.secureUrl} controls preload="metadata" />
              ) : (
                <img src={f.secureUrl} alt={f.originalName} loading="lazy" />
              )}
            </div>
            <div className="meta">
              <div className="name" title={f.originalName}>{f.originalName}</div>
              <div className="sub">
                {fmtSize(f.fileSize)} · {new Date(f.uploadedAt).toLocaleString()}
              </div>
              <div className="row">
                <a className="btn" href={f.secureUrl} target="_blank" rel="noreferrer" download>
                  Download
                </a>
                <button className="btn danger" onClick={() => onDelete(f._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
