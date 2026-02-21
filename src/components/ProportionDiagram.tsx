const ProportionDiagram = () => (
  <div className="flex items-center justify-center gap-12 py-6">
    {/* Male silhouette */}
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="120" viewBox="0 0 80 120" className="text-result-male">
        {/* Head */}
        <circle cx="40" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Broad shoulders */}
        <line x1="12" y1="38" x2="68" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Torso */}
        <line x1="12" y1="38" x2="24" y2="80" stroke="currentColor" strokeWidth="2" />
        <line x1="68" y1="38" x2="56" y2="80" stroke="currentColor" strokeWidth="2" />
        {/* Narrower hips */}
        <line x1="24" y1="80" x2="56" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Legs */}
        <line x1="28" y1="80" x2="24" y2="115" stroke="currentColor" strokeWidth="2" />
        <line x1="52" y1="80" x2="56" y2="115" stroke="currentColor" strokeWidth="2" />
        {/* Shoulder marker */}
        <line x1="12" y1="34" x2="12" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="68" y1="34" x2="68" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        Male typical
      </span>
    </div>

    {/* Female silhouette */}
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="120" viewBox="0 0 80 120" className="text-result-female">
        {/* Head */}
        <circle cx="40" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Narrower shoulders */}
        <line x1="18" y1="38" x2="62" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Torso - tapers out */}
        <line x1="18" y1="38" x2="14" y2="80" stroke="currentColor" strokeWidth="2" />
        <line x1="62" y1="38" x2="66" y2="80" stroke="currentColor" strokeWidth="2" />
        {/* Broader hips */}
        <line x1="14" y1="80" x2="66" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Legs */}
        <line x1="20" y1="80" x2="24" y2="115" stroke="currentColor" strokeWidth="2" />
        <line x1="60" y1="80" x2="56" y2="115" stroke="currentColor" strokeWidth="2" />
        {/* Hip marker */}
        <line x1="14" y1="76" x2="14" y2="84" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="66" y1="76" x2="66" y2="84" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        Female typical
      </span>
    </div>
  </div>
);

export default ProportionDiagram;
