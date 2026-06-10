import { useState } from "react";
import { uploadFiles } from "../lib/api";

export default function Upload() {
  const [secret, setSecret] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (!secret) return setErr("Access code is required.");
    if (!files.length) return setErr("Pick at least one file.");
    setBusy(true); setProgress(0);
    try {
      const res = await uploadFiles({ files, secret, onProgress: setProgress });
      setMsg(`Uploaded ${res.files.length} file(s).`);
      setFiles([]);
      e.target.reset();
    } catch (e2) {
      setErr(e2.response?.data?.error || e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>Upload</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Upload Access Code
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret code"
            autoComplete="off"
          />
        </label>
        <label>
          Files (images / videos)
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </label>
        {files.length > 0 && <small>{files.length} file(s) selected</small>}
        <button className="btn primary" disabled={busy}>
          {busy ? `Uploading… ${progress}%` : "Upload"}
        </button>
        {busy && (
          <div className="progress"><div style={{ width: `${progress}%` }} /></div>
        )}
        {msg && <p className="ok">{msg}</p>}
        {err && <p className="err">{err}</p>}
      </form>
    </section>
  );
}
