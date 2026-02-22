import { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronDown, ChevronUp, Stethoscope, Dumbbell } from "lucide-react";
import ResultsOverlay from "./ResultsOverlay";

interface ResultsCardProps {
  result: AnalysisResult;
  imageBase64: string;
  onReset: () => void;
}

const ResultsCard = ({ result, imageBase64, onReset }: ResultsCardProps) => {
  const [chestExpanded, setChestExpanded] = useState(false);
  const [armExpanded, setArmExpanded] = useState(false);

  const sexColor = {
    Male: "bg-result-male",
    Female: "bg-result-female",
    Inconclusive: "bg-result-inconclusive",
  }[result.estimated_biological_sex];

  const sexLabel = {
    Male: "Likely Male",
    Female: "Likely Female",
    Inconclusive: "Inconclusive",
  }[result.estimated_biological_sex];

  const confidenceColor = {
    High: "bg-confidence-high",
    Moderate: "bg-confidence-moderate",
    Low: "bg-confidence-low",
  }[result.confidence_level];

  const rows: [string, string | undefined][] = [
    ["Shoulder Width", result.shoulder_width],
    ["Hip Width", result.hip_width],
    ["Shoulder-to-Hip Ratio", result.shoulder_to_hip_ratio],
    ["Clavicle Angle", result.clavicle_angle],
    ["Shoulder-Neck Ratio", result.shoulder_neck_ratio],
    ["Deltoid Definition", result.deltoid_definition],
  ];

  const chest = result.chest_analysis;
  const hasChestData = chest && chest.confidence_contribution !== "inconclusive" && chest.chest_wall_geometry !== "not visible";

  const chestRows: [string, string][] = chest ? [
    ["Chest Wall Geometry", chest.chest_wall_geometry],
    ["Breast Tissue Assessment", chest.breast_tissue_assessment],
    ["Upper Pole Shape", chest.upper_pole_shape],
    ["Inframammary Fold", chest.inframammary_fold],
    ["Pectoral Muscle Visibility", chest.pectoral_muscle_visibility],
    ["Surgical Markers", chest.surgical_markers],
    ["Contribution", chest.confidence_contribution],
    ["Confidence Adjustment", chest.confidence_adjustment > 0 ? `+${chest.confidence_adjustment}` : `${chest.confidence_adjustment}`],
  ] : [];

  const arm = result.arm_analysis;
  const hasArmData = arm && arm.confidence_contribution !== "inconclusive" && arm.bicep_tricep_definition !== "not visible";

  const armRows: [string, string][] = arm ? [
    ["Bicep/Tricep Definition", arm.bicep_tricep_definition],
    ["Carrying Angle", arm.carrying_angle],
    ["Forearm Vascularity", arm.forearm_vascularity],
    ["Arm Length Ratio", arm.arm_length_ratio],
    ["Elbow Width", arm.elbow_width],
    ["Forearm/Upper Arm Ratio", arm.forearm_upper_arm_ratio],
    ["Contribution", arm.confidence_contribution],
  ] : [];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <ResultsOverlay
        imageBase64={imageBase64}
        sexLabel={sexLabel}
        sexColor={sexColor}
        confidenceLabel={`${result.confidence_level} Confidence`}
        confidenceColor={confidenceColor}
        reasoning={result.reasoning}
        maleProbability={result.maleProbability}
        obstructionDetected={result.obstructionDetected}
        obstructionType={result.obstructionType}
        obstructionSeverity={result.obstructionSeverity}
        concealmentScore={result.concealment_score}
        concealmentReasons={result.concealment_reasons}
        neckAnalysis={result.neck_analysis}
        betterPhotoSuggestion={result.better_photo_suggestion}
      />

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Measurement</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.filter(([, v]) => v && v !== "not visible").map(([label, value]) => (
              <tr key={label}>
                <td className="px-4 py-3 text-foreground">{label}</td>
                <td className="px-4 py-3 text-right font-mono text-primary">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chest & Thoracic Analysis collapsible */}
      {hasChestData ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setChestExpanded(!chestExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-muted hover:bg-muted/80 transition-colors"
          >
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Chest & Thoracic Analysis
            </span>
            {chestExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          {chestExpanded && (
            <div className="px-4 py-3 space-y-1.5 text-xs">
              {chestRows.filter(([, v]) => v && v !== "not visible").map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-primary text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : chest === undefined ? null : (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" />
            Chest analysis unavailable — for best results, upload a photo showing the chest area in a fitted top or shirtless.
          </p>
        </div>
      )}

      {/* Arm Analysis collapsible */}
      {hasArmData ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setArmExpanded(!armExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-muted hover:bg-muted/80 transition-colors"
          >
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              Arm & Upper Limb Analysis
            </span>
            {armExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          {armExpanded && (
            <div className="px-4 py-3 space-y-1.5 text-xs">
              {armRows.filter(([, v]) => v && v !== "not visible").map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-primary text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : arm === undefined ? null : (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5" />
            Arm analysis unavailable — arms not visible in the photo.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Analyze Another Photo
        </Button>
      </div>
    </div>
  );
};

export default ResultsCard;
