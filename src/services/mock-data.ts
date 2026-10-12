// Explicitly fictional demo data. Coordinates are approximate municipality
// centres used for demonstration only — none of these are real incidents.
import type {
  ActivityEntry,
  Alert,
  Facility,
  HazardReport,
  InventoryItem,
  RecoveryApplication,
  ReliefRequest,
  RescueRequest,
  Shelter,
} from "@/lib/types";

export const DISTRICTS: { district: string; municipality: string; lat: number; lng: number }[] = [
  { district: "Kathmandu", municipality: "Kathmandu Metropolitan", lat: 27.7172, lng: 85.324 },
  { district: "Lalitpur", municipality: "Lalitpur Metropolitan", lat: 27.6644, lng: 85.3188 },
  { district: "Sindhupalchok", municipality: "Melamchi", lat: 27.8333, lng: 85.5667 },
  { district: "Chitwan", municipality: "Bharatpur Metropolitan", lat: 27.6833, lng: 84.4333 },
  { district: "Sunsari", municipality: "Itahari Sub-Metropolitan", lat: 26.6646, lng: 87.2718 },
  { district: "Morang", municipality: "Biratnagar Metropolitan", lat: 26.4525, lng: 87.2718 },
  { district: "Kailali", municipality: "Dhangadhi Sub-Metropolitan", lat: 28.6852, lng: 80.6216 },
  { district: "Bardiya", municipality: "Gulariya", lat: 28.2333, lng: 81.35 },
  { district: "Kavrepalanchok", municipality: "Dhulikhel", lat: 27.6253, lng: 85.5561 },
  { district: "Dhading", municipality: "Nilkantha", lat: 27.9167, lng: 84.9 },
  { district: "Saptari", municipality: "Rajbiraj", lat: 26.5333, lng: 86.75 },
  { district: "Jhapa", municipality: "Birtamod", lat: 26.6439, lng: 87.9892 },
];

const d = (name: string) => DISTRICTS.find((x) => x.district === name)!;
const ago = (now: number, hours: number) => new Date(now - hours * 3600_000).toISOString();
const off = (p: { lat: number; lng: number }, a: number, b: number) => ({ lat: p.lat + a, lng: p.lng + b });

export interface Db {
  alerts: Alert[];
  reports: HazardReport[];
  rescues: RescueRequest[];
  shelters: Shelter[];
  relief: ReliefRequest[];
  inventory: InventoryItem[];
  recovery: RecoveryApplication[];
  facilities: Facility[];
  activity: ActivityEntry[];
}

export function buildSeed(now = Date.now()): Db {
  const src = "JalRakshak demo dataset";
  return {
    alerts: [
      { id: "al1", title: "[DEMO] River level watch — Koshi basin", district: "Sunsari", municipality: d("Sunsari").municipality, hazard: "river_rise", severity: "high", source: src, publishedAt: ago(now, 5), updatedAt: ago(now, 2), verified: true, isDemo: true },
      { id: "al2", title: "[DEMO] Landslide risk advisory — hill roads", district: "Sindhupalchok", municipality: "Melamchi", hazard: "landslide", severity: "moderate", source: src, publishedAt: ago(now, 20), updatedAt: ago(now, 9), verified: true, isDemo: true },
      { id: "al3", title: "[DEMO] Localized flooding reported in low-lying wards", district: "Bardiya", municipality: "Gulariya", hazard: "flood", severity: "severe", source: src, publishedAt: ago(now, 3), updatedAt: ago(now, 1), verified: false, isDemo: true },
    ],
    reports: [
      { id: "r1", hazard: "flood", district: "Bardiya", municipality: "Gulariya", location: off(d("Bardiya"), 0.01, 0.02), description: "Water entering homes near the canal, roughly knee deep.", observedAt: ago(now, 4), createdAt: ago(now, 4), updatedAt: ago(now, 2), status: "verified", source: "community", hasImage: true, isDemo: true },
      { id: "r2", hazard: "landslide", district: "Sindhupalchok", municipality: "Melamchi", location: off(d("Sindhupalchok"), 0.02, -0.01), description: "Debris on slope above the road, small rocks still falling.", observedAt: ago(now, 10), createdAt: ago(now, 9), updatedAt: ago(now, 9), status: "under_review", source: "community", hasImage: false, isDemo: true },
      { id: "r3", hazard: "blocked_road", district: "Dhading", municipality: "Nilkantha", location: off(d("Dhading"), -0.03, 0.04), description: "Road section covered with mud. Vehicles turning back.", observedAt: ago(now, 6), createdAt: ago(now, 6), updatedAt: ago(now, 6), status: "unverified", source: "community", hasImage: false, isDemo: true },
      { id: "r4", hazard: "damaged_bridge", district: "Kailali", municipality: d("Kailali").municipality, location: off(d("Kailali"), 0.04, 0.03), description: "Suspension bridge cables look loose after strong current.", observedAt: ago(now, 30), createdAt: ago(now, 29), updatedAt: ago(now, 12), status: "verified", source: "official", hasImage: true, isDemo: true },
      { id: "r5", hazard: "river_rise", district: "Sunsari", municipality: d("Sunsari").municipality, location: off(d("Sunsari"), 0.05, 0.02), description: "River visibly higher than yesterday evening.", observedAt: ago(now, 3), createdAt: ago(now, 3), updatedAt: ago(now, 3), status: "unverified", source: "community", hasImage: false, isDemo: true },
      { id: "r6", hazard: "flood", district: "Saptari", municipality: "Rajbiraj", location: off(d("Saptari"), 0.01, -0.02), description: "Fields flooded, standing water on village track.", observedAt: ago(now, 50), createdAt: ago(now, 50), updatedAt: ago(now, 48), status: "outdated", source: "community", hasImage: false, isDemo: true },
    ],
    rescues: [
      { id: "s1", reference: "JR-RQ-1042", category: "stranded_family", urgency: "immediate_danger", contactMethod: "phone", district: "Bardiya", municipality: "Gulariya", location: off(d("Bardiya"), 0.015, 0.025), people: 5, description: "Family of five on rooftop, water rising.", hasImage: false, status: "assigned", assignedTo: "Demo Response Team A", createdAt: ago(now, 3), updatedAt: ago(now, 1), isDemo: true },
      { id: "s2", reference: "JR-RQ-1043", category: "medical", urgency: "urgent", contactMethod: "sms", district: "Sunsari", municipality: d("Sunsari").municipality, location: off(d("Sunsari"), -0.01, 0.01), people: 1, description: "Elderly person needs regular medication, pharmacy closed.", medicalConcerns: "Diabetes medication", hasImage: false, status: "under_review", createdAt: ago(now, 5), updatedAt: ago(now, 4), isDemo: true },
      { id: "s3", reference: "JR-RQ-1044", category: "food_water", urgency: "standard", contactMethod: "none", district: "Saptari", municipality: "Rajbiraj", people: 12, description: "Several households without clean drinking water.", hasImage: false, status: "submitted", createdAt: ago(now, 2), updatedAt: ago(now, 2), isDemo: true },
      { id: "s4", reference: "JR-RQ-1039", category: "evacuation", urgency: "urgent", contactMethod: "phone", district: "Sindhupalchok", municipality: "Melamchi", location: off(d("Sindhupalchok"), 0.01, 0.01), people: 3, description: "Cracks on slope behind house, need help moving.", hasImage: false, status: "resolved", assignedTo: "Demo Volunteer Group", createdAt: ago(now, 40), updatedAt: ago(now, 20), isDemo: true },
    ],
    shelters: [
      { id: "h1", name: "[DEMO] Gulariya Community School Shelter", district: "Bardiya", municipality: "Gulariya", address: "Ward 4, near main school (approx.)", location: off(d("Bardiya"), -0.01, -0.01), capacity: 250, occupancy: 180, water: true, food: true, medical: false, sanitation: true, accessible: true, contact: "Demo shelter desk", verified: true, updatedAt: ago(now, 2), isDemo: true },
      { id: "h2", name: "[DEMO] Itahari Ward Hall", district: "Sunsari", municipality: d("Sunsari").municipality, address: "Ward office hall (approx.)", location: off(d("Sunsari"), 0.01, -0.02), capacity: 120, occupancy: 40, water: true, food: false, medical: true, sanitation: true, accessible: false, verified: true, updatedAt: ago(now, 6), isDemo: true },
      { id: "h3", name: "[DEMO] Melamchi Temporary Camp", district: "Sindhupalchok", municipality: "Melamchi", address: "Open ground near bazaar (approx.)", location: off(d("Sindhupalchok"), -0.02, 0.01), water: true, food: true, medical: true, sanitation: false, accessible: false, verified: false, updatedAt: ago(now, 30), isDemo: true },
      { id: "h4", name: "[DEMO] Rajbiraj Multipurpose Building", district: "Saptari", municipality: "Rajbiraj", address: "Municipal compound (approx.)", location: off(d("Saptari"), -0.01, 0.01), capacity: 300, occupancy: 295, water: true, food: true, medical: true, sanitation: true, accessible: true, verified: true, updatedAt: ago(now, 3), isDemo: true },
    ],
    relief: [
      { id: "f1", item: "water", quantity: 200, area: "Gulariya ward 4 (general area)", district: "Bardiya", urgency: "high", status: "matched", provider: "Demo Relief Org", createdAt: ago(now, 6), updatedAt: ago(now, 2), isDemo: true },
      { id: "f2", item: "blankets", quantity: 80, area: "Rajbiraj (general area)", district: "Saptari", urgency: "medium", status: "pending", createdAt: ago(now, 4), updatedAt: ago(now, 4), isDemo: true },
      { id: "f3", item: "medicine", quantity: 30, area: "Itahari (general area)", district: "Sunsari", urgency: "high", status: "reviewed", createdAt: ago(now, 8), updatedAt: ago(now, 5), isDemo: true },
      { id: "f4", item: "hygiene", quantity: 60, area: "Melamchi (general area)", district: "Sindhupalchok", urgency: "low", status: "delivered", provider: "Demo Youth Club", createdAt: ago(now, 50), updatedAt: ago(now, 24), isDemo: true },
    ],
    inventory: [
      { id: "i1", provider: "Demo Relief Org", item: "water", quantity: 500, district: "Bardiya", confirmed: true, updatedAt: ago(now, 3), location: off(d("Bardiya"), 0.03, -0.02), isDemo: true },
      { id: "i2", provider: "Demo Relief Org", item: "food", quantity: 150, district: "Bardiya", confirmed: true, updatedAt: ago(now, 3), location: off(d("Bardiya"), 0.03, -0.02), isDemo: true },
      { id: "i3", provider: "Demo Youth Club", item: "blankets", quantity: 40, district: "Sindhupalchok", confirmed: false, updatedAt: ago(now, 26), location: off(d("Sindhupalchok"), 0.0, 0.03), isDemo: true },
      { id: "i4", provider: "Demo Health Post Network", item: "first_aid", quantity: 70, district: "Sunsari", confirmed: true, updatedAt: ago(now, 7), location: off(d("Sunsari"), 0.02, 0.03), isDemo: true },
    ],
    recovery: [
      { id: "v1", reference: "JR-RC-2201", type: "home_damage", household: "Demo Household A", district: "Bardiya", municipality: "Gulariya", description: "Mud walls partially collapsed, roof intact.", estimatedLoss: 350000, hasEvidence: true, assessment: "community_reported", status: "under_review", history: [{ status: "submitted", at: ago(now, 48) }, { status: "under_review", at: ago(now, 24) }], createdAt: ago(now, 48), updatedAt: ago(now, 24), ownerId: "demo-citizen", isDemo: true },
      { id: "v2", reference: "JR-RC-2202", type: "agriculture", household: "Demo Household B", district: "Saptari", municipality: "Rajbiraj", description: "Paddy field submerged for three days.", estimatedLoss: 120000, hasEvidence: false, assessment: "community_reported", status: "info_required", decisionNote: "Please add approximate field area.", history: [{ status: "submitted", at: ago(now, 70) }, { status: "under_review", at: ago(now, 50) }, { status: "info_required", at: ago(now, 30), note: "Please add approximate field area." }], createdAt: ago(now, 70), updatedAt: ago(now, 30), isDemo: true },
    ],
    facilities: [
      { id: "m1", kind: "medical", name: "[DEMO] District health post", district: "Bardiya", location: off(d("Bardiya"), -0.02, 0.03), updatedAt: ago(now, 10), verified: true, isDemo: true },
      { id: "m2", kind: "medical", name: "[DEMO] Mobile medical camp", district: "Sunsari", location: off(d("Sunsari"), -0.03, -0.01), updatedAt: ago(now, 5), verified: false, isDemo: true },
      { id: "c1", kind: "relief_center", name: "[DEMO] Relief distribution point", district: "Saptari", location: off(d("Saptari"), 0.02, 0.02), updatedAt: ago(now, 4), verified: true, isDemo: true },
    ],
    activity: [
      { id: "a1", actor: "Demo Admin", action: "Verified report", target: "r1", at: ago(now, 2) },
      { id: "a2", actor: "Demo Admin", action: "Assigned rescue request", target: "JR-RQ-1042", at: ago(now, 1) },
      { id: "a3", actor: "Demo Admin", action: "Requested more information", target: "JR-RC-2202", at: ago(now, 30) },
    ],
  };
}
