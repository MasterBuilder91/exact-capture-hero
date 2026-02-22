import { AnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import ResultsOverlay from "./ResultsOverlay";

interface ResultsCardProps {
  result: AnalysisResult;
  imageBase64: string;
  onReset: () => void;
}

const ResultsCard = ({ result, imageBase64, onReset }: ResultsCardProps) => {
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
