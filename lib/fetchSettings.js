export async function fetchSettings() {
  try {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    return data.settings || {};
  } catch (err) {
    console.error("fetchSettings error:", err);
    return {};
  }
}
