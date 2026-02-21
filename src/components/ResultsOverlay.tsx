import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResultsOverlayProps {
  imageBase64: string;
  sexLabel: string;
  sexColor: string;
  confidenceLabel: string;
  confidenceColor: string;
  reasoning: string;
}

const ResultsOverlay = ({
  imageBase64,
  sexLabel,
  sexColor,
  confidenceLabel,
  confidenceColor,
  reasoning,
}: ResultsOverlayProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative max-w-lg mx-auto rounded-lg overflow-hidden border border-border">
      <img
        src={imageBase64}
        alt="Analyzed photo"
        className="w-full h-auto max-h-[28rem] object-contain bg-muted"
      />

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
        </div>

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
