const CACHE_PREFIX = "jalrakshak-cache-v1:";
const QUEUE_KEY = "jalrakshak-offline-rescue-queue-v1";

export interface CacheEnvelope<T> {
  value: T;
  syncedAt: string;
}

export interface QueuedRescue {
  localId: string;
  createdAt: string;
  payload: Record<string, unknown>;
  evidence?: { name: string; type: string; dataUrl: string };
}

function read<T>(key: string): CacheEnvelope<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${CACHE_PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as CacheEnvelope<T>) : null;
  } catch {
    return null;
  }
}

export function readCached<T>(key: string): CacheEnvelope<T> | null {
  return read<T>(key);
}

export function writeCached<T>(key: string, value: T): CacheEnvelope<T> {
  const envelope = { value, syncedAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(envelope));
    } catch {
      // A full or unavailable browser store must not break online requests.
    }
  }
  return envelope;
}

export function readRescueQueue(): QueuedRescue[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(QUEUE_KEY) ?? "[]") as QueuedRescue[];
  } catch {
    return [];
  }
}

function saveRescueQueue(queue: QueuedRescue[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function queueRescue(item: QueuedRescue) {
  saveRescueQueue([...readRescueQueue(), item]);
}

export function removeQueuedRescue(localId: string) {
  saveRescueQueue(readRescueQueue().filter((item) => item.localId !== localId));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to preserve evidence for offline submission"));
    reader.readAsDataURL(file);
  });
}
