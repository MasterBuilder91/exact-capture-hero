import { FaceAnalysisResult } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FaceResultsCardProps {
  result: FaceAnalysisResult;
  onReset: () => void;
}

const FaceResultsCard = ({ result, onReset }: FaceResultsCardProps) => {
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
    ["Forehead Type", result.foreheadType],
    ["Brow Ridge", result.browRidge],
    ["Orbital Shape", result.orbitalShape],
    ["Nose Type", result.noseType],
    ["Cheekbones", result.cheekbones],
    ["Jaw & Chin", result.jawChinType],
    ["Face Shape", result.faceShape],
    ["Glabella", result.glabella],
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex flex-col items-center gap-3">
        <span className={cn("px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide uppercase text-primary-foreground", sexColor)}>
          {sexLabel}
        </span>
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium text-primary-foreground", confidenceColor)}>
          {result.confidence} Confidence
        </span>
      </div>

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

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">AI Analysis</h3>
        <p className="text-sm text-secondary-foreground leading-relaxed">{result.reasoning}</p>
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

export default FaceResultsCard;
