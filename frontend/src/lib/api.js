import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:2567";
export const api = axios.create({ baseURL });

export async function listFiles() {
  const { data } = await api.get("/api/files");
  return data.files;
}

export async function deleteFile(id) {
  const { data } = await api.delete(`/api/files/${id}`);
  return data;
}

export async function uploadFiles({ files, secret, onProgress }) {
  const form = new FormData();
  for (const f of files) form.append("files", f);
  const { data } = await api.post("/api/files/upload", form, {
    headers: { "x-upload-secret": secret },
    onUploadProgress: (e) => {
      if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data;
}
