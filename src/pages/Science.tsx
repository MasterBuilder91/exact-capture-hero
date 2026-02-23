import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bone, Skull, Footprints, Mic, Hand, ArrowRight } from "lucide-react";

import diagramFemaleSkeleton from "@/assets/diagram_female_skeleton.png";
import diagramMaleSkeleton from "@/assets/diagram_male_skeleton.png";
import diagramFaceMarkers from "@/assets/diagram_face_markers.png";
import diagramGaitBiomechanics from "@/assets/diagram_gait_biomechanics.png";
import diagramVoiceMarkers from "@/assets/diagram_voice_markers.png";
import diagramHandsMarkers from "@/assets/diagram_hands_markers.png";

/* ── reusable pieces ─────────────────────────────────────────── */

const KeyInsight = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 mt-6">
    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Key Insight</p>
    <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
  </div>
);

const SectionDivider = () => (
  <div className="w-full flex justify-center py-12">
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
  </div>
);

interface ScienceSectionProps {
  title: string;
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
}

const ScienceSection = ({ title, icon, imageSrc, imageAlt, children }: ScienceSectionProps) => (
  <section className="space-y-6">
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
        {title}
      </h2>
    </div>

    <div className="rounded-lg overflow-hidden border border-border bg-card">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-auto object-contain"
        loading="lazy"
      />
    </div>

    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
      {children}
    </div>
  </section>
);

/* ── module cards for Section 7 ──────────────────────────────── */

const modules = [
  { icon: "🦴", title: "Body Proportions", desc: "Shoulder-to-hip ratio, rib cage geometry" },
  { icon: "👤", title: "Face Analysis", desc: "Brow ridge, orbital shape, jaw angle, forehead slope" },
  { icon: "✋", title: "Hand Analysis", desc: "2D:4D digit ratio, metacarpal length, wrist width" },
  { icon: "👕", title: "Chest Analysis", desc: "Sternum structure, costal angle, implant detection" },
  { icon: "🗣", title: "Neck Analysis", desc: "Adam's apple, neck width, muscle definition" },
  { icon: "💪", title: "Arms Analysis", desc: "Carrying angle, muscle distribution, vascularity" },
  { icon: "🎙", title: "Voice Analysis", desc: "Pitch, formant frequencies, vocal tract estimation" },
  { icon: "🚶", title: "Gait Analysis", desc: "Hip sway, step width, shoulder rotation, stride pattern" },
];

/* ── page ─────────────────────────────────────────────────────── */

const Science = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Sticky back button */}
      <div className="sticky top-14 z-40 flex justify-end px-4 py-2">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2 bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Analysis
          </Button>
        </Link>
      </div>

      <main className="flex-1 container max-w-3xl px-4 pb-20 space-y-0">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="text-center py-16 sm:py-24 space-y-5">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight gradient-brand-text">
            Bone Doesn't Lie
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            The forensic science behind biological sex determination — markers that exist from birth
            and cannot be changed by hormones, surgery, or presentation.
          </p>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Born Male Born Female analyzes 8 categories of immutable biological markers using forensic
            anthropology, craniofacial science, biomechanics, and acoustic phonetics.
          </p>
        </section>

        {/* ── SECTION 1: FEMALE SKELETAL ───────────────────────── */}
        <ScienceSection
          title="Skeletal Structure — Female Markers"
          icon={<Bone className="w-5 h-5" />}
          imageSrc={diagramFemaleSkeleton}
          imageAlt="Female skeletal markers diagram showing rounded orbital sockets, minimal brow ridge, wider pelvis, and greater femur Q-angle"
        >
          <p>
            The female skeleton develops under the influence of estrogen during puberty, creating a
            distinct morphology that persists throughout life. The most diagnostically reliable marker
            is the pelvis: the female gynecoid pelvis is significantly wider than the male android
            pelvis, with a subpubic angle greater than 90 degrees forming a wide V-shape. Forensic
            anthropologists can determine biological sex from skeletal remains alone with over 95%
            accuracy using pelvic measurements.
          </p>
          <p>
            The orbital sockets (eye sockets) are rounder and larger relative to face size in
            biological females, while the brow ridge (supraorbital ridge) is minimal or absent. The
            femur Q-angle — the angle between the femur and the tibia — is greater in females due to
            the wider pelvis, causing the characteristic inward angle of the thighs. These skeletal
            proportions are established during fetal development and cannot be altered.
          </p>
          <KeyInsight>
            Hormones and surgery can alter soft tissue, fat distribution, and muscle mass — but they
            cannot reshape bone. A biological female's skeleton retains its female morphology regardless
            of any medical intervention.
          </KeyInsight>
        </ScienceSection>

        <SectionDivider />

        {/* ── SECTION 2: MALE SKELETAL ─────────────────────────── */}
        <ScienceSection
          title="Skeletal Structure — Male Markers"
          icon={<Bone className="w-5 h-5" />}
          imageSrc={diagramMaleSkeleton}
          imageAlt="Male skeletal markers diagram showing prominent brow ridge, square orbital sockets, narrow pelvis, and barrel-shaped rib cage"
        >
          <p>
            The male skeleton develops under the influence of testosterone, producing a morphology
            optimized for upper-body strength and mechanical leverage. The brow ridge (supraorbital
            ridge) is the most visually prominent marker — a heavy horizontal shelf of bone above the
            eye sockets that creates the characteristic male "brow shadow." The orbital sockets are
            squarer and smaller relative to face size.
          </p>
          <p>
            The male pelvis is narrow and funnel-shaped (android type), with a subpubic angle less
            than 90 degrees. The rib cage is wider and more barrel-shaped, with a wider costal angle
            below the sternum. The skull is longer and more rectangular, with a larger mastoid process
            (the bony protrusion behind the ear) and a more prominent chin. These markers are used by
            forensic anthropologists in skeletal sex determination.
          </p>
          <KeyInsight>
            The male brow ridge, orbital shape, and pelvic structure are the three most reliable
            skeletal sex markers. These cannot be hidden by makeup, hair, or clothing — and surgical
            modification (FFS) can only partially reduce them.
          </KeyInsight>
        </ScienceSection>

        <SectionDivider />

        {/* ── SECTION 3: FACIAL BONE STRUCTURE ─────────────────── */}
        <ScienceSection
          title="Facial Bone Structure"
          icon={<Skull className="w-5 h-5" />}
          imageSrc={diagramFaceMarkers}
          imageAlt="Facial sex markers diagram comparing female and male craniofacial features including forehead shape, brow ridge, orbital rims, jaw angle, and chin shape"
        >
          <p>
            Craniofacial sexual dimorphism — the measurable differences between male and female skull
            structure — is one of the most studied areas in forensic anthropology. The face is a direct
            surface expression of the underlying skull, meaning that bone structure is visible through
            skin. Key markers include the forehead slope, brow ridge prominence, orbital shape, jaw
            angle (gonial angle), and chin shape.
          </p>
          <p>
            Facial Feminization Surgery (FFS) can modify some of these markers, but complete
            elimination is rarely achieved. The gonial angle (jaw angle), forehead slope, and orbital
            rim shape are particularly difficult to fully feminize surgically. Additionally, the
            overall face height (distance from hairline to chin) is greater in biological males and
            cannot be reduced.
          </p>
          <KeyInsight>
            The human eye is extraordinarily sensitive to craniofacial sexual dimorphism — we recognize
            it instantly. Born Male Born Female's face analysis quantifies what your instincts already
            detect.
          </KeyInsight>
        </ScienceSection>

        <SectionDivider />

        {/* ── SECTION 4: GAIT BIOMECHANICS ─────────────────────── */}
        <ScienceSection
          title="Gait Biomechanics"
          icon={<Footprints className="w-5 h-5" />}
          imageSrc={diagramGaitBiomechanics}
          imageAlt="Gait biomechanics diagram comparing female and male walking patterns, showing hip sway, step width, pelvic rotation, and center of gravity differences"
        >
          <p>
            How a person walks is directly determined by their skeletal architecture — specifically the
            width of the pelvis and the femur Q-angle. In biological females, the wider pelvis creates
            a greater Q-angle, causing the femurs to angle inward from hip to knee. This produces the
            characteristic female gait: lateral hip sway of 4–7cm per step, pelvic rotation with each
            stride, and a narrow step width where feet nearly cross the midline.
          </p>
          <p>
            In biological males, the narrower pelvis and smaller Q-angle produce a fundamentally
            different gait: hips remain square and flat, shoulders rotate with each stride instead of
            hips, arms swing outward from the body, and the step width is wider with feet planted
            straight. This gait pattern is neurologically encoded and extremely difficult to
            consciously override — especially under natural, unguarded conditions.
          </p>
          <KeyInsight>
            Gait analysis is used by forensic gait experts in criminal investigations. The
            biomechanical signature of biological sex is present in every step and is detectable even
            through clothing and from a distance.
          </KeyInsight>
        </ScienceSection>

        <SectionDivider />

        {/* ── SECTION 5: VOICE & ACOUSTIC MARKERS ──────────────── */}
        <ScienceSection
          title="Voice & Acoustic Markers"
          icon={<Mic className="w-5 h-5" />}
          imageSrc={diagramVoiceMarkers}
          imageAlt="Voice and acoustic markers diagram comparing female and male vocal anatomy, showing vocal tract length, vocal cord size, and formant frequency differences"
        >
          <p>
            The human voice is produced by the interaction of the vocal cords and the vocal tract — the
            resonating chamber from the larynx to the lips. Biological sex creates permanent
            differences in both. Male vocal cords are 17–25mm long (vs. 12–17mm in females), producing
            a lower fundamental pitch. More importantly, the male vocal tract is 16–17cm long (vs.
            13–14cm in females), creating lower formant frequencies — the resonant peaks that give
            voice its characteristic timbre.
          </p>
          <p>
            Hormone therapy can raise the fundamental pitch of a male voice, but it cannot shorten the
            vocal tract. This means that even a trained high-pitched voice will retain the wider
            formant spacing characteristic of a longer vocal tract. This acoustic signature — the
            relationship between F1, F2, and F3 formant frequencies — is measurable and distinct from
            natal female voice even when pitch is matched.
          </p>
          <KeyInsight>
            Forensic voice analysis uses formant frequencies, not just pitch, to determine biological
            sex. A trained high-pitched voice and a natal female voice produce different acoustic
            fingerprints.
          </KeyInsight>
        </ScienceSection>

        <SectionDivider />

        {/* ── SECTION 6: HAND & DIGIT MARKERS ──────────────────── */}
        <ScienceSection
          title="Hand & Digit Markers"
          icon={<Hand className="w-5 h-5" />}
          imageSrc={diagramHandsMarkers}
          imageAlt="Hand and digit markers diagram comparing female and male hand anatomy, showing 2D:4D digit ratio, palm width, metacarpal length, and wrist circumference"
        >
          <p>
            The 2D:4D digit ratio — the ratio of the index finger (2nd digit) length to the ring
            finger (4th digit) length — is determined by prenatal testosterone exposure in the womb
            during weeks 9–16 of fetal development. In biological males, prenatal testosterone causes
            the ring finger to grow longer than the index finger, producing a 2D:4D ratio less than
            1.0. In biological females, the index finger is equal to or longer than the ring finger,
            producing a ratio of approximately 1.0 or greater.
          </p>
          <p>
            This ratio is established before birth and cannot be changed by any post-natal hormone
            exposure or surgery. It is a permanent record of the prenatal hormonal environment.
            Additionally, overall hand size, metacarpal bone length, palm width, and wrist
            circumference are all sexually dimorphic and persist regardless of hormone therapy.
          </p>
          <KeyInsight>
            The 2D:4D ratio is one of the few biological sex markers that is completely unaffected by
            any medical transition. It is a permanent prenatal record.
          </KeyInsight>
        </ScienceSection>

        <SectionDivider />

        {/* ── SECTION 7: HOW IT WORKS ──────────────────────────── */}
        <section className="space-y-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-center text-foreground">
            8 Analysis Modules. One Verdict.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {modules.map((m) => (
              <div
                key={m.title}
                className="rounded-lg border border-border bg-card p-4 text-center space-y-2"
              >
                <span className="text-2xl">{m.icon}</span>
                <p className="text-xs font-bold text-foreground">{m.title}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto">
            Born Male Born Female combines these 8 modules to produce a comprehensive biological sex
            assessment. No single marker is definitive — the power is in the convergence of multiple
            independent signals.
          </p>

          <div className="flex justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 gradient-brand text-primary-foreground">
                Start Your Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ── FOOTER NOTE ──────────────────────────────────────── */}
        <div className="pt-16 pb-4">
          <p className="text-[10px] text-muted-foreground/60 text-center max-w-xl mx-auto leading-relaxed">
            All analysis is based on published forensic anthropology, craniofacial morphology,
            biomechanics, and acoustic phonetics research. Born Male Born Female does not make claims about
            gender identity — only biological sex markers as defined by skeletal anatomy and physiology.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Science;
