"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SpecimenSample, InstrumentRun, LimsKpi, SampleStatus } from "@/types/lims";

interface LimsContextType {
  samples: SpecimenSample[];
  instruments: InstrumentRun[];
  selectedSampleId: string;
  setSelectedSampleId: (id: string) => void;
  kpis: LimsKpi;
  addSample: (sample: Omit<SpecimenSample, "id" | "barcode">) => void;
  advanceSampleStatus: (id: string) => void;
  toggleInstrumentRun: (id: string) => void;
  advancePcrCycles: (id: string, delta: number) => void;
  resetLimsData: () => void;
}

const INITIAL_SAMPLES: SpecimenSample[] = [
  {
    id: "SMP-9041",
    barcode: "BL-2026-DNA-09041",
    patientAnonymousId: "ANON-PT-48210",
    specimenType: "PURIFIED_GENOMIC_DNA",
    collectionTimestamp: "2026-09-26 08:30 WIB",
    volumeMl: 0.15,
    bslLevel: "BSL-2 (Moderate Hazard)",
    storageLocation: "CRYO-MINUS80 // RACK-C3",
    testRequested: "Whole Exome Sequencing & Oncogene Panel",
    status: "RUNNING_PCR",
    qcPurityRatio: 1.84,
  },
  {
    id: "SMP-9042",
    barcode: "BL-2026-BLD-09042",
    patientAnonymousId: "ANON-PT-51294",
    specimenType: "WHOLE_BLOOD_EDTA",
    collectionTimestamp: "2026-09-26 09:15 WIB",
    volumeMl: 3.5,
    bslLevel: "BSL-2 (Moderate Hazard)",
    storageLocation: "COLD-4C // TRAY-02",
    testRequested: "Complete Blood Count & Flow Cytometry",
    status: "IN_EXTRACTION",
    qcPurityRatio: 1.78,
  },
  {
    id: "SMP-9043",
    barcode: "BL-2026-SWB-09043",
    patientAnonymousId: "ANON-PT-77312",
    specimenType: "NASOPHARYNGEAL_SWAB_VTM",
    collectionTimestamp: "2026-09-26 10:00 WIB",
    volumeMl: 1.2,
    bslLevel: "BSL-3 (High Containment)",
    storageLocation: "ISOLATION-BOX // BSL3-01",
    testRequested: "Multiplex Viral Respiratory Pathogen PCR",
    status: "ACCESSIONED",
    qcPurityRatio: 1.88,
  },
  {
    id: "SMP-9044",
    barcode: "BL-2026-SER-09044",
    patientAnonymousId: "ANON-PT-29401",
    specimenType: "SERUM_CLOT_ACTIVATOR",
    collectionTimestamp: "2026-09-26 07:45 WIB",
    volumeMl: 2.0,
    bslLevel: "BSL-1 (Minimal)",
    storageLocation: "CENTRIFUGE-DECK // SLOT-04",
    testRequested: "Clinical Biomarker Chemiluminescence Immunoassay",
    status: "COMPLETED_VALIDATED",
    qcPurityRatio: 1.82,
  },
];

const INITIAL_INSTRUMENTS: InstrumentRun[] = [
  {
    id: "INST-PCR-01",
    name: "QuantStudio-7 Pro Real-Time PCR",
    model: "Thermo-Fisher QS7-96W",
    instrumentType: "REAL_TIME_RT_PCR",
    status: "THERMOCYCLING",
    currentCycle: 28,
    targetCycles: 40,
    blockTemperatureC: 58.5,
    plateWellFormat: "96-Well MicroAmp Flat Deck",
    operatorId: "TECH-ID: WIRA-88",
    activeBatchCode: "RUN-PCR-2026-B99",
  },
  {
    id: "INST-NGS-02",
    name: "NextSeq 2000 Molecular Sequencer",
    model: "Illumina P2 Flow-Cell",
    instrumentType: "NEXT_GEN_SEQUENCER",
    status: "SEQUENCING",
    currentCycle: 142,
    targetCycles: 300,
    blockTemperatureC: 22.0,
    plateWellFormat: "High-Output Dual-Lane Flowcell",
    operatorId: "TECH-ID: MAYA-42",
    activeBatchCode: "NGS-WES-LOT4",
  },
  {
    id: "INST-SPEC-03",
    name: "NanoDrop One Microvolume UV-Vis",
    model: "Spectral-Absorbance Photometer",
    instrumentType: "SPECTROPHOTOMETER",
    status: "IDLE",
    currentCycle: 1,
    targetCycles: 1,
    blockTemperatureC: 25.0,
    plateWellFormat: "Pedestal Micro-drop 1.5 µL",
    operatorId: "TECH-ID: WIRA-88",
    activeBatchCode: "QC-PURITY-DAILY",
  },
];

const LimsContext = createContext<LimsContextType | undefined>(undefined);

export function LimsProvider({ children }: { children: React.ReactNode }) {
  const [samples, setSamples] = useState<SpecimenSample[]>(INITIAL_SAMPLES);
  const [instruments, setInstruments] = useState<InstrumentRun[]>(INITIAL_INSTRUMENTS);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("SMP-9041");

  useEffect(() => {
    try {
      const savedSamples = localStorage.getItem("biolab_samples");
      const savedInstruments = localStorage.getItem("biolab_instruments");
      if (savedSamples) setSamples(JSON.parse(savedSamples));
      if (savedInstruments) setInstruments(JSON.parse(savedInstruments));
    } catch {}
  }, []);

  const saveSamples = (data: SpecimenSample[]) => {
    setSamples(data);
    try {
      localStorage.setItem("biolab_samples", JSON.stringify(data));
    } catch {}
  };

  const saveInstruments = (data: InstrumentRun[]) => {
    setInstruments(data);
    try {
      localStorage.setItem("biolab_instruments", JSON.stringify(data));
    } catch {}
  };

  const addSample = (sampleData: Omit<SpecimenSample, "id" | "barcode">) => {
    const nextSeq = 9040 + samples.length + 1;
    const newSample: SpecimenSample = {
      ...sampleData,
      id: `SMP-${nextSeq}`,
      barcode: `BL-2026-SAM-${nextSeq}`,
    };
    saveSamples([newSample, ...samples]);
  };

  const advanceSampleStatus = (id: string) => {
    const updated = samples.map((s) => {
      if (s.id === id) {
        const nextStatus: SampleStatus =
          s.status === "ACCESSIONED"
            ? "IN_EXTRACTION"
            : s.status === "IN_EXTRACTION"
            ? "RUNNING_PCR"
            : s.status === "RUNNING_PCR"
            ? "COMPLETED_VALIDATED"
            : "ACCESSIONED";
        return { ...s, status: nextStatus };
      }
      return s;
    });
    saveSamples(updated);
  };

  const toggleInstrumentRun = (id: string) => {
    const updated = instruments.map((inst) => {
      if (inst.id === id) {
        const isRunning = inst.status === "THERMOCYCLING" || inst.status === "SEQUENCING";
        const newStatus: InstrumentRun["status"] = isRunning 
          ? "IDLE" 
          : inst.instrumentType === "NEXT_GEN_SEQUENCER" 
          ? "SEQUENCING" 
          : "THERMOCYCLING";
        return { ...inst, status: newStatus };
      }
      return inst;
    });
    saveInstruments(updated);
  };

  const advancePcrCycles = (id: string, delta: number) => {
    const updated = instruments.map((inst) => {
      if (inst.id === id) {
        const nextC = Math.min(inst.targetCycles, Math.max(0, inst.currentCycle + delta));
        return { ...inst, currentCycle: nextC };
      }
      return inst;
    });
    saveInstruments(updated);
  };

  const resetLimsData = () => {
    saveSamples(INITIAL_SAMPLES);
    saveInstruments(INITIAL_INSTRUMENTS);
    setSelectedSampleId("SMP-9041");
  };

  const activePcrRuns = instruments.filter(
    (i) => i.status === "THERMOCYCLING" || i.status === "SEQUENCING"
  ).length;

  const bsl3ContainmentActive = samples.filter((s) => s.bslLevel.includes("BSL-3")).length;

  const kpis: LimsKpi = {
    totalSpecimensToday: samples.length,
    activePcrRuns,
    bsl3ContainmentActive,
    meanTurnaroundTimeHours: 4.2,
    qcPurityPassRatePct: 99.1,
    glpAuditCompliancePct: 100.0,
  };

  return (
    <LimsContext.Provider
      value={{
        samples,
        instruments,
        selectedSampleId,
        setSelectedSampleId,
        kpis,
        addSample,
        advanceSampleStatus,
        toggleInstrumentRun,
        advancePcrCycles,
        resetLimsData,
      }}
    >
      {children}
    </LimsContext.Provider>
  );
}

export function useLims() {
  const context = useContext(LimsContext);
  if (!context) throw new Error("useLims must be used within a LimsProvider");
  return context;
}
