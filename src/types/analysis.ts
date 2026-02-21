export interface AnalysisResult {
  shoulder_width: string;
  hip_width: string;
  shoulder_to_hip_ratio: string;
  estimated_biological_sex: "Male" | "Female" | "Inconclusive";
  confidence_level: "Low" | "Moderate" | "High";
  reasoning: string;
}
