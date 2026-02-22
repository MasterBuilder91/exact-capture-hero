import { GaitAnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GaitResultsCardProps {
  result: GaitAnalysisResult;
  onReset: () => void;
}

const gaitLabels: Record<string, Record<string, string>> = {
  pelvic_rotation: { high_female: "High (female-typical)", low_male: "Low (male-typical)", ambiguous: "Ambiguous" },
  step_width: { narrow_female: "Narrow midline (female-typical)", wide_male: "Wide base (male-typical)", ambiguous: "Ambiguous" },
  arm_swing: { medial_female: "Medial crossing (female-typical)", lateral_male: "Lateral parallel (male-typical)", ambiguous: "Ambiguous" },
  stride_type: { hip_led_female: "Hip-led (female-typical)", shoulder_led_male: "Shoulder-led (male-typical)", ambiguous: "Ambiguous" },
  knee_tracking: { convergent_female: "Convergent (female-typical)", parallel_male: "Parallel (male-typical)", ambiguous: "Ambiguous" },
};

const GaitResultsCard = ({ result, onReset }: GaitResultsCardProps) => {
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
    ["Pelvic Rotation / Hip Sway", gaitLabels.pelvic_rotation[result.pelvic_rotation] || result.pelvic_rotation],
    ["Step Width", gaitLabels.step_width[result.step_width] || result.step_width],
    ["Arm Swing", gaitLabels.arm_swing[result.arm_swing] || result.arm_swing],
    ["Stride Type", gaitLabels.stride_type[result.stride_type] || result.stride_type],
    ["Knee Tracking", gaitLabels.knee_tracking[result.knee_tracking] || result.knee_tracking],
    ["Upper Body Movement", result.upper_body_movement],
    ["Cadence & Stride", result.cadence_stride],
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
          Analyze Another Video
        </Button>
      </div>
    </div>
  );
};

export default GaitResultsCard;
