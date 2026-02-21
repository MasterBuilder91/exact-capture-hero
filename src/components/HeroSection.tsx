import ProportionDiagram from "./ProportionDiagram";
import { Scan } from "lucide-react";

interface HeroSectionProps {
  onUploadClick: () => void;
}

const HeroSection = ({ onUploadClick }: HeroSectionProps) => (
  <div className="text-center space-y-6 py-8">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs text-muted-foreground">
      <Scan className="w-3.5 h-3.5 text-primary" />
      Anatomy-based analysis
    </div>
    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
      Proportion<span className="text-primary"> Analyzer</span>
    </h1>
    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
      Upload a photo to analyze shoulder-to-hip skeletal proportions using AI vision. 
      Based on well-documented anatomical principles.
    </p>
    <ProportionDiagram />
  </div>
);

export default HeroSection;
