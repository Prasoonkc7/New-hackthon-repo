export type Severity = "low" | "moderate" | "high" | "severe";
export type HazardType =
  | "flood"
  | "river_rise"
  | "landslide"
  | "blocked_road"
  | "damaged_bridge"
  | "damaged_home"
  | "infrastructure"
  | "other";

export type ReportStatus = "unverified" | "under_review" | "verified" | "rejected" | "resolved" | "outdated";
export type RescueStatus = "submitted" | "under_review" | "assigned" | "in_progress" | "resolved";
export type ReliefStatus = "pending" | "reviewed" | "matched" | "accepted" | "dispatched" | "delivered" | "cancelled";
export type RecoveryStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "info_required"
  | "approved"
  | "in_progress"
  | "completed"
  | "rejected";
export type Role = "public" | "citizen" | "responder" | "provider" | "admin";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Alert {
  id: string;
  title: string;
  district: string;
  municipality: string;
  hazard: HazardType;
  severity: Severity;
  source: string;
  publishedAt: string;
  updatedAt: string;
  verified: boolean;
  isDemo: boolean;
}

export interface HazardReport {
  id: string;
  hazard: HazardType;
  district?: string;
  municipality?: string;
  location?: GeoPoint;
  description: string;
  observedAt: string;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  source: "community" | "official";
  hasImage: boolean;
  reporterId?: string;
  isDemo: boolean;
}

export type RescueCategory =
  | "immediate_rescue"
  | "evacuation"
  | "medical"
  | "stranded_family"
  | "food_water"
  | "shelter"
  | "other";

export interface RescueRequest {
  id: string;
  reference: string;
  category: RescueCategory;
  urgency: "immediate_danger" | "urgent" | "standard";
  name?: string;
  phone?: string;
  contactMethod: "phone" | "sms" | "none";
  district: string;
  municipality: string;
  location?: GeoPoint;
  people: number;
  description: string;
  medicalConcerns?: string;
  hasImage: boolean;
  status: RescueStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  isDemo: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  district: string;
  municipality: string;
  address: string;
  location: GeoPoint;
  capacity?: number;
  occupancy?: number;
  water: boolean;
  food: boolean;
  medical: boolean;
  sanitation: boolean;
  accessible: boolean;
  contact?: string;
  verified: boolean;
  updatedAt: string;
  isDemo: boolean;
}

export type ReliefItem =
  | "food"
  | "water"
  | "blankets"
  | "hygiene"
  | "first_aid"
  | "medicine"
  | "accommodation"
  | "other";

export interface ReliefRequest {
  id: string;
  item: ReliefItem;
  quantity: number;
  area: string;
  district: string;
  urgency: "high" | "medium" | "low";
  status: ReliefStatus;
  provider?: string;
  updatedAt: string;
  createdAt: string;
  isDemo: boolean;
}

export interface InventoryItem {
  id: string;
  provider: string;
  item: ReliefItem;
  quantity: number;
  district: string;
  confirmed: boolean;
  updatedAt: string;
  location: GeoPoint;
  isDemo: boolean;
}

export type RecoveryType =
  | "home_damage"
  | "business_damage"
  | "agriculture"
  | "household_needs"
  | "temporary_housing"
  | "infrastructure"
  | "livelihood";

export interface RecoveryApplication {
  id: string;
  reference: string;
  type: RecoveryType;
  household: string;
  district: string;
  municipality: string;
  description: string;
  estimatedLoss?: number;
  hasEvidence: boolean;
  assessment: "community_reported" | "officially_assessed";
  status: RecoveryStatus;
  decisionNote?: string | undefined;
  history: { status: RecoveryStatus; at: string; note?: string | undefined }[];
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  isDemo: boolean;
}

export interface Facility {
  id: string;
  kind: "medical" | "relief_center";
  name: string;
  district: string;
  location: GeoPoint;
  updatedAt: string;
  verified: boolean;
  isDemo: boolean;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  kind: "status" | "report" | "rescue" | "recovery";
  read: boolean;
  createdAt: string;
}
