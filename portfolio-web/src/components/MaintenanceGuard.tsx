"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import SamekoSabaMaintenance from "./SamekoSabaMaintenance";

function MaintenanceGuardContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    if (searchParams.get("bypass") === "true" || searchParams.get("preview") === "true") {
      setBypassed(true);
      try {
        sessionStorage.setItem("saba_bypass_maintenance", "true");
      } catch {
        // storage disabled fallback
      }
    } else {
      try {
        if (sessionStorage.getItem("saba_bypass_maintenance") === "true") {
          setBypassed(true);
        }
      } catch {
        // storage disabled fallback
      }
    }
  }, [searchParams]);

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Dedicated maintenance route
  if (pathname === "/maintenance") {
    return (
      <SamekoSabaMaintenance
        onBypass={() => {
          setBypassed(true);
          try {
            sessionStorage.setItem("saba_bypass_maintenance", "true");
          } catch {}
        }}
      />
    );
  }

  // If global maintenance is enabled and user has not bypassed
  if (isMaintenanceMode && !bypassed) {
    return (
      <SamekoSabaMaintenance
        onBypass={() => {
          setBypassed(true);
          try {
            sessionStorage.setItem("saba_bypass_maintenance", "true");
          } catch {}
        }}
      />
    );
  }

  return <>{children}</>;
}

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <MaintenanceGuardContent>{children}</MaintenanceGuardContent>
    </Suspense>
  );
}
