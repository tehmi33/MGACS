// -------------------------------
// ROOT FORM TYPE

import { Option } from "./common";

// -------------------------------
export interface VisitorRequest {
    residentType: ResidentType;
    visitDateTime: string;              // ISO string or yyyy-mm-dd format
    entryGate: Option<number>;            // integer ID from dropdown
    visitPurpose: string;
    destination: string;

    visitors: Visitor[];           // field array
    vehicles: Vehicle[];           // field array
}

// -------------------------------
// VISITOR TYPES
// -------------------------------
export interface Visitor {
    id: string;                    // uuid for field array usage
    type: "primary" | "adult" | "under18"
    name: string;
    cnic?: string;
    phone?: string;
}

// -------------------------------
// VEHICLE TYPE
// -------------------------------
export interface Vehicle {
    id: string;
    plateNo: string;
    color?: string;
    make?: string;
    model?: string;
}

export interface ResidentTypeOption {
    label: string;
    value: ResidentType;
    hours: number;
}

export type ResidentType = "family" | "utility" | "commercial";