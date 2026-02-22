import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Eye, Info, Camera } from "lucide-react";
import { NeckAnalysis } from "@/types/analysis";

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
  concealmentScore?: number;
  concealmentReasons?: string[];
  neckAnalysis?: NeckAnalysis;
  betterPhotoSuggestion?: string | null;
}

const getConcealmentColor = (score: number) => {
  if (score <= 25) return "bg-confidence-high";
  if (score <= 50) return "bg-confidence-moderate";
  if (score <= 75) return "bg-orange-500";
  return "bg-destructive";
};

const getConcealmentLabel = (score: number) => {
  if (score <= 25) return "No significant concealment";
  if (score <= 50) return "Some features obscured";
  if (score <= 75) return "Multiple features obscured";
  return "High concealment detected";
};

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
  concealmentScore,
  concealmentReasons,
  neckAnalysis,
  betterPhotoSuggestion,
}: ResultsOverlayProps) => {
  const [expanded, setExpanded] = useState(false);
  const [neckExpanded, setNeckExpanded] = useState(false);

  const probPercent = maleProbability ?? 50;
  const maleLabel = `${probPercent}% Male`;
  const femaleLabel = `${100 - probPercent}% Female`;

  const hasNeckData = neckAnalysis && neckAnalysis.confidence_contribution !== "inconclusive";
  const showConcealmentBanner = concealmentScore !== undefined && concealmentScore > 50;
  const showBetterPhoto = betterPhotoSuggestion && concealmentScore !== undefined && concealmentScore > 40;

  return (
    <div className="space-y-3">
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
            {/* Concealment badge */}
            {concealmentScore !== undefined && (
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium text-primary-foreground flex items-center gap-1",
                  getConcealmentColor(concealmentScore)
                )}
              >
                <Eye className="w-3 h-3" />
                Concealment: {concealmentScore}%
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
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/40" />
              </div>
              <p className="text-[9px] text-white/50 mt-1 text-center">
                Confidence reflects agreement between multiple anatomical markers. No visual analysis is definitive.
              </p>
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

      {/* Neck Analysis collapsible */}
      {hasNeckData && (
        <div className="max-w-lg mx-auto rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setNeckExpanded(!neckExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-muted hover:bg-muted/80 transition-colors"
          >
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Additional Markers — Neck & Throat
            </span>
            {neckExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          {neckExpanded && (
            <div className="px-4 py-3 space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Adam's Apple</span><span className="font-mono text-primary">{neckAnalysis!.adams_apple}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Neck Width Ratio</span><span className="font-mono text-primary">{neckAnalysis!.neck_width_ratio}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Muscle Definition</span><span className="font-mono text-primary">{neckAnalysis!.muscle_definition}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Trachea Visibility</span><span className="font-mono text-primary">{neckAnalysis!.trachea_visibility}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Contribution</span><span className="font-mono text-primary">{neckAnalysis!.confidence_contribution}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Concealment banner */}
      {showConcealmentBanner && (
        <div className="max-w-lg mx-auto rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {getConcealmentLabel(concealmentScore!)}
          </p>
          {concealmentReasons && concealmentReasons.length > 0 && (
            <ul className="text-[11px] text-muted-foreground list-disc list-inside space-y-0.5">
              {concealmentReasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Better photo suggestion */}
      {showBetterPhoto && (
        <div className="max-w-lg mx-auto rounded-lg border border-accent/50 bg-accent/10 px-4 py-3">
          <p className="text-xs font-medium text-accent-foreground flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            Suggestion for Better Results
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">{betterPhotoSuggestion}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsOverlay;
