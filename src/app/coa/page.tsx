"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useLims } from "@/context/LimsContext";
import {
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Dna,
} from "lucide-react";

export default function CertificatePage() {
  const { coaReports, selectedCoaId, setSelectedCoaId } = useLims();
  const currentCoa =
    coaReports.find((c) => c.reportId === selectedCoaId) || coaReports[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:p-0 print:m-0 print:max-w-none">
        {/* Action Header Banner (Hidden on Print) */}
        <div className="print:hidden bg-white border-2 border-slate-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-sky-600 text-white font-mono text-[10px] font-bold">
                ISO 15189:2022
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">
                CLINICAL MOLECULAR PATHOLOGY REPORT
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              CERTIFICATE OF ANALYSIS (COA) A4
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Lembar hasil uji resmi laboratorium berstandar KAN & ISO 15189 siap cetak PDF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCoaId}
              onChange={(e) => setSelectedCoaId(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-sky-600"
            >
              {coaReports.map((c) => (
                <option key={c.reportId} value={c.reportId}>
                  {c.reportId} // {c.patientAnonId}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold flex items-center gap-2 border border-sky-800 shadow-none transition-colors"
            >
              <Printer className="w-4 h-4" />
              CETAK DOKUMEN A4
            </button>
          </div>
        </div>

        {/* Printable A4 Certificate Container */}
        <div className="bg-white border-2 border-slate-300 p-8 sm:p-12 print:border-none print:p-6 text-slate-900 font-sans">
          {/* Certificate Header / Letterhead */}
          <div className="border-b-4 border-slate-900 pb-5 mb-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-600 text-white flex items-center justify-center font-bold">
                  <Dna className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
                  BIOLAB LIMS CLINICAL PATHOLOGY
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider">
                DEPARTEMEN DIAGNOSTIK MOLEKULER & GENETIKA MEDIS
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Gedung Riset Biomedis Terpadu • Akreditasi KAN LP-842-IDN • Organisasi olyxmintabansos-byte
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="px-2 py-1 bg-slate-900 text-white text-xs font-bold">
                LAPORAN RESMI ISO 15189
              </span>
              <p className="text-xs text-slate-600 mt-1 font-bold">NO: {currentCoa.reportId}</p>
            </div>
          </div>

          {/* Patient & Specimen Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border-2 border-slate-300 font-mono text-xs mb-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                IDENTITAS PASIEN (ANONIM):
              </span>
              <span className="text-sm font-bold text-slate-900">{currentCoa.patientAnonId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                BARCODE / NOMOR SAMPEL:
              </span>
              <span className="text-sm font-bold text-slate-900">{currentCoa.sampleBarcode}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                ASAL & JENIS SPESIMEN:
              </span>
              <span className="text-slate-800">{currentCoa.specimenSource}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                TANGGAL PENERIMAAN / SELESAI:
              </span>
              <span className="text-slate-800">{currentCoa.collectionDate} &rarr; {currentCoa.reportingDate}</span>
            </div>
          </div>

          {/* Test Panel & Methodology Header */}
          <div className="mb-4">
            <h2 className="text-sm font-bold font-mono uppercase text-slate-900">
              UJI: {currentCoa.testPanelName}
            </h2>
            <p className="text-xs font-mono text-slate-600 italic">
              Metodologi: {currentCoa.methodology}
            </p>
          </div>

          {/* Clinical Diagnostic Results Table */}
          <table className="w-full text-left font-mono text-xs border-2 border-slate-300 mb-6">
            <thead className="bg-slate-100 border-b-2 border-slate-300 text-slate-800 text-[11px]">
              <tr>
                <th className="p-2.5 border-r border-slate-300">TARGET BIOMARKER / GEN</th>
                <th className="p-2.5 border-r border-slate-300">HASIL PENGUJIAN</th>
                <th className="p-2.5 border-r border-slate-300">NILAI RUJUKAN</th>
                <th className="p-2">SIGNIFIKANSI KLINIS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentCoa.resultsTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                    {row.targetMarker}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                    <span
                      className={
                        row.flag === "CRITICAL_POSITIVE"
                          ? "text-red-700 bg-red-50 px-1 py-0.5 border border-red-300"
                          : "text-slate-800"
                      }
                    >
                      {row.measuredValue}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-slate-600">
                    {row.referenceInterval}
                  </td>
                  <td className="p-2.5 text-slate-700 text-[11px]">
                    {row.clinicalSignificance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Overall Diagnostic Conclusion */}
          <div className="p-4 border-2 border-slate-300 bg-slate-50 font-mono text-xs mb-8">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">
              KESIMPULAN INTERPRETASI DIAGNOSTIK:
            </span>
            <span
              className={`text-base font-black uppercase ${
                currentCoa.overallInterpretation === "POSITIVE_DETECTED"
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >
              {currentCoa.overallInterpretation.replace(/_/g, " ")}
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              Hasil pengujian molekuler ini telah dikontrol menggunakan kontrol internal positif/negatif dan memenuhi kriteria validitas analitik ISO 15189.
            </p>
          </div>

          {/* Dual Doctor & Quality Manager Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-300 font-mono text-xs">
            <div className="text-center space-y-12">
              <span className="text-[10px] text-slate-500 uppercase block">
                PENANGGUNG JAWAB TEKNIS (MOLECULAR BIOLOGIST):
              </span>
              <div>
                <p className="font-bold underline text-slate-900">{currentCoa.qualityManagerName}</p>
                <p className="text-[10px] text-slate-600">Kepala Lab Diagnostik Molekuler</p>
              </div>
            </div>

            <div className="text-center space-y-12">
              <span className="text-[10px] text-slate-500 uppercase block">
                DOKTER SPESIALIS PATOLOGI KLINIK:
              </span>
              <div>
                <p className="font-bold underline text-slate-900">{currentCoa.pathologistName}</p>
                <p className="text-[10px] text-slate-600">SIP. 446.1/092/Dinkes-SpPK/2026</p>
              </div>
            </div>
          </div>

          {/* Certificate Footer Notes */}
          <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center font-mono text-[10px] text-slate-500">
            <span>AKREDITASI: {currentCoa.isoAccreditation}</span>
            <span>BIOLAB LIMS // SOVEREIGN TITAN #33</span>
          </div>
        </div>
      </main>
    </div>
  );
}
