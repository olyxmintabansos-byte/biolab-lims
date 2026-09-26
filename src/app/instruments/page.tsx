"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useLims } from "@/context/LimsContext";
import {
  Microscope,
  Play,
  Square,
  Plus,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Cpu,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function InstrumentsPage() {
  const { instruments, toggleInstrumentRun, advancePcrCycles } = useLims();

  const handleStep = (id: string, delta: number) => {
    advancePcrCycles(id, delta);
    confetti({
      particleCount: 25,
      spread: 45,
      colors: ["#0284C7", "#0369A1", "#0284C7"],
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
                THERMOCYCLING & SEQUENCING DECK
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">
                REAL-TIME ANALYZER HUD
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              MOLECULAR INSTRUMENTATION & PCR CYCLES
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Monitoring suhu blok peltier thermocycler, cycle threshold (Ct), dan status flow-cell sequencer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-700">
              3 ANALYZERS CALIBRATED
            </span>
          </div>
        </div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {instruments.map((inst) => {
            const isRunning =
              inst.status === "THERMOCYCLING" || inst.status === "SEQUENCING";
            const progressPct = Math.round((inst.currentCycle / inst.targetCycles) * 100);

            return (
              <div
                key={inst.id}
                className="bg-white border-2 border-slate-300 p-5 flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-3">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold">
                      {inst.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold border ${
                        isRunning
                          ? "bg-sky-100 text-sky-800 border-sky-400"
                          : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {inst.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{inst.model}</p>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2.5 bg-slate-50 border border-slate-300">
                      <span className="text-[10px] text-slate-500 uppercase block">SUHU BLOK</span>
                      <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-600" />
                        {inst.blockTemperatureC} °C
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-300">
                      <span className="text-[10px] text-slate-500 uppercase block">PROSES SIKLUS</span>
                      <span className="text-lg font-bold text-sky-700">
                        {inst.currentCycle}{" "}
                        <span className="text-xs text-slate-500 font-normal">/ {inst.targetCycles}</span>
                      </span>
                    </div>
                  </div>

                  {/* Flat Progress Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Kelengkapan Run:</span>
                      <span className="font-bold text-slate-900">{progressPct}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 border border-slate-400 p-0.5">
                      <div
                        className="h-full bg-sky-600 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">FORMAT DECK:</span>
                      <span className="font-bold text-slate-800">{inst.plateWellFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BATCH ACTIVE:</span>
                      <span className="font-bold text-slate-800">{inst.activeBatchCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">OPERATOR:</span>
                      <span className="font-bold text-slate-800">{inst.operatorId}</span>
                    </div>
                  </div>
                </div>

                {/* Instrument Control Buttons */}
                <div className="pt-3 border-t-2 border-slate-200 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStep(inst.id, 5)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-400 text-xs font-bold text-slate-800"
                    >
                      +5 SIKLUS
                    </button>
                    <button
                      onClick={() => handleStep(inst.id, 1)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-400 text-xs font-bold text-slate-800"
                    >
                      +1 SIKLUS
                    </button>
                  </div>

                  <button
                    onClick={() => toggleInstrumentRun(inst.id)}
                    className={`w-full py-2 font-bold text-xs flex items-center justify-center gap-2 border transition-colors ${
                      isRunning
                        ? "bg-red-600 hover:bg-red-700 text-white border-red-800"
                        : "bg-sky-600 hover:bg-sky-700 text-white border-sky-800"
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Square className="w-3.5 h-3.5" /> PAUSE / HALT RUN
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> START RUNNING
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
