import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck } from "lucide-react";

interface ResultsOverlayProps {
  imageBase64: string;
  sexLabel: string;
  sexColor: string;
  confidenceLabel: string;
  confidenceColor: string;
  reasoning: string;
  maleProbability?: number;
  obstructionDetected?: boolean;
  obstructionType?: string | null;
  obstructionSeverity?: "minor" | "moderate" | "severe" | null;
  rekognition?: { gender: string; confidence: number } | null;
}

const ResultsOverlay = ({
  imageBase64,
  sexLabel,
  sexColor,
  confidenceLabel,
  confidenceColor,
  reasoning,
  maleProbability,
  obstructionDetected,
  obstructionType,
  obstructionSeverity,
  rekognition,
}: ResultsOverlayProps) => {
  const [expanded, setExpanded] = useState(false);

  const probPercent = maleProbability ?? 50;
  const maleLabel = `${probPercent}% Male`;
  const femaleLabel = `${100 - probPercent}% Female`;

  return (
    <div className="relative max-w-lg mx-auto rounded-lg overflow-hidden border border-border">
      <img
        src={imageBase64}
        alt="Analyzed photo"
        className="w-full h-auto max-h-[28rem] object-contain bg-muted"
      />

      {/* Obstruction warning banner */}
      {obstructionDetected && obstructionSeverity && (
        <div
          className={cn(
            "absolute top-0 left-0 right-0 px-4 py-2 flex items-center gap-2 text-xs font-medium",
            obstructionSeverity === "severe"
              ? "bg-destructive/90 text-destructive-foreground"
              : obstructionSeverity === "moderate"
              ? "bg-confidence-moderate/90 text-primary-foreground"
              : "bg-muted/90 text-foreground"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {obstructionSeverity === "severe"
              ? "Severe obstruction detected — results unreliable"
              : `Obstruction detected: ${obstructionType || "possible interference"}`}
          </span>
        </div>
      )}

      {/* Overlay panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/65 backdrop-blur-sm p-4 animate-overlay-fade-in">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={cn(
              "px-5 py-2 rounded-full text-base font-bold tracking-wide uppercase text-primary-foreground",
              sexColor
            )}
          >
            {sexLabel}
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium text-primary-foreground",
              confidenceColor
            )}
          >
            {confidenceLabel}
          </span>
          {rekognition && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              AWS: {rekognition.gender} ({rekognition.confidence}%)
            </span>
          )}
        </div>

        {/* Probability bar */}
        {maleProbability !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/70 mb-1">
              <span>{femaleLabel}</span>
              <span>{maleLabel}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-result-female/30 relative">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${probPercent}%`,
                  background: `linear-gradient(90deg, hsl(330 70% 56%), hsl(222 80% 58%))`,
                }}
              />
              {/* Center tick */}
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/40" />
            </div>
          </div>
        )}

        <div className="relative">
          <p
            className={cn(
              "text-xs text-white/90 leading-relaxed transition-all duration-300",
              !expanded && "line-clamp-2"
            )}
          >
            {reasoning}
          </p>
          {reasoning.length > 140 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-primary font-medium mt-1 hover:underline"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;
