import { VoiceAnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceResultsCardProps {
  result: VoiceAnalysisResult;
  onReset: () => void;
}

const formatValue = (val: string) => val.replace(/_/g, " ");

const VoiceResultsCard = ({ result, onReset }: VoiceResultsCardProps) => {
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

  const probPercent = result.maleProbability ?? 50;

  const rows: [string, string][] = [
    ["Fundamental Frequency", result.fundamental_frequency_estimate],
    ["Pitch Range", formatValue(result.pitch_range)],
    ["Formant Assessment", formatValue(result.formant_assessment)],
    ["Vocal Tract Length", formatValue(result.vocal_tract_length)],
    ["Speech Patterns", result.speech_patterns],
    ["Voice Training Detected", result.voice_training_detected ? "Yes — suspected" : "No"],
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Result header */}
      <div className="rounded-lg border border-border p-5 bg-card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("px-5 py-2 rounded-full text-base font-bold tracking-wide uppercase text-primary-foreground", sexColor)}>
            {sexLabel}
          </span>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium text-primary-foreground", confidenceColor)}>
            {result.confidence} Confidence
          </span>
        </div>

        {/* Probability bar */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{100 - probPercent}% Female</span>
            <span>{probPercent}% Male</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-result-female/30 relative">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${probPercent}%`,
                background: `linear-gradient(90deg, hsl(330 70% 56%), hsl(222 80% 58%))`,
              }}
            />
            <div className="absolute inset-y-0 left-1/2 w-px bg-muted-foreground/40" />
          </div>
        </div>

        {result.voice_training_detected && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent-foreground">Voice training suspected — pitch may not reflect natal vocal cords</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Detail table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Marker</th>
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
          Analyze Another Recording
        </Button>
      </div>
    </div>
  );
};

export default VoiceResultsCard;
