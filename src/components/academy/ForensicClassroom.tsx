import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, ChevronRight, ChevronLeft, CheckCircle, Bone, Skull,
  Footprints, Mic, Hand, RotateCcw, GraduationCap, Scan, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import ZoomableImage from "./ZoomableImage";

import diagramFemaleSkeleton from "@/assets/diagram_female_skeleton.png";
import diagramMaleSkeleton from "@/assets/diagram_male_skeleton.png";
import diagramFaceMarkers from "@/assets/diagram_face_markers.png";
import diagramGaitBiomechanics from "@/assets/diagram_gait_biomechanics.png";
import diagramVoiceMarkers from "@/assets/diagram_voice_markers.png";
import diagramHandsMarkers from "@/assets/diagram_hands_markers.png";

/* ── Lesson data ──────────────────────────────────────────────── */

interface LessonSection {
  body: string;
  keyInsight?: string;
}

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  image: string;
  imageAlt: string;
  sections: LessonSection[];
  lookFor: string[];          // "what to look for" checklist
  cantBeChanged: string[];    // immutable markers summary
}

const LESSONS: Lesson[] = [
  {
    id: "female-skeleton",
    title: "Female Skeletal Markers",
    subtitle: "Pelvic shape, Q-angle, and proportions",
    icon: <Bone className="w-5 h-5" />,
    image: diagramFemaleSkeleton,
    imageAlt: "Female skeletal markers diagram",
    sections: [
      {
        body: "The female skeleton develops under estrogen's influence during puberty, creating a distinct morphology that persists throughout life. The most diagnostically reliable marker is the pelvis: the female gynecoid pelvis is significantly wider than the male android pelvis, with a subpubic angle greater than 90° forming a wide V-shape. Forensic anthropologists determine biological sex from skeletal remains alone with over 95% accuracy using pelvic measurements.",
        keyInsight: "The pelvis is the single most reliable skeletal sex marker — 95%+ accuracy. It evolved for childbirth and cannot be altered by hormones or surgery.",
      },
      {
        body: "The orbital sockets (eye sockets) are rounder and larger relative to face size in biological females, while the brow ridge (supraorbital ridge) is minimal or absent. The femur Q-angle — the angle between the femur and the tibia — is greater in females (15–20° vs 10–15°) due to the wider pelvis, causing the characteristic inward angle of the thighs. These skeletal proportions are established during development and cannot be altered.",
      },
    ],
    lookFor: [
      "Wide, circular pelvic inlet (gynecoid shape)",
      "Subpubic angle > 90° (wide V-shape)",
      "Greater femur Q-angle (thighs angle inward)",
      "Rounder, larger eye sockets relative to face",
      "Minimal or absent brow ridge",
      "Shoulder-to-hip ratio ~1.2:1",
    ],
    cantBeChanged: [
      "Pelvic width and shape",
      "Femur Q-angle and leg alignment",
      "Orbital socket shape",
      "Overall skeletal proportions",
    ],
  },
  {
    id: "male-skeleton",
    title: "Male Skeletal Markers",
    subtitle: "Brow ridge, rib cage, and pelvic structure",
    icon: <Bone className="w-5 h-5" />,
    image: diagramMaleSkeleton,
    imageAlt: "Male skeletal markers diagram",
    sections: [
      {
        body: "The male skeleton develops under testosterone, producing morphology optimized for upper-body strength and mechanical leverage. The brow ridge (supraorbital ridge) is the most visually prominent marker — a heavy horizontal shelf of bone above the eye sockets that creates the characteristic male \"brow shadow.\" The orbital sockets are squarer and smaller relative to face size.",
        keyInsight: "The male brow ridge, orbital shape, and pelvic structure are the three most reliable skeletal sex markers. They cannot be hidden by makeup, hair, or clothing — and surgical modification (FFS) can only partially reduce them.",
      },
      {
        body: "The male pelvis is narrow and funnel-shaped (android type), with a subpubic angle less than 90°. The rib cage is wider and more barrel-shaped, with a wider costal angle below the sternum. The skull is longer and more rectangular, with a larger mastoid process (the bony protrusion behind the ear) and a more prominent chin. These markers are permanent and used by forensic anthropologists worldwide.",
      },
    ],
    lookFor: [
      "Prominent brow ridge creating \"brow shadow\"",
      "Square, smaller orbital sockets",
      "Narrow, funnel-shaped pelvis (android type)",
      "Subpubic angle < 90° (narrow V-shape)",
      "Barrel-shaped rib cage with wider costal angle",
      "Larger mastoid process (behind the ear)",
      "Shoulder-to-hip ratio ~1.4:1 or greater",
    ],
    cantBeChanged: [
      "Brow ridge prominence (FFS only partially reduces)",
      "Pelvic shape and width",
      "Rib cage geometry",
      "Mastoid process size",
      "Skull length and shape",
    ],
  },
  {
    id: "facial-bone",
    title: "Facial Bone Structure",
    subtitle: "Forehead, jaw, orbits, and chin",
    icon: <Skull className="w-5 h-5" />,
    image: diagramFaceMarkers,
    imageAlt: "Facial sex markers comparison diagram",
    sections: [
      {
        body: "Craniofacial sexual dimorphism — the measurable differences between male and female skull structure — is one of the most studied areas in forensic anthropology. The face is a direct surface expression of the underlying skull, meaning that bone structure is visible through skin. Key markers include the forehead slope, brow ridge prominence, orbital shape, jaw angle (gonial angle), and chin shape.",
        keyInsight: "The human eye is extraordinarily sensitive to craniofacial sexual dimorphism — we recognize it instantly. These markers quantify what your instincts already detect.",
      },
      {
        body: "Facial Feminization Surgery (FFS) can modify some of these markers, but complete elimination is rarely achieved. The gonial angle (jaw angle), forehead slope, and orbital rim shape are particularly difficult to fully feminize surgically. Male mandibles have nearly right-angle gonial flaring (~90°), creating a square jaw. Female mandibles have more obtuse angles (~120°) creating a softer, more rounded jawline. The overall face height (hairline to chin) is greater in biological males and cannot be reduced.",
      },
    ],
    lookFor: [
      "Forehead slope: vertical (female) vs sloped back (male)",
      "Brow ridge: smooth (female) vs pronounced shelf (male)",
      "Orbital shape: round (female) vs rectangular (male)",
      "Gonial angle: ~120° obtuse (female) vs ~90° square (male)",
      "Chin: pointed/rounded (female) vs square/broad (male)",
      "Overall face height: shorter (female) vs longer (male)",
    ],
    cantBeChanged: [
      "Orbital rim shape",
      "Overall face height (hairline to chin distance)",
      "Complete gonial angle (surgery only partially modifies)",
      "Forehead bone structure (brow bossing can return)",
    ],
  },
  {
    id: "gait",
    title: "Gait Biomechanics",
    subtitle: "How skeletal structure dictates walking",
    icon: <Footprints className="w-5 h-5" />,
    image: diagramGaitBiomechanics,
    imageAlt: "Gait biomechanics comparison diagram",
    sections: [
      {
        body: "How a person walks is directly determined by their skeletal architecture — specifically the width of the pelvis and the femur Q-angle. In biological females, the wider pelvis creates a greater Q-angle, causing the femurs to angle inward from hip to knee. This produces the characteristic female gait: lateral hip sway of 4–7cm per step, pelvic rotation with each stride, and a narrow step width where feet nearly cross the midline.",
        keyInsight: "Gait analysis is used by forensic gait experts in criminal investigations. The biomechanical signature of biological sex is present in every step and is detectable even through clothing and from a distance.",
      },
      {
        body: "In biological males, the narrower pelvis and smaller Q-angle produce a fundamentally different gait: hips remain square and flat, shoulders rotate with each stride instead of hips, arms swing outward from the body, and the step width is wider with feet planted straight. This gait pattern is neurologically encoded and extremely difficult to consciously override — especially under natural, unguarded conditions.",
      },
    ],
    lookFor: [
      "Hip sway: 4–7cm lateral (female) vs minimal (male)",
      "Pelvic rotation: present (female) vs absent (male)",
      "Shoulder rotation: minimal (female) vs pronounced (male)",
      "Step width: narrow/crossing midline (female) vs wide (male)",
      "Arm swing: close to body (female) vs outward (male)",
      "Stride length: shorter (female) vs longer (male)",
    ],
    cantBeChanged: [
      "Pelvic width driving Q-angle",
      "Neurologically encoded gait pattern",
      "Biomechanical hip sway mechanics",
      "Natural step width and stride ratio",
    ],
  },
  {
    id: "voice",
    title: "Voice & Acoustic Markers",
    subtitle: "Pitch, formants, and vocal tract length",
    icon: <Mic className="w-5 h-5" />,
    image: diagramVoiceMarkers,
    imageAlt: "Voice and acoustic markers diagram",
    sections: [
      {
        body: "The human voice is produced by the interaction of the vocal cords and the vocal tract — the resonating chamber from the larynx to the lips. Biological sex creates permanent differences in both. Male vocal cords are 17–25mm long (vs. 12–17mm in females), producing a lower fundamental pitch (85–155 Hz vs 165–255 Hz). More importantly, the male vocal tract is 16–17cm long (vs. 13–14cm in females), creating lower formant frequencies.",
        keyInsight: "Forensic voice analysis uses formant frequencies, not just pitch, to determine biological sex. A trained high-pitched voice and a natal female voice produce different acoustic fingerprints.",
      },
      {
        body: "Hormone therapy can raise the fundamental pitch of a male voice, but it cannot shorten the vocal tract. This means that even a trained high-pitched voice will retain the wider formant spacing characteristic of a longer vocal tract. The relationship between F1, F2, and F3 formant frequencies is measurable and distinct from natal female voice even when pitch is matched. This acoustic signature is a permanent biological marker.",
      },
    ],
    lookFor: [
      "Fundamental frequency (F0): 165–255 Hz female vs 85–155 Hz male",
      "Vocal tract length: 13–14cm female vs 16–17cm male",
      "Formant spacing: wider in females (shorter tract)",
      "Vocal cord length: 12–17mm female vs 17–25mm male",
      "Resonance quality differences even at matched pitch",
    ],
    cantBeChanged: [
      "Vocal tract length (cannot be shortened)",
      "Formant frequency ratios",
      "Laryngeal cartilage size (Adam's apple)",
      "Acoustic fingerprint pattern",
    ],
  },
  {
    id: "hands",
    title: "Hand & Digit Markers",
    subtitle: "2D:4D ratio, palm width, and bone structure",
    icon: <Hand className="w-5 h-5" />,
    image: diagramHandsMarkers,
    imageAlt: "Hand and digit markers diagram",
    sections: [
      {
        body: "The 2D:4D digit ratio — the ratio of the index finger (2nd digit) length to the ring finger (4th digit) length — is determined by prenatal testosterone exposure in the womb during weeks 9–16 of fetal development. In biological males, prenatal testosterone causes the ring finger to grow longer than the index finger, producing a ratio less than 1.0 (~0.95). In biological females, the index finger is equal to or longer, producing a ratio of approximately 1.0 or greater.",
        keyInsight: "The 2D:4D ratio is one of the few biological sex markers that is completely unaffected by any medical transition. It is a permanent prenatal record set before birth.",
      },
      {
        body: "This ratio is established before birth and cannot be changed by any post-natal hormone exposure or surgery. It is a permanent record of the prenatal hormonal environment. Additionally, overall hand size, metacarpal bone length and robustness (thickness relative to length), palm width, and wrist circumference are all sexually dimorphic and persist regardless of hormone therapy. Males have more robust metacarpals while females have more gracile (slender) hand bones.",
      },
    ],
    lookFor: [
      "2D:4D ratio: ~1.0 (female) vs ~0.95 (male)",
      "Overall hand size: smaller (female) vs larger (male)",
      "Metacarpal robustness: gracile (female) vs robust (male)",
      "Palm width relative to finger length",
      "Wrist circumference differences",
    ],
    cantBeChanged: [
      "2D:4D digit ratio (set before birth)",
      "Metacarpal bone structure",
      "Overall hand skeletal proportions",
      "Wrist bone size and circumference",
    ],
  },
];

/* ── Component ────────────────────────────────────────────────── */

const ForensicClassroom = () => {
  const [state, setState] = useState<"menu" | "lesson">("menu");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const openLesson = (idx: number) => {
    setLessonIdx(idx);
    setSectionIdx(0);
    setState("lesson");
  };

  const lesson = LESSONS[lessonIdx];

  // Total "pages" per lesson: sections + lookFor page + summary page
  const totalPages = lesson.sections.length + 2;
  const isOnSection = sectionIdx < lesson.sections.length;
  const isOnLookFor = sectionIdx === lesson.sections.length;
  const isOnSummary = sectionIdx === lesson.sections.length + 1;

  const nextPage = () => {
    if (sectionIdx + 1 < totalPages) {
      setSectionIdx((i) => i + 1);
    } else {
      // Mark complete
      setCompleted((prev) => new Set(prev).add(lesson.id));
      setState("menu");
    }
  };

  const prevPage = () => {
    if (sectionIdx > 0) setSectionIdx((i) => i - 1);
  };

  /* ── MENU ──────────────────────────────────────────────────── */
  if (state === "menu") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl gradient-brand mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-display text-2xl font-bold">Forensic Classroom</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            A structured course on identifying biological sex markers. Study each category, learn what to look for, and understand what can never be changed.
          </p>
          <div className="flex justify-center">
            <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
              {completed.size}/{LESSONS.length} lessons completed
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {LESSONS.map((l, idx) => {
            const done = completed.has(l.id);
            return (
              <button
                key={l.id}
                onClick={() => openLesson(idx)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card transition-all text-left group hover:border-primary/30 hover:bg-secondary/30"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  done ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : l.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {idx + 1}. {l.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{l.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            );
          })}
        </div>

        {/* CTA — Hype the analysis tool */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center space-y-3">
          <Sparkles className="w-6 h-6 mx-auto text-primary" />
          <p className="text-sm font-semibold text-foreground">Ready to put your knowledge to the test?</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Our AI-powered analysis scans body, face, hands, voice &amp; gait using these exact forensic markers — and delivers a science-backed verdict in seconds.
          </p>
          <Link to="/">
            <Button size="sm" className="gradient-brand text-primary-foreground mt-2 gap-2">
              <Scan className="w-4 h-4" /> Try the Analysis Tool
            </Button>
          </Link>
        </div>

        {completed.size === LESSONS.length && (
          <div className="text-center space-y-3 py-4 animate-fade-in">
            <GraduationCap className="w-12 h-12 mx-auto text-primary" />
            <p className="font-display text-lg font-bold gradient-brand-text">Course Complete!</p>
            <p className="text-xs text-muted-foreground">You've studied all marker categories. Test your knowledge in the other game modes!</p>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setCompleted(new Set())}>
              <RotateCcw className="w-3 h-3" /> Reset Progress
            </Button>
          </div>
        )}

        
      </div>
    );
  }

  /* ── LESSON VIEW ───────────────────────────────────────────── */
  const progressPct = ((sectionIdx + 1) / totalPages) * 100;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setState("menu")} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" /> All Lessons
        </button>
        <span className="text-xs font-mono text-muted-foreground">{sectionIdx + 1}/{totalPages}</span>
      </div>
      <Progress value={progressPct} className="h-1.5" />

      {/* Lesson title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {lesson.icon}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">{lesson.title}</h3>
          <p className="text-[11px] text-muted-foreground">{lesson.subtitle}</p>
        </div>
      </div>

      {/* Diagram — always visible */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <ZoomableImage
          src={lesson.image}
          alt={lesson.imageAlt}
          className="w-full max-h-[280px] object-contain object-center bg-background/50 p-2"
        />
        <div className="px-3 py-1.5 border-t border-border bg-secondary/30">
          <p className="text-[10px] font-mono text-muted-foreground">
            👆 Tap image to zoom and read labels
          </p>
        </div>
      </div>

      {/* Content pages */}
      {isOnSection && (
        <div className="space-y-4 animate-fade-in" key={`section-${sectionIdx}`}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lesson.sections[sectionIdx].body}
          </p>
          {lesson.sections[sectionIdx].keyInsight && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5">Key Insight</p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {lesson.sections[sectionIdx].keyInsight}
              </p>
            </div>
          )}
        </div>
      )}

      {isOnLookFor && (
        <div className="space-y-3 animate-fade-in" key="lookfor">
          <h4 className="text-sm font-bold flex items-center gap-2">
            🔍 What to Look For
          </h4>
          <div className="space-y-2">
            {lesson.lookFor.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOnSummary && (
        <div className="space-y-3 animate-fade-in" key="summary">
          <h4 className="text-sm font-bold flex items-center gap-2">
            🔒 What Can Never Be Changed
          </h4>
          <p className="text-xs text-muted-foreground">
            These markers are immutable — they cannot be altered by hormones, surgery, or cosmetics:
          </p>
          <div className="space-y-2">
            {lesson.cantBeChanged.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-foreground/90 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 mt-2">
            <p className="text-xs text-accent font-medium">
              Remember: No single marker is definitive — the power is in the convergence of multiple independent signals across all categories.
            </p>
          </div>
        </div>
      )}

      {/* Inline CTA after lesson content */}
      {isOnSummary && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center space-y-2 animate-fade-in">
          <p className="text-xs font-semibold text-foreground">🔬 Now see these markers detected by AI in real photos</p>
          <Link to="/">
            <Button size="sm" variant="outline" className="gap-2 text-xs">
              <Scan className="w-3 h-3" /> Launch Analysis Tool
            </Button>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={sectionIdx === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-3 h-3" /> Back
        </Button>
        <Button size="sm" onClick={nextPage} className="gap-1">
          {isOnSummary ? (
            <>Complete Lesson <CheckCircle className="w-3 h-3" /></>
          ) : (
            <>Next <ChevronRight className="w-3 h-3" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ForensicClassroom;
