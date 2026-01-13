import { useEffect, useState } from "react";
import api from "../api/client";
import {
  ResidentTypeOption,
  VehicleTypeOption,
  VehicleMakeOption,
  VehicleModelOption,
  VehicleColorOption
} from "../types/VisitorRequest";
import {useFocusEffect} from '@react-navigation/native';
import { Option } from "../types/common";

export function useVisitCreate() {
  const [loading, setLoading] = useState(true);

  const [residentOptions, setResidentOptions] =
    useState<ResidentTypeOption[]>([]);
  const [checkpostOptions, setCheckpostOptions] =
    useState<Option<number>[]>([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] =
    useState<VehicleTypeOption[]>([]);
  const [vehicleMakeOptions, setVehicleMakeOptions] =
    useState<VehicleMakeOption[]>([]);
    const [vehicleModelOptions, setVehicleModelOptions] =
    useState<VehicleModelOption[]>([]);
  const [vehicleColorOptions, setVehicleColorOptions] =
    useState<VehicleColorOption[]>([]);

    
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await api.get("/visit/create");
        if (!mounted) return;

        /* ---------- Resident Types ---------- */
        setResidentOptions(
          data.visit_categories.map((c: any) => ({
            label: c.name,
            value: c.code,
            hours: c.duration,
          }))
        );

        /* ---------- Checkposts ---------- */
        setCheckpostOptions(
          data.checkposts.map((c: any) => ({
            label: c.name,
            value: c.id,
          }))
        );

        /* ---------- Vehicle Types ---------- */
        setVehicleTypeOptions(
          data.visit_vehicle_types.map((v: any) => ({
            label: v.name,
            value: v.code,
          }))
        );

        /* ---------- Vehicle Makes ---------- */
        setVehicleMakeOptions(
  data.template_vehicle_makes.map((m: string) => ({
    label: m,
    value: m,
  }))
);
 // ✅ MODELS
        setVehicleModelOptions(
          data.template_vehicle_models.map((m: string) => ({
            label: m,
            value: m,
          }))
        );

        // ✅ COLORS
        setVehicleColorOptions(
          data.template_vehicle_colors.map((c: string) => ({
            label: c,
            value: c,
          }))
        );
      } catch (e) {
        console.log("❌ visit/create failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    residentOptions,
    checkpostOptions,
    vehicleTypeOptions,
    vehicleMakeOptions,
    vehicleModelOptions,
    vehicleColorOptions
  };
}
