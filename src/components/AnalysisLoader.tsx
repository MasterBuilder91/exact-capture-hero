interface AnalysisLoaderProps {
  title?: string;
  subtitle?: string;
}

const AnalysisLoader = ({
  title = "Analyzing proportions…",
  subtitle = "AI is examining skeletal structure cues",
}: AnalysisLoaderProps) => (
  <div className="flex flex-col items-center gap-6 py-12">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-2 border-border" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      <div className="absolute inset-3 rounded-full bg-primary/10 animate-pulse-glow" />
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

export default AnalysisLoader;
