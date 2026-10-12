/**
 * Centralised data service. UI code must only talk to `api`.
 * - Mock mode (default): conforms to the same interfaces, persists fictional
 *   demo records in this browser only (personal contact fields are never persisted).
 * - Backend mode: set VITE_API_BASE_URL to a Flask REST API implementing the
 *   proposed contract below. Authorization MUST be enforced by that backend.
 */
import type {
  ActivityEntry,
  Alert,
  Facility,
  HazardReport,
  InventoryItem,
  RecoveryApplication,
  RecoveryStatus,
  ReliefRequest,
  ReliefStatus,
  ReportStatus,
  RescueRequest,
  RescueStatus,
  Shelter,
} from "@/lib/types";
import { buildSeed, type Db } from "./mock-data";

export const API_BASE_URL: string = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";
export const IS_MOCK = !API_BASE_URL;

export type NewReport = Omit<HazardReport, "id" | "createdAt" | "updatedAt" | "status" | "source" | "isDemo">;
export type NewRescue = Omit<RescueRequest, "id" | "reference" | "status" | "createdAt" | "updatedAt" | "isDemo" | "assignedTo">;
export type NewRelief = Omit<ReliefRequest, "id" | "status" | "createdAt" | "updatedAt" | "isDemo" | "provider">;
export type NewInventory = Omit<InventoryItem, "id" | "updatedAt" | "isDemo" | "confirmed">;
export type NewRecovery = Omit<RecoveryApplication, "id" | "reference" | "status" | "history" | "createdAt" | "updatedAt" | "isDemo" | "assessment" | "decisionNote">;

export interface ApiService {
  getAlerts(): Promise<Alert[]>;
  getReports(): Promise<HazardReport[]>;
  createReport(r: NewReport): Promise<HazardReport>;
  verifyReport(id: string, status: ReportStatus, actor: string): Promise<HazardReport>;
  getRescueRequests(): Promise<RescueRequest[]>;
  getRescueByReference(ref: string): Promise<RescueRequest | null>;
  createRescueRequest(r: NewRescue): Promise<RescueRequest>;
  updateRescueStatus(id: string, status: RescueStatus, actor: string, assignedTo?: string): Promise<RescueRequest>;
  getShelters(): Promise<Shelter[]>;
  submitShelterUpdate(id: string, patch: Pick<Shelter, "occupancy" | "food" | "water" | "medical">, actor: string): Promise<Shelter>;
  verifyShelter(id: string, verified: boolean, actor: string): Promise<Shelter>;
  getFacilities(): Promise<Facility[]>;
  getReliefRequests(): Promise<ReliefRequest[]>;
  createReliefRequest(r: NewRelief): Promise<ReliefRequest>;
  updateReliefStatus(id: string, status: ReliefStatus, actor: string, provider?: string): Promise<ReliefRequest>;
  getInventory(): Promise<InventoryItem[]>;
  addInventory(i: NewInventory): Promise<InventoryItem>;
  updateInventory(id: string, quantity: number, confirmed: boolean, actor: string): Promise<InventoryItem>;
  getRecoveryApplications(): Promise<RecoveryApplication[]>;
  createRecoveryApplication(a: NewRecovery): Promise<RecoveryApplication>;
  decideRecovery(id: string, status: RecoveryStatus, note: string, actor: string): Promise<RecoveryApplication>;
  getActivity(): Promise<ActivityEntry[]>;
}

/* ---------------- HTTP adapter (Flask) ---------------- */
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}
const body = (b: unknown) => ({ body: JSON.stringify(b) });

const httpApi: ApiService = {
  getAlerts: () => http("/api/alerts"),
  getReports: () => http("/api/reports"),
  createReport: (r) => http("/api/reports", { method: "POST", ...body(r) }),
  verifyReport: (id, status) => http(`/api/admin/reports/${id}/verify`, { method: "PATCH", ...body({ status }) }),
  getRescueRequests: () => http("/api/rescue-requests"),
  getRescueByReference: (ref) => http(`/api/rescue-requests?reference=${encodeURIComponent(ref)}`),
  createRescueRequest: (r) => http("/api/rescue-requests", { method: "POST", ...body(r) }),
  updateRescueStatus: (id, status, _a, assignedTo) =>
    http(`/api/admin/rescue-requests/${id}/status`, { method: "PATCH", ...body({ status, assignedTo }) }),
  getShelters: () => http("/api/shelters"),
  submitShelterUpdate: (id, patch) => http(`/api/shelters/${id}`, { method: "PATCH", ...body(patch) }),
  verifyShelter: (id, verified) => http(`/api/admin/shelters/${id}/verify`, { method: "PATCH", ...body({ verified }) }),
  getFacilities: () => http("/api/facilities"),
  getReliefRequests: () => http("/api/relief-requests"),
  createReliefRequest: (r) => http("/api/relief-requests", { method: "POST", ...body(r) }),
  updateReliefStatus: (id, status, _a, provider) =>
    http(`/api/relief-requests/${id}/status`, { method: "PATCH", ...body({ status, provider }) }),
  getInventory: () => http("/api/inventory"),
  addInventory: (i) => http("/api/inventory", { method: "POST", ...body(i) }),
  updateInventory: (id, quantity, confirmed) => http(`/api/inventory/${id}`, { method: "PATCH", ...body({ quantity, confirmed }) }),
  getRecoveryApplications: () => http("/api/recovery-applications"),
  createRecoveryApplication: (a) => http("/api/recovery-applications", { method: "POST", ...body(a) }),
  decideRecovery: (id, status, note) =>
    http(`/api/admin/recovery-applications/${id}/decision`, { method: "PATCH", ...body({ status, note }) }),
  getActivity: () => http("/api/admin/activity"),
};

/* ---------------- Mock adapter ---------------- */
const KEY = "jalrakshak-demo-db-v1";
let db: Db | null = null;

function load(): Db {
  if (db) return db;
  if (typeof window === "undefined") return buildSeed();
  try {
    const raw = window.localStorage.getItem(KEY);
    db = raw ? (JSON.parse(raw) as Db) : buildSeed();
  } catch {
    db = buildSeed();
  }
  return db;
}
function save() {
  if (!db || typeof window === "undefined") return;
  // Never persist personal contact details in browser storage.
  const safe: Db = { ...db, rescues: db.rescues.map(({ name: _n, phone: _p, ...r }) => r) };
  window.localStorage.setItem(KEY, JSON.stringify(safe));
}
export function resetDemoData() {
  db = buildSeed();
  save();
}

const delay = <T,>(v: T, ms = 350) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID().slice(0, 8);
const refNo = (p: string) => `JR-${p}-${Math.floor(1000 + Math.random() * 9000)}`;
function log(actor: string, action: string, target: string) {
  load().activity.unshift({ id: uid(), actor, action, target, at: now() });
}
function patch<T extends { id: string; updatedAt: string }>(list: T[], id: string, p: Partial<T>): T {
  const item = list.find((x) => x.id === id);
  if (!item) throw new Error("Record not found");
  Object.assign(item, p, { updatedAt: now() });
  save();
  return item;
}

const mockApi: ApiService = {
  getAlerts: () => delay(load().alerts),
  getReports: () => delay(load().reports),
  async createReport(r) {
    const rec: HazardReport = { ...r, id: uid(), createdAt: now(), updatedAt: now(), status: "unverified", source: "community", isDemo: true };
    load().reports.unshift(rec);
    save();
    return delay(rec, 600);
  },
  async verifyReport(id, status, actor) {
    const r = patch(load().reports, id, { status });
    log(actor, `Set report status: ${status}`, id);
    save();
    return delay(r);
  },
  getRescueRequests: () => delay(load().rescues),
  getRescueByReference: (ref) => delay(load().rescues.find((r) => r.reference.toUpperCase() === ref.trim().toUpperCase()) ?? null),
  async createRescueRequest(r) {
    const rec: RescueRequest = { ...r, id: uid(), reference: refNo("RQ"), status: "submitted", createdAt: now(), updatedAt: now(), isDemo: true };
    load().rescues.unshift(rec);
    save();
    return delay(rec, 700);
  },
  async updateRescueStatus(id, status, actor, assignedTo) {
    const r = patch(load().rescues, id, assignedTo ? { status, assignedTo } : { status });
    log(actor, `Rescue status: ${status}${assignedTo ? ` → ${assignedTo}` : ""}`, r.reference);
    save();
    return delay(r);
  },
  getShelters: () => delay(load().shelters),
  async submitShelterUpdate(id, p, actor) {
    // Manager updates require re-verification.
    const s = patch(load().shelters, id, { ...p, verified: false });
    log(actor, "Submitted shelter update (needs verification)", s.name);
    save();
    return delay(s);
  },
  async verifyShelter(id, verified, actor) {
    const s = patch(load().shelters, id, { verified });
    log(actor, verified ? "Verified shelter" : "Marked shelter unverified", s.name);
    save();
    return delay(s);
  },
  getFacilities: () => delay(load().facilities),
  getReliefRequests: () => delay(load().relief),
  async createReliefRequest(r) {
    const rec: ReliefRequest = { ...r, id: uid(), status: "pending", createdAt: now(), updatedAt: now(), isDemo: true };
    load().relief.unshift(rec);
    save();
    return delay(rec, 600);
  },
  async updateReliefStatus(id, status, actor, provider) {
    const r = patch(load().relief, id, provider ? { status, provider } : { status });
    log(actor, `Relief status: ${status}`, id);
    save();
    return delay(r);
  },
  getInventory: () => delay(load().inventory),
  async addInventory(i) {
    const rec: InventoryItem = { ...i, id: uid(), updatedAt: now(), confirmed: false, isDemo: true };
    load().inventory.unshift(rec);
    save();
    return delay(rec);
  },
  async updateInventory(id, quantity, confirmed, actor) {
    const r = patch(load().inventory, id, { quantity, confirmed });
    log(actor, `Inventory updated (${quantity}${confirmed ? ", confirmed" : ""})`, r.provider);
    save();
    return delay(r);
  },
  getRecoveryApplications: () => delay(load().recovery),
  async createRecoveryApplication(a) {
    const t = now();
    const rec: RecoveryApplication = { ...a, id: uid(), reference: refNo("RC"), status: "submitted", assessment: "community_reported", history: [{ status: "submitted", at: t }], createdAt: t, updatedAt: t, isDemo: true };
    load().recovery.unshift(rec);
    save();
    return delay(rec, 600);
  },
  async decideRecovery(id, status, note, actor) {
    const list = load().recovery;
    const a = list.find((x) => x.id === id);
    if (!a) throw new Error("Record not found");
    a.history.push({ status, at: now(), note: note || undefined });
    const r = patch(list, id, { status, decisionNote: note || a.decisionNote });
    log(actor, `Recovery decision: ${status}`, r.reference);
    save();
    return delay(r);
  },
  getActivity: () => delay(load().activity),
};

export const api: ApiService = IS_MOCK ? mockApi : httpApi;

/** Simple distance (km) for duplicate detection. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
