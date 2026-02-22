export type AnalysisMode = "body" | "face" | "hands" | "voice" | "gait";

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

// Arm analysis sub-object
export interface ArmAnalysis {
  bicep_tricep_definition: string;
  carrying_angle: string;
  forearm_vascularity: string;
  arm_length_ratio: string;
  elbow_width: string;
  forearm_upper_arm_ratio: string;
  confidence_contribution: string;
}

export interface AnalysisResult extends BaseAnalysisFields {
  shoulder_width: string;
  hip_width: string;
  shoulder_to_hip_ratio: string;
  clavicle_angle?: string;
  shoulder_neck_ratio?: string;
  deltoid_definition?: string;
  chest_analysis?: ChestAnalysis;
  arm_analysis?: ArmAnalysis;
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

export interface VoiceAnalysisResult extends BaseAnalysisFields {
  fundamental_frequency_estimate: string;
  pitch_range: "male" | "female" | "overlap";
  formant_assessment: "male_typical" | "female_typical" | "ambiguous";
  vocal_tract_length: "male" | "female" | "ambiguous";
  speech_patterns: string;
  voice_training_detected: boolean;
  estimatedSex: "Male" | "Female" | "Inconclusive";
  confidence: "Low" | "Moderate" | "High";
  reasoning: string;
}

export interface GaitAnalysisResult extends BaseAnalysisFields {
  pelvic_rotation: "high_female" | "low_male" | "ambiguous";
  step_width: "narrow_female" | "wide_male" | "ambiguous";
  arm_swing: "medial_female" | "lateral_male" | "ambiguous";
  stride_type: "hip_led_female" | "shoulder_led_male" | "ambiguous";
  knee_tracking: "convergent_female" | "parallel_male" | "ambiguous";
  upper_body_movement: string;
  cadence_stride: string;
  estimatedSex: "Male" | "Female" | "Inconclusive";
  confidence: "Low" | "Moderate" | "High";
  reasoning: string;
}
