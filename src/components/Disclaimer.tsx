import { AlertTriangle } from "lucide-react";

const Disclaimer = () => (
  <div className="rounded-lg border border-border bg-muted/50 p-4 flex gap-3 items-start max-w-2xl mx-auto">
    <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
    <p className="text-sm text-muted-foreground leading-relaxed">
      DateCheck provides educational estimates based on anatomical proportion analysis.
      Results are not a definitive determination of biological sex or gender identity.
      For informational purposes only. Use responsibly.
    </p>
  </div>
);

export default Disclaimer;
