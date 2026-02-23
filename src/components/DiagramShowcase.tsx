import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import diagramFemaleSkeleton from "@/assets/diagram_female_skeleton.png";
import diagramMaleSkeleton from "@/assets/diagram_male_skeleton.png";
import diagramFaceMarkers from "@/assets/diagram_face_markers.png";
import diagramGaitBiomechanics from "@/assets/diagram_gait_biomechanics.png";
import diagramVoiceMarkers from "@/assets/diagram_voice_markers.png";
import diagramHandsMarkers from "@/assets/diagram_hands_markers.png";

const diagrams = [
  {
    src: diagramMaleSkeleton,
    alt: "Male skeletal markers",
    label: "Male Skeleton",
    color: "primary" as const,
  },
  {
    src: diagramFemaleSkeleton,
    alt: "Female skeletal markers",
    label: "Female Skeleton",
    color: "accent" as const,
  },
  {
    src: diagramFaceMarkers,
    alt: "Facial sex markers comparison",
    label: "Facial Markers",
    color: "primary" as const,
  },
  {
    src: diagramHandsMarkers,
    alt: "Hand and digit ratio markers",
    label: "Hand & Digit Ratio",
    color: "accent" as const,
  },
  {
    src: diagramVoiceMarkers,
    alt: "Voice and acoustic markers",
    label: "Voice Analysis",
    color: "primary" as const,
  },
  {
    src: diagramGaitBiomechanics,
    alt: "Gait biomechanics comparison",
    label: "Gait Biomechanics",
    color: "accent" as const,
  },
];

const DiagramShowcase = () => (
  <section className="py-20 px-4 overflow-hidden">
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
          Forensic Anthropology
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold">
          The <span className="gradient-brand-text">Science</span> Behind It
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          Our AI analyzes the same immutable skeletal markers used by forensic scientists — bone structure that cannot be altered by hormones or surgery.
        </p>
      </div>

      {/* Top row: 2 large skeletons side by side */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {diagrams.slice(0, 2).map((d) => (
          <div
            key={d.label}
            className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)]"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={d.src}
                alt={d.alt}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-4 pt-10">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground/80">
                {d.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: 4 smaller diagrams */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {diagrams.slice(2).map((d) => (
          <div
            key={d.label}
            className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)]"
          >
            <div className="aspect-[3/5] overflow-hidden">
              <img
                src={d.src}
                alt={d.alt}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-3 pt-8">
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/80">
                {d.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link to="/science">
            <FlaskConical className="w-4 h-4" />
            Explore the Full Science
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default DiagramShowcase;
