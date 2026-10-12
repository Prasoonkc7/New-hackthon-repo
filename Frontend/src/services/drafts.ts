const PREFIX = "jalrakshak-draft-";

export function readDraft<T>(name: string): Partial<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${PREFIX}${name}`);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

export function writeDraft<T>(name: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${PREFIX}${name}`, JSON.stringify(value));
}

export function clearDraft(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${PREFIX}${name}`);
}
