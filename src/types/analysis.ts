export type AnalysisMode = "body" | "face" | "hands";

// Common fields added by red herring detection + nuanced scoring
interface BaseAnalysisFields {
  maleProbability: number;
  obstructionDetected: boolean;
  obstructionType?: string | null;
  obstructionSeverity?: "minor" | "moderate" | "severe" | null;
}

export interface AnalysisResult extends BaseAnalysisFields {
  shoulder_width: string;
  hip_width: string;
  shoulder_to_hip_ratio: string;
  estimated_biological_sex: "Male" | "Female" | "Inconclusive";
  confidence_level: "Low" | "Moderate" | "High";
  reasoning: string;
}

export interface FaceAnalysisResult extends BaseAnalysisFields {
  foreheadType: string;
  browRidge: string;
  orbitalShape: string;
  noseType: string;
  cheekbones: string;
  jawChinType: string;
  faceShape: string;
  glabella: string;
  estimatedSex: "Male" | "Female" | "Inconclusive";
  confidence: "Low" | "Moderate" | "High";
  reasoning: string;
  rekognition?: {
    gender: string;
    confidence: number;
  };
}

export interface HandAnalysisResult extends BaseAnalysisFields {
  digitRatio: string;
  handSize: string;
  metacarpalRobustness: string;
  knuckleProminence: string;
  fingerTaper: string;
  wristWidth: string;
  thenarEminence: string;
  clavicle: string;
  estimatedSex: "Male" | "Female" | "Inconclusive";
  confidence: "Low" | "Moderate" | "High";
  reasoning: string;
}
