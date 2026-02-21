const AnalysisLoader = () => (
  <div className="flex flex-col items-center gap-6 py-12">
    <div className="relative w-20 h-20">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-border" />
      {/* Spinning arc */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      {/* Inner pulse */}
      <div className="absolute inset-3 rounded-full bg-primary/10 animate-pulse-glow" />
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm font-medium text-foreground">Analyzing proportions…</p>
      <p className="text-xs text-muted-foreground">AI is examining skeletal structure cues</p>
    </div>
  </div>
);

export default AnalysisLoader;
