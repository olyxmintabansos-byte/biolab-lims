"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLims } from "@/context/LimsContext";
import {
  Dna,
  Plus,
  QrCode,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  TestTube,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import { SpecimenType, BslLevel } from "@/types/lims";

export default function SpecimenAccessionPage() {
  const { samples, selectedSampleId, setSelectedSampleId, advanceSampleStatus, addSample } =
    useLims();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newPatient, setNewPatient] = useState("");
  const [newType, setNewType] = useState<SpecimenType>("WHOLE_BLOOD_EDTA");
  const [newBsl, setNewBsl] = useState<BslLevel>("BSL-2 (Moderate Hazard)");
  const [newVolume, setNewVolume] = useState(2.0);
  const [newLocation, setNewLocation] = useState("COLD-4C // TRAY-05");
  const [newTest, setNewTest] = useState("Molecular Genetics Panel");

  const filtered = samples.filter((s) => {
    const matchesSearch =
      s.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.patientAnonymousId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.testRequested.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || s.specimenType === filterType;
    return matchesSearch && matchesFilter;
  });

  const selectedSample = samples.find((s) => s.id === selectedSampleId) || samples[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient) return;
    addSample({
      patientAnonymousId: newPatient,
      specimenType: newType,
      collectionTimestamp: "2026-09-26 11:20 WIB",
      volumeMl: Number(newVolume),
      bslLevel: newBsl,
      storageLocation: newLocation,
      testRequested: newTest,
      status: "ACCESSIONED",
      qcPurityRatio: 1.83,
    });
    setShowAddModal(false);
    setNewPatient("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Flat Clinical Header Banner */}
        <div className="bg-white border-2 border-slate-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-sky-600 text-white font-mono text-[10px] font-bold">
                GLP / ISO-15189 INTAKE
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">
                CLINICAL SPECIMEN WORKBENCH
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              SPECIMEN ACCESSIONING & CHAIN-OF-CUSTODY
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Registrasi sampel biologis klinis, pemindaian barcode matrix, dan protokol kontainmen BSL-1/2/3.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto border border-sky-800"
          >
            <Plus className="w-4 h-4" />
            ACCESSION BARU
          </button>
        </div>

        {/* Modal Intake Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
            <div className="bg-white border-2 border-slate-400 max-w-lg w-full p-6 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-sky-600" />
                  REGISTRASI SPESIMEN BARU
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ID PASIEN (ANONIM):</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ANON-PT-88319"
                    value={newPatient}
                    onChange={(e) => setNewPatient(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-300 focus:outline-none focus:border-sky-600 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">TIPE SPESIMEN:</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as SpecimenType)}
                      className="w-full px-2.5 py-2 border-2 border-slate-300 focus:outline-none focus:border-sky-600 text-xs"
                    >
                      <option value="WHOLE_BLOOD_EDTA">WHOLE BLOOD (EDTA)</option>
                      <option value="SERUM_CLOT_ACTIVATOR">SERUM (CLOT ACTIVATOR)</option>
                      <option value="PURIFIED_GENOMIC_DNA">PURIFIED GENOMIC DNA</option>
                      <option value="NASOPHARYNGEAL_SWAB_VTM">NASOPHARYNGEAL SWAB (VTM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">LEVEL BIOHAZARD:</label>
                    <select
                      value={newBsl}
                      onChange={(e) => setNewBsl(e.target.value as BslLevel)}
                      className="w-full px-2.5 py-2 border-2 border-slate-300 focus:outline-none focus:border-sky-600 text-xs"
                    >
                      <option value="BSL-1 (Minimal)">BSL-1 (Minimal)</option>
                      <option value="BSL-2 (Moderate Hazard)">BSL-2 (Moderate)</option>
                      <option value="BSL-3 (High Containment)">BSL-3 (High Containment)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">VOLUME (mL):</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newVolume}
                      onChange={(e) => setNewVolume(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-slate-300 focus:outline-none focus:border-sky-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">LOKASI RACK/STORAGE:</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-300 focus:outline-none focus:border-sky-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">UJI DIAGNOSTIK DIMINTA:</label>
                  <input
                    type="text"
                    required
                    value={newTest}
                    onChange={(e) => setNewTest(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-300 focus:outline-none focus:border-sky-600 font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 font-bold text-white"
                  >
                    Simpan Sampel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Selected Specimen Spotlight Card */}
        {selectedSample && (
          <div className="bg-white border-2 border-slate-300 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-200 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-slate-900 text-white font-mono text-sm font-bold">
                  {selectedSample.barcode}
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-mono font-bold border ${
                    selectedSample.bslLevel.includes("BSL-3")
                      ? "bg-red-50 text-red-700 border-red-400"
                      : selectedSample.bslLevel.includes("BSL-2")
                      ? "bg-orange-50 text-orange-700 border-orange-400"
                      : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  {selectedSample.bslLevel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">STATUS SIKLUS:</span>
                <button
                  onClick={() => advanceSampleStatus(selectedSample.id)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors border border-sky-800"
                >
                  <span>{selectedSample.status}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-normal underline">NEXT PROTOCOL</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase block">PATIENT ANONYMOUS</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSample.patientAnonymousId}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase block">SPESIMEN & VOLUME</span>
                <span className="font-bold text-slate-900">{selectedSample.specimenType}</span>
                <p className="text-slate-600 text-[11px]">{selectedSample.volumeMl} mL Tube</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase block">STORAGE RACK</span>
                <span className="font-bold text-slate-900">{selectedSample.storageLocation}</span>
                <p className="text-slate-600 text-[11px]">Intake: {selectedSample.collectionTimestamp}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase block">PURITY RATIO OD260/280</span>
                <span className="font-bold text-sky-700 text-sm">{selectedSample.qcPurityRatio}</span>
                <p className="text-emerald-700 text-[11px] font-bold">PASS QC TOLERANCE</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari barcode sampel, anonim ID, atau jenis uji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-300 font-mono text-xs focus:outline-none focus:border-sky-600"
            />
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "WHOLE_BLOOD_EDTA", "PURIFIED_GENOMIC_DNA", "NASOPHARYNGEAL_SWAB_VTM"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 whitespace-nowrap border ${
                    filterType === t
                      ? "bg-slate-900 text-white border-slate-900 font-bold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {t.replace(/_/g, " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* Flat Specimen Matrix Table */}
        <div className="bg-white border-2 border-slate-300 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-slate-100 border-b-2 border-slate-300 text-slate-700 text-[11px]">
              <tr>
                <th className="p-3 border-r border-slate-300">BARCODE / ID</th>
                <th className="p-3 border-r border-slate-300">PATIENT ANON</th>
                <th className="p-3 border-r border-slate-300">SPECIMEN TYPE</th>
                <th className="p-3 border-r border-slate-300">BSL RATING</th>
                <th className="p-3 border-r border-slate-300">TEST PROTOCOL</th>
                <th className="p-3 border-r border-slate-300">STORAGE DECK</th>
                <th className="p-3 border-r border-slate-300">STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((sample) => {
                const isSelected = sample.id === selectedSampleId;
                return (
                  <tr
                    key={sample.id}
                    onClick={() => setSelectedSampleId(sample.id)}
                    className={`cursor-pointer hover:bg-sky-50 transition-colors ${
                      isSelected ? "bg-sky-50/80 font-bold" : ""
                    }`}
                  >
                    <td className="p-3 border-r border-slate-200">
                      <span className="font-bold text-slate-900">{sample.barcode}</span>
                      <span className="text-[10px] text-slate-500 block">{sample.id}</span>
                    </td>
                    <td className="p-3 border-r border-slate-200 text-slate-800">
                      {sample.patientAnonymousId}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-[10px]">
                        {sample.specimenType}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span
                        className={`px-1.5 py-0.5 text-[10px] border ${
                          sample.bslLevel.includes("BSL-3")
                            ? "bg-red-100 text-red-800 border-red-400"
                            : sample.bslLevel.includes("BSL-2")
                            ? "bg-orange-100 text-orange-800 border-orange-400"
                            : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {sample.bslLevel.split(" ")[0]}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-200 text-slate-700 max-w-[200px] truncate">
                      {sample.testRequested}
                    </td>
                    <td className="p-3 border-r border-slate-200 text-slate-600 text-[11px]">
                      {sample.storageLocation}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold border ${
                          sample.status === "COMPLETED_VALIDATED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                            : sample.status === "RUNNING_PCR"
                            ? "bg-sky-100 text-sky-800 border-sky-400"
                            : sample.status === "IN_EXTRACTION"
                            ? "bg-amber-100 text-amber-800 border-amber-400"
                            : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {sample.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceSampleStatus(sample.id);
                        }}
                        className="px-2 py-1 bg-slate-200 hover:bg-sky-600 hover:text-white border border-slate-400 text-[10px] font-bold transition-colors"
                      >
                        ADVANCE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
