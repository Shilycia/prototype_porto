import React from "react";
import type { Metadata } from "next";
import SamekoSabaMaintenance from "../../components/SamekoSabaMaintenance";

export const metadata: Metadata = {
  title: "Under Maintenance | Sameko Saba Lighthouse",
  description: "Web portofolio sedang dalam perbaikan bersama Sameko Saba & Kaniki Engineering.",
};

export default function MaintenancePage() {
  return <SamekoSabaMaintenance />;
}
