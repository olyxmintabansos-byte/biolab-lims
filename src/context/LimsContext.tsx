"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SpecimenSample,
  InstrumentRun,
  LimsKpi,
  SampleStatus,
  ReagentItem,
  CryoFreezerUnit,
  ClinicalCoaReport,
} from "@/types/lims";

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
  reagents: ReagentItem[];
  decrementReagent: (id: string) => void;
  restockReagent: (id: string, delta: number) => void;
  cryoUnit: CryoFreezerUnit;
  toggleCryoLn2: () => void;
  coaReports: ClinicalCoaReport[];
  selectedCoaId: string;
  setSelectedCoaId: (id: string) => void;
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

const INITIAL_REAGENTS: ReagentItem[] = [
  {
    id: "RGT-01",
    name: "TaqPath 1-Step RT-qPCR Master Mix",
    lotNumber: "LOT-TP-2026-091",
    catalogNumber: "A15299-TF",
    expirationDate: "2027-04-15",
    remainingQuantity: 38,
    unit: "Vials (100 rxn)",
    storageCondition: "-20°C Freezer",
    qcPassed: true,
    minimumThreshold: 10,
  },
  {
    id: "RGT-02",
    name: "Magnetic Silica Viral RNA Extraction Beads",
    lotNumber: "LOT-MAG-2026-884",
    catalogNumber: "MAG-RNA-960",
    expirationDate: "2027-08-30",
    remainingQuantity: 125,
    unit: "Bottles (50 mL)",
    storageCondition: "+4°C Refrigerator",
    qcPassed: true,
    minimumThreshold: 20,
  },
  {
    id: "RGT-03",
    name: "Ultra-Deep DNA Ligase Library Prep Kit",
    lotNumber: "LOT-NGS-2026-302",
    catalogNumber: "ILM-LIG-24",
    expirationDate: "2026-11-20",
    remainingQuantity: 8,
    unit: "Kits (24 rxn)",
    storageCondition: "-80°C Cryo",
    qcPassed: true,
    minimumThreshold: 5,
  },
  {
    id: "RGT-04",
    name: "SYBR Green I Nucleic Acid Gel Stain (10,000X)",
    lotNumber: "LOT-SYB-2026-115",
    catalogNumber: "S7563-AM",
    expirationDate: "2027-01-10",
    remainingQuantity: 24,
    unit: "Vials (500 µL)",
    storageCondition: "-20°C Freezer",
    qcPassed: true,
    minimumThreshold: 8,
  },
  {
    id: "RGT-05",
    name: "Nuclease-Free DEPC-Treated Water",
    lotNumber: "LOT-NFW-2026-004",
    catalogNumber: "AM9932",
    expirationDate: "2028-06-30",
    remainingQuantity: 450,
    unit: "Bottles (100 mL)",
    storageCondition: "Ambient (+20°C)",
    qcPassed: true,
    minimumThreshold: 50,
  },
];

const INITIAL_CRYO: CryoFreezerUnit = {
  id: "CRYO-ULT-01",
  name: "Thermo-Fisher TSX Series Ultra-Low -80°C",
  currentTempC: -81.4,
  targetTempC: -80.0,
  ln2BackupStatus: "ARMED_READY",
  totalRacks: 24,
  occupiedSlots: 18,
  lastDefrostDate: "2026-08-15",
};

const INITIAL_COA_REPORTS: ClinicalCoaReport[] = [
  {
    reportId: "COA-2026-09041",
    sampleBarcode: "BL-2026-DNA-09041",
    patientAnonId: "ANON-PT-48210",
    testPanelName: "Oncogene Mutation Diagnostic Panel (EGFR / KRAS / BRAF)",
    methodology: "Real-Time Multiplex Allele-Specific RT-qPCR (ISO 15189 Validated)",
    specimenSource: "Peripheral Blood Purified cfDNA (Cell-Free Circulating)",
    collectionDate: "26 September 2026 08:30 WIB",
    reportingDate: "26 September 2026 13:15 WIB",
    overallInterpretation: "POSITIVE_DETECTED",
    resultsTable: [
      {
        targetMarker: "EGFR Exon 19 Deletion (L747_P753del)",
        measuredValue: "MUTATION DETECTED (Ct: 23.4)",
        referenceInterval: "WILD-TYPE (NOT DETECTED)",
        clinicalSignificance: "Predictive biomarker for EGFR Tyrosine Kinase Inhibitor sensitivity",
        flag: "CRITICAL_POSITIVE",
      },
      {
        targetMarker: "EGFR Exon 20 T790M Resistance",
        measuredValue: "NOT DETECTED (Ct > 40.0)",
        referenceInterval: "WILD-TYPE (NOT DETECTED)",
        clinicalSignificance: "No secondary gatekeeper resistance detected",
        flag: "NORMAL",
      },
      {
        targetMarker: "KRAS Codon 12/13 (Exon 2)",
        measuredValue: "NOT DETECTED (Ct > 40.0)",
        referenceInterval: "WILD-TYPE (NOT DETECTED)",
        clinicalSignificance: "Downstream pathway wild-type",
        flag: "NORMAL",
      },
      {
        targetMarker: "Internal Control (Exogenous Reference DNA)",
        measuredValue: "VALID (Ct: 18.2)",
        referenceInterval: "Ct 16.0 - 22.0",
        clinicalSignificance: "Assay run quality validated",
        flag: "NORMAL",
      },
    ],
    pathologistName: "dr. Adrian Prasetya, Sp.PK(K)",
    qualityManagerName: "Prof. Dr. Maya Indrawati, Ph.D",
    isoAccreditation: "KAN LP-842-IDN // ISO 15189:2022 Medical Lab",
  },
  {
    reportId: "COA-2026-09043",
    sampleBarcode: "BL-2026-SWB-09043",
    patientAnonId: "ANON-PT-77312",
    testPanelName: "Multiplex Viral Respiratory Pathogen Panel (4-Target PCR)",
    methodology: "Real-Time RT-PCR Multiplex TaqMan Fluorogenic Probe",
    specimenSource: "Nasopharyngeal Swab in Viral Transport Media (VTM)",
    collectionDate: "26 September 2026 10:00 WIB",
    reportingDate: "26 September 2026 13:30 WIB",
    overallInterpretation: "NEGATIVE_NOT_DETECTED",
    resultsTable: [
      {
        targetMarker: "SARS-CoV-2 (N1/N2 & RdRp Genes)",
        measuredValue: "NOT DETECTED (Ct > 40.0)",
        referenceInterval: "NEGATIVE (NOT DETECTED)",
        clinicalSignificance: "No viral RNA detected within analytical limit of detection",
        flag: "NORMAL",
      },
      {
        targetMarker: "Influenza A Virus (Matrix Gene)",
        measuredValue: "NOT DETECTED (Ct > 40.0)",
        referenceInterval: "NEGATIVE (NOT DETECTED)",
        clinicalSignificance: "Absence of seasonal Flu-A RNA",
        flag: "NORMAL",
      },
      {
        targetMarker: "Influenza B Virus (Non-Structural NS1)",
        measuredValue: "NOT DETECTED (Ct > 40.0)",
        referenceInterval: "NEGATIVE (NOT DETECTED)",
        clinicalSignificance: "Absence of seasonal Flu-B RNA",
        flag: "NORMAL",
      },
      {
        targetMarker: "Human RNase P (Extraction Control)",
        measuredValue: "POSITIVE (Ct: 22.1)",
        referenceInterval: "Ct < 30.0",
        clinicalSignificance: "Valid specimen sampling and extraction efficiency",
        flag: "NORMAL",
      },
    ],
    pathologistName: "dr. Adrian Prasetya, Sp.PK(K)",
    qualityManagerName: "Prof. Dr. Maya Indrawati, Ph.D",
    isoAccreditation: "KAN LP-842-IDN // ISO 15189:2022 Medical Lab",
  },
];

const LimsContext = createContext<LimsContextType | undefined>(undefined);

export function LimsProvider({ children }: { children: React.ReactNode }) {
  const [samples, setSamples] = useState<SpecimenSample[]>(INITIAL_SAMPLES);
  const [instruments, setInstruments] = useState<InstrumentRun[]>(INITIAL_INSTRUMENTS);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("SMP-9041");
  const [reagents, setReagents] = useState<ReagentItem[]>(INITIAL_REAGENTS);
  const [cryoUnit, setCryoUnit] = useState<CryoFreezerUnit>(INITIAL_CRYO);
  const [coaReports] = useState<ClinicalCoaReport[]>(INITIAL_COA_REPORTS);
  const [selectedCoaId, setSelectedCoaId] = useState<string>("COA-2026-09041");

  useEffect(() => {
    try {
      const savedSamples = localStorage.getItem("biolab_samples");
      const savedInstruments = localStorage.getItem("biolab_instruments");
      const savedReagents = localStorage.getItem("biolab_reagents");
      const savedCryo = localStorage.getItem("biolab_cryo");
      if (savedSamples) setSamples(JSON.parse(savedSamples));
      if (savedInstruments) setInstruments(JSON.parse(savedInstruments));
      if (savedReagents) setReagents(JSON.parse(savedReagents));
      if (savedCryo) setCryoUnit(JSON.parse(savedCryo));
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

  const saveReagents = (data: ReagentItem[]) => {
    setReagents(data);
    try {
      localStorage.setItem("biolab_reagents", JSON.stringify(data));
    } catch {}
  };

  const saveCryo = (data: CryoFreezerUnit) => {
    setCryoUnit(data);
    try {
      localStorage.setItem("biolab_cryo", JSON.stringify(data));
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

  const decrementReagent = (id: string) => {
    const updated = reagents.map((r) => {
      if (r.id === id) {
        return { ...r, remainingQuantity: Math.max(0, r.remainingQuantity - 1) };
      }
      return r;
    });
    saveReagents(updated);
  };

  const restockReagent = (id: string, delta: number) => {
    const updated = reagents.map((r) => {
      if (r.id === id) {
        return { ...r, remainingQuantity: r.remainingQuantity + delta };
      }
      return r;
    });
    saveReagents(updated);
  };

  const toggleCryoLn2 = () => {
    const nextStatus: CryoFreezerUnit["ln2BackupStatus"] =
      cryoUnit.ln2BackupStatus === "ARMED_READY" ? "STANDBY" : "ARMED_READY";
    saveCryo({ ...cryoUnit, ln2BackupStatus: nextStatus });
  };

  const resetLimsData = () => {
    saveSamples(INITIAL_SAMPLES);
    saveInstruments(INITIAL_INSTRUMENTS);
    saveReagents(INITIAL_REAGENTS);
    saveCryo(INITIAL_CRYO);
    setSelectedSampleId("SMP-9041");
    setSelectedCoaId("COA-2026-09041");
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
        reagents,
        decrementReagent,
        restockReagent,
        cryoUnit,
        toggleCryoLn2,
        coaReports,
        selectedCoaId,
        setSelectedCoaId,
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
