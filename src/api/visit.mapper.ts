import { VisitorRequest } from "../types/VisitorRequest";

/**
 * Converts VisitorRequest (react-hook-form state)
 * into multipart/form-data key–value pairs
 * exactly as required by backend (curl --form).
 */
export function mapVisitToFormData(
  data: VisitorRequest
): FormData {
  const formData = new FormData();

  /* =====================================================
     BASIC FIELDS (KEY → VALUE)
     ===================================================== */

  // visit_category_code=1
  formData.append(
    "visit_category_code",
    String(data.residentType)
  );

  // checkpost_id=2
  formData.append(
    "checkpost_id",
    String(data.entryGate)
  );

  // from=YYYY-MM-DDTHH:mm
if (data.visitDateTime) {
  const d = data.visitDateTime; // already LOCAL Date

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  formData.append('from', `${yyyy}-${mm}-${dd}T${hh}:${min}`);
}

  // purpose=Personal | Other text
  const purpose = data.isOtherPurpose
    ? data.otherPurpose
    : data.visitPurpose;

  if (purpose) {
    formData.append("purpose", purpose);
  }

  // destination=Block A
  if (data.destination) {
    formData.append("destination", data.destination);
  }

  /* =====================================================
     VISITORS (INDEXED KEY–VALUE PAIRS)
     Rules:
     - visitor[0] → primary (name + cnic + phone required)
     - visitor[1..n] → adult / child
     - child → name only
     ===================================================== */

  // Ensure primary visitor is ALWAYS index 0
  const sortedVisitors = [...data.visitors].sort((a, b) =>
    a.type === "primary" ? -1 : 1
  );

  sortedVisitors.forEach((v, index) => {
    if (!v.name) return;

    // visitor_full_name[0]=John
    formData.append(
      `visitor_full_name[${index}]`,
      v.name
    );

    // visitor_cnic[0]=xxxxx-xxxxxxx-x
 {
      formData.append(
        `visitor_cnic[${index}]`,
        v.cnic
      );
    }

    // visitor_mobile_no[0]=0300xxxxxxx
    {
      formData.append(
        `visitor_mobile_no[${index}]`,
        v.phone
      );
    }
  });

  /* =====================================================
     VEHICLES (INDEXED KEY–VALUE PAIRS)
     ===================================================== */

  data.vehicles?.forEach((v, index) => {
    // vehicle_type[0]=CAR | BIKE
    formData.append(
      `vehicle_type_code[${index}]`,
      (v.vehicle_type_code)
    );

    // vehicle_registration_no[0]=ABC-123
    formData.append(
      `vehicle_registration_no[${index}]`,
      v.plateNo
    );
{
      formData.append(
        `vehicle_make[${index}]`,
        (v.make)
      );
    }

    // vehicle_model[0]=Civic (optional)
     {
      formData.append(
        `vehicle_model[${index}]`,
        v.model
      );
    }

    // vehicle_color[0]=White (optional)
 {
      formData.append(
        `vehicle_color[${index}]`,
        v.color
      );
    }
  });

  /* =====================================================
     DEBUG (OPTIONAL – REMOVE IN PRODUCTION)
     ===================================================== */
console.log('FORM DATA:', formData);
// 🔍 DEBUG: Print FormData entries
console.log("📦 FORM DATA ENTRIES:");
for (const pair of (formData as any)._parts ?? []) {
  console.log(pair[0], ":", pair[1]);
}



  return formData;
}
