"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dna, Activity, RotateCcw, AlertTriangle, ShieldCheck, Microscope } from "lucide-react";
import { useLims } from "@/context/LimsContext";

export default function Navbar() {
  const pathname = usePathname();
  const { kpis, resetLimsData } = useLims();

  const navLinks = [
    { href: "/", label: "SPECIMEN ACCESSION", icon: Dna },
    { href: "/instruments/", label: "PCR & ANALYZER RUNS", icon: Microscope },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clinical Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 border border-sky-700 flex items-center justify-center text-white">
              <Dna className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 font-mono">
                  BIOLAB LIMS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 border border-slate-400 text-slate-800">
                  TITAN #33
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                CLINICAL PATHOLOGY & MOLECULAR DIAGNOSTICS
              </p>
            </div>
          </div>

          {/* Clinical Flat KPI Badges */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-xs">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-300 flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase">SPECIMENS ACC</span>
              <span className="font-bold text-slate-900">{kpis.totalSpecimensToday} SAMPLES</span>
            </div>
            <div className="px-3 py-1.5 bg-sky-50 border border-sky-300 flex flex-col">
              <span className="text-[9px] text-sky-700 uppercase">ACTIVE ANALYZERS</span>
              <span className="font-bold text-sky-800">{kpis.activePcrRuns} RUNNING</span>
            </div>
            <div className="px-3 py-1.5 bg-orange-50 border border-orange-300 flex flex-col">
              <span className="text-[9px] text-orange-700 uppercase">BSL-3 ISOLATION</span>
              <span className="font-bold text-orange-800">{kpis.bsl3ContainmentActive} BATCH</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetLimsData}
              title="Reset Sample Data"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-mono font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET</span>
            </button>
            <div className="px-2.5 py-1.5 bg-emerald-600 text-white font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 bg-white" />
              <span>GLP ISO-17025</span>
            </div>
          </div>
        </div>

        {/* Flat Tabs Navigation */}
        <nav className="flex space-x-1 py-1 overflow-x-auto scrollbar-none border-t border-slate-200">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (tab.href !== "/" && pathname?.startsWith(tab.href.replace(/\/$/, "")));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "bg-sky-50 border-sky-600 text-sky-800"
                    : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-600" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
