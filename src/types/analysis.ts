export type AnalysisMode = "body" | "face" | "hands";

export interface AnalysisResult {
  shoulder_width: string;
  hip_width: string;
  shoulder_to_hip_ratio: string;
  estimated_biological_sex: "Male" | "Female" | "Inconclusive";
  confidence_level: "Low" | "Moderate" | "High";
  reasoning: string;
}

export interface FaceAnalysisResult {
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
}

export interface HandAnalysisResult {
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
