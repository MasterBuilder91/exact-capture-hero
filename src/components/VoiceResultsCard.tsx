import { VoiceAnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceResultsCardProps {
  result: VoiceAnalysisResult;
  onReset: () => void;
}

const VoiceResultsCard = ({ result, onReset }: VoiceResultsCardProps) => {
  const resultMap: Record<string, { label: string; color: string }> = {
    likely_male: { label: "Likely Male", color: "bg-result-male" },
    likely_female: { label: "Likely Female", color: "bg-result-female" },
    inconclusive: { label: "Inconclusive", color: "bg-result-inconclusive" },
  };

  const { label: sexLabel, color: sexColor } = resultMap[result.result] || resultMap.inconclusive;

  const confidencePercent = result.confidence_score ?? 50;
  const probPercent = result.maleProbability ?? 50;

  const pitchLabel = {
    male_typical: "Male Typical",
    female_typical: "Female Typical",
    overlap_zone: "Overlap Zone",
  }[result.pitch_assessment] || result.pitch_assessment;

  const formantLabel = {
    male_typical: "Male Typical",
    female_typical: "Female Typical",
    ambiguous: "Ambiguous",
  }[result.formant_assessment] || result.formant_assessment;

  const rows: [string, string][] = [
    ["Measured Pitch (F0)", result.measured_pitch_hz ? `${result.measured_pitch_hz.toFixed(1)} Hz` : "N/A"],
    ["Pitch Assessment", pitchLabel],
    ["Vocal Tract Resonance (Formants)", formantLabel],
    ["F1 Formant", result.measured_f1_hz ? `${result.measured_f1_hz.toFixed(0)} Hz` : "N/A"],
    ["F2 Formant", result.measured_f2_hz ? `${result.measured_f2_hz.toFixed(0)} Hz` : "N/A"],
    ["Voice Training Detected", result.voice_training_suspected ? "Yes — suspected" : "No"],
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Privacy info box */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          🔬 This module measures real acoustic data from your audio file — fundamental frequency, formant frequencies, and spectral characteristics — using your browser's built-in audio processing. No audio is stored or transmitted. Only the extracted measurements are sent for analysis.
        </p>
      </div>

      {/* Result header */}
      <div className="rounded-lg border border-border p-5 bg-card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("px-5 py-2 rounded-full text-base font-bold tracking-wide uppercase text-primary-foreground", sexColor)}>
            {sexLabel}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {confidencePercent}% Confidence
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

        {result.voice_training_suspected && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-accent mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-accent-foreground">Voice training suspected</span>
              {result.voice_training_reason && (
                <p className="text-xs text-muted-foreground">{result.voice_training_reason}</p>
              )}
            </div>
          </div>
        )}

        {result.key_finding && (
          <p className="text-sm font-medium text-foreground">{result.key_finding}</p>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Detail table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Marker</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Measurement</th>
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
