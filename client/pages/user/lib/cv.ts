/* ── CV helpers ── */

export function resolveCvUrl(cvUrl: string | undefined): string {
  if (!cvUrl) return "";
  if (cvUrl.startsWith("http://") || cvUrl.startsWith("https://")) return cvUrl;
  const backendOrigin =
    (import.meta as any).env?.VITE_API_URL ??
    `${window.location.protocol}//${window.location.hostname}:5000`;
  const p = cvUrl.startsWith("/") ? cvUrl : `/${cvUrl}`;
  return `${backendOrigin}${p}`;
}

export async function downloadCv(url: string, filename: string): Promise<void> {
  if (!url) return;
  const dlName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  try {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = dlName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
