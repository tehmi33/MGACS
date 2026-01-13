import { Option } from "./common";

/* -------------------------------
 ROOT FORM TYPE
-------------------------------- */

export interface VisitorRequest {
  // Resident category code (from visit/create)
  residentType: number;               // visit_category_code

  // Visit start datetime
 visitDateTime?: Date;           // ISO string

  // Checkpost id
  entryGate: number;                  // checkpost_id

  // Purpose & destination (plain text)
  visitPurpose: string;
  isOtherPurpose?: boolean;
  otherPurpose?: string;
  destination: string;

  // Field arrays
  visitors: Visitor[];
  vehicles: Vehicle[];
}

/* -------------------------------
 VISITOR
-------------------------------- */

export interface Visitor {
  id: string;                         // uuid (frontend only)
  type: "primary" | "adult" | "under18";
  name: string;
  cnic?: string;
  phone?: string;
}

/* -------------------------------
 VEHICLE
-------------------------------- */

export interface Vehicle {
  id: string;                         // uuid (frontend only)
  vehicle_type_code: number;
  // Comes from /visit/create
  typeCode: number;                   // CAR | BIKE

  plateNo: string;

  // Optional fields
  make?: string;                    // dropdown from backend
  model?: string;
  color?: string;
}

/* -------------------------------
 VISIT CREATE RESPONSE TYPES
-------------------------------- */

export interface ResidentTypeOption {
  label: string;                      // UI
  value: number;                      // code → backend
  hours: number;                      // info only
}

export interface CheckpostOption extends Option<number> {}

export interface VehicleTypeOption extends Option<string> {}

export interface VehicleMakeOption extends Option<any> {}
export interface VehicleModelOption extends Option<string> {}
export interface VehicleColorOption extends Option<string> {}
