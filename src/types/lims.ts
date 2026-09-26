export type BslLevel = "BSL-1 (Minimal)" | "BSL-2 (Moderate Hazard)" | "BSL-3 (High Containment)";

export type SpecimenType =
  | "WHOLE_BLOOD_EDTA"
  | "SERUM_CLOT_ACTIVATOR"
  | "PURIFIED_GENOMIC_DNA"
  | "NASOPHARYNGEAL_SWAB_VTM"
  | "CELL_CULTURE_SUPERNATANT";

export type SampleStatus =
  | "ACCESSIONED"
  | "IN_EXTRACTION"
  | "RUNNING_PCR"
  | "COMPLETED_VALIDATED";

export interface SpecimenSample {
  id: string;
  barcode: string;
  patientAnonymousId: string;
  specimenType: SpecimenType;
  collectionTimestamp: string;
  volumeMl: number;
  bslLevel: BslLevel;
  storageLocation: string;
  testRequested: string;
  status: SampleStatus;
  qcPurityRatio: number;
}

export type InstrumentStatus = "IDLE" | "THERMOCYCLING" | "SEQUENCING" | "STANDBY_MAINTENANCE";

export interface InstrumentRun {
  id: string;
  name: string;
  model: string;
  instrumentType: "REAL_TIME_RT_PCR" | "NEXT_GEN_SEQUENCER" | "SPECTROPHOTOMETER" | "HEMATOLOGY_ANALYZER";
  status: InstrumentStatus;
  currentCycle: number;
  targetCycles: number;
  blockTemperatureC: number;
  plateWellFormat: string;
  operatorId: string;
  activeBatchCode: string;
}

export interface LimsKpi {
  totalSpecimensToday: number;
  activePcrRuns: number;
  bsl3ContainmentActive: number;
  meanTurnaroundTimeHours: number;
  qcPurityPassRatePct: number;
  glpAuditCompliancePct: number;
}

export interface ReagentItem {
  id: string;
  name: string;
  lotNumber: string;
  catalogNumber: string;
  expirationDate: string;
  remainingQuantity: number;
  unit: string;
  storageCondition: "-80°C Cryo" | "-20°C Freezer" | "+4°C Refrigerator" | "Ambient (+20°C)";
  qcPassed: boolean;
  minimumThreshold: number;
}

export interface CryoFreezerUnit {
  id: string;
  name: string;
  currentTempC: number;
  targetTempC: number;
  ln2BackupStatus: "ARMED_READY" | "DISCHARGED" | "STANDBY";
  totalRacks: number;
  occupiedSlots: number;
  lastDefrostDate: string;
}

export interface ClinicalCoaReport {
  reportId: string;
  sampleBarcode: string;
  patientAnonId: string;
  testPanelName: string;
  methodology: string;
  specimenSource: string;
  collectionDate: string;
  reportingDate: string;
  overallInterpretation: "POSITIVE_DETECTED" | "NEGATIVE_NOT_DETECTED" | "INCONCLUSIVE_RETEST";
  resultsTable: {
    targetMarker: string;
    measuredValue: string;
    referenceInterval: string;
    clinicalSignificance: string;
    flag: "NORMAL" | "HIGH" | "CRITICAL_POSITIVE";
  }[];
  pathologistName: string;
  qualityManagerName: string;
  isoAccreditation: string;
}
