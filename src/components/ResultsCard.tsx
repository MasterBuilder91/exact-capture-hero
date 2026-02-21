import { AnalysisResult } from "@/types/analysis";
import { cn } from "@/lib/utils";
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
      />

      {/* Breakdown table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Measurement</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 text-foreground">Shoulder Width</td>
              <td className="px-4 py-3 text-right font-mono text-primary">{result.shoulder_width}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-foreground">Hip Width</td>
              <td className="px-4 py-3 text-right font-mono text-primary">{result.hip_width}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-foreground">Shoulder-to-Hip Ratio</td>
              <td className="px-4 py-3 text-right font-mono text-primary">{result.shoulder_to_hip_ratio}</td>
            </tr>
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
