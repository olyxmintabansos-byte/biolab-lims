"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useLims } from "@/context/LimsContext";
import {
  Activity,
  Snowflake,
  Package,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  ShieldCheck,
  ThermometerSnowflake,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ReagentsInventoryPage() {
  const { reagents, decrementReagent, restockReagent, cryoUnit, toggleCryoLn2 } = useLims();

  const handleRestock = (id: string) => {
    restockReagent(id, 10);
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ["#0284C7", "#059669", "#0F172A"],
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Flat Header Banner */}
        <div className="bg-white border-2 border-slate-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-sky-600 text-white font-mono text-[10px] font-bold">
                GLP LOT TRACEABILITY
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">
                COLD-CHAIN REAGENTS & ULTRA-LOW TEMPERATURE
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              REAGENT INVENTORY & -80°C CRYO STORAGE
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Manajemen lot enzim PCR, magnetic beads, kontrol kuantitas minimum, dan status telemetri nitrogen cair LN₂.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-700">
              {reagents.length} REAGENT LOTS AUDITED
            </span>
          </div>
        </div>

        {/* 2-Column: Left Cryo ULT Freezer Telemetry, Right Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Cryo Freezer Telemetry Block */}
          <div className="lg:col-span-1 bg-white border-2 border-slate-300 p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-3">
                <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold">
                  {cryoUnit.id}
                </span>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-400 text-[10px] font-bold flex items-center gap-1">
                  <Snowflake className="w-3 h-3" />
                  ULT ACTIVE
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {cryoUnit.name}
              </h3>

              {/* Temperature Display */}
              <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-300 text-center space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">SUHU AKTUAL CRYO</span>
                <div className="text-3xl font-black text-sky-800 tracking-tight flex items-center justify-center gap-2">
                  <ThermometerSnowflake className="w-7 h-7 text-sky-600" />
                  {cryoUnit.currentTempC} °C
                </div>
                <p className="text-[11px] text-emerald-700 font-bold">
                  TARGET: {cryoUnit.targetTempC} °C // NOMINAL STABLE
                </p>
              </div>

              {/* LN2 Backup armed */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">BACKUP NITROGEN (LN₂):</span>
                  <span className="font-bold text-sky-700">{cryoUnit.ln2BackupStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RACK UTILIZATION:</span>
                  <span className="font-bold text-slate-800">
                    {cryoUnit.occupiedSlots} / {cryoUnit.totalRacks} Racks
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TERAKHIR DEFROST:</span>
                  <span className="font-bold text-slate-800">{cryoUnit.lastDefrostDate}</span>
                </div>
              </div>
            </div>

            <button
              onClick={toggleCryoLn2}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-400 text-xs font-bold text-slate-800 transition-colors"
            >
              TOGGLE LN₂ BACKUP VALVES
            </button>
          </div>

          {/* Reagents Master Matrix Table */}
          <div className="lg:col-span-2 bg-white border-2 border-slate-300 p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                ACTIVE REAGENT LOT INVENTORY & EXPIRY AUDIT
              </h2>
              <span className="text-xs text-slate-500">GLP / ISO-17025 VERIFIED</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-slate-100 border-b-2 border-slate-300 text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2.5 border-r border-slate-300">NAMA REAGEN</th>
                    <th className="p-2.5 border-r border-slate-300">LOT / CATALOG</th>
                    <th className="p-2.5 border-r border-slate-300">STORAGE</th>
                    <th className="p-2.5 border-r border-slate-300">EXPIRED</th>
                    <th className="p-2.5 border-r border-slate-300">STOK</th>
                    <th className="p-2.5 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reagents.map((r) => {
                    const isLow = r.remainingQuantity <= r.minimumThreshold;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                          {r.name}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">
                          <div>{r.lotNumber}</div>
                          <div className="text-[10px] text-slate-500">{r.catalogNumber}</div>
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-[10px] font-bold">
                            {r.storageCondition}
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">
                          {r.expirationDate}
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold ${
                                isLow ? "text-orange-600" : "text-slate-900"
                              }`}
                            >
                              {r.remainingQuantity}
                            </span>
                            <span className="text-[10px] text-slate-500">{r.unit}</span>
                          </div>
                          {isLow && (
                            <span className="text-[9px] px-1 py-0.2 bg-orange-100 text-orange-800 border border-orange-400 font-bold">
                              LOW STOCK
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right space-x-1">
                          <button
                            onClick={() => decrementReagent(r.id)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700"
                            title="Pakai 1 Unit"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRestock(r.id)}
                            className="p-1 bg-sky-100 hover:bg-sky-200 border border-sky-400 text-sky-800 font-bold"
                            title="Restock +10 Unit"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
