import { HandAnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import ResultsOverlay from "./ResultsOverlay";

interface HandsResultsCardProps {
  result: HandAnalysisResult;
  imageBase64: string;
  onReset: () => void;
}

const HandsResultsCard = ({ result, imageBase64, onReset }: HandsResultsCardProps) => {
  const sexColor = {
    Male: "bg-result-male",
    Female: "bg-result-female",
    Inconclusive: "bg-result-inconclusive",
  }[result.estimatedSex];

  const sexLabel = {
    Male: "Likely Male",
    Female: "Likely Female",
    Inconclusive: "Inconclusive",
  }[result.estimatedSex];

  const confidenceColor = {
    High: "bg-confidence-high",
    Moderate: "bg-confidence-moderate",
    Low: "bg-confidence-low",
  }[result.confidence];

  const rows = [
    ["2D:4D Digit Ratio", result.digitRatio],
    ["Hand Size", result.handSize],
    ["Metacarpal Robustness", result.metacarpalRobustness],
    ["Knuckle Prominence", result.knuckleProminence],
    ["Finger Taper", result.fingerTaper],
    ["Wrist Width", result.wristWidth],
    ["Thenar Eminence", result.thenarEminence],
    ["Clavicle (if visible)", result.clavicle],
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <ResultsOverlay
        imageBase64={imageBase64}
        sexLabel={sexLabel}
        sexColor={sexColor}
        confidenceLabel={`${result.confidence} Confidence`}
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
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Feature</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(([label, value]) => (
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

export default HandsResultsCard;
