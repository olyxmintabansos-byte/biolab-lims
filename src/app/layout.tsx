import type { Metadata } from "next";
import "./globals.css";
import { LimsProvider } from "@/context/LimsContext";

export const metadata: Metadata = {
  title: "BioLab LIMS // Clinical Pathology & Molecular Diagnostics (Titan #33)",
  description: "Enterprise Clinical Laboratory Information Management System dibangun dengan Flat Design dan Sterile Grid.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased font-sans">
        <LimsProvider>{children}</LimsProvider>
      </body>
    </html>
  );
}
