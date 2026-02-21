import { AlertTriangle } from "lucide-react";

const Disclaimer = () => (
  <div className="rounded-lg border border-border bg-muted/50 p-4 flex gap-3 items-start max-w-2xl mx-auto">
    <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
    <p className="text-sm text-muted-foreground leading-relaxed">
      This tool provides an educational estimate based on visible body proportions and anatomical principles. 
      It is not a definitive determination of gender identity or biological sex. Results may be inaccurate 
      depending on clothing, photo angle, image quality, or body type variation. Use responsibly.
    </p>
  </div>
);

export default Disclaimer;
