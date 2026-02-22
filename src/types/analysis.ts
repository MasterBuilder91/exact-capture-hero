export type AnalysisMode = "body" | "face" | "hands";

// Neck analysis sub-object
export interface NeckAnalysis {
  adams_apple: string;
  neck_width_ratio: string;
  muscle_definition: string;
  trachea_visibility: string;
  confidence_contribution: string;
}

// Common fields added by red herring detection + nuanced scoring
interface BaseAnalysisFields {
  maleProbability: number;
  obstructionDetected: boolean;
  obstructionType?: string | null;
  obstructionSeverity?: "minor" | "moderate" | "severe" | null;
  concealment_score?: number;
  concealment_reasons?: string[];
  neck_analysis?: NeckAnalysis;
  better_photo_suggestion?: string | null;
}

// Chest analysis sub-object
export interface ChestAnalysis {
  chest_wall_geometry: string;
  breast_tissue_assessment: string;
  upper_pole_shape: string;
  inframammary_fold: string;
  pectoral_muscle_visibility: string;
  surgical_markers: string;
  confidence_contribution: string;
  confidence_adjustment: number;
}

export interface AnalysisResult extends BaseAnalysisFields {
  shoulder_width: string;
  hip_width: string;
  shoulder_to_hip_ratio: string;
  clavicle_angle?: string;
  shoulder_neck_ratio?: string;
  deltoid_definition?: string;
  chest_analysis?: ChestAnalysis;
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
