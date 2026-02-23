import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, Target, Lightbulb, ArrowRight } from "lucide-react";
import ZoomableImage from "./ZoomableImage";
import diagramMaleSkeleton from "@/assets/diagram_male_skeleton.png";
import diagramFemaleSkeleton from "@/assets/diagram_female_skeleton.png";
import diagramFaceMarkers from "@/assets/diagram_face_markers.png";

interface MarkerChallenge {
  image: string;
  imageAlt: string;
  markerName: string;
  question: string;
  options: string[];
  correct: number;
  hint: string;
  explanation: string;
  highlightArea: string; // description of where to look
}

const CHALLENGES: MarkerChallenge[] = [
  {
    image: diagramMaleSkeleton,
    imageAlt: "Male skeleton diagram",
    markerName: "Shoulder-to-Hip Ratio",
    question: "What makes the male shoulder-to-hip ratio distinctive?",
    options: ["Shoulders are ~1.4x wider than hips", "Shoulders equal hip width", "Hips are wider than shoulders"],
    correct: 0,
    hint: "Look at the relative width of the clavicles compared to the pelvis.",
    explanation: "Male clavicles grow significantly during puberty, creating a ratio of ~1.4:1 or greater. This skeletal proportion is permanent and one of the most visible sex markers.",
    highlightArea: "Upper torso — clavicle span vs pelvic width",
  },
  {
    image: diagramFemaleSkeleton,
    imageAlt: "Female skeleton diagram",
    markerName: "Pelvic Shape",
    question: "What shape is the typical female pelvic inlet?",
    options: ["Heart-shaped (android)", "Wide and circular (gynecoid)", "Triangular (platypelloid)"],
    correct: 1,
    hint: "The female pelvis evolved for a specific biological function…",
    explanation: "The gynecoid pelvis has a wide, circular inlet and broad sub-pubic angle (>90°) to accommodate childbirth. This is the single most reliable skeletal sex marker, with 95%+ accuracy.",
    highlightArea: "Mid-section — pelvic structure",
  },
  {
    image: diagramFaceMarkers,
    imageAlt: "Facial markers comparison",
    markerName: "Brow Ridge",
    question: "The supraorbital ridge (brow ridge) is prominent in which skull?",
    options: ["Female skull", "Male skull", "Both equally"],
    correct: 1,
    hint: "Testosterone drives bone growth in specific cranial areas.",
    explanation: "The male skull develops a pronounced supraorbital ridge — a shelf-like bony overhang above the eye sockets. The female forehead is typically smoother with a more vertical profile.",
    highlightArea: "Top of skull — forehead area above eyes",
  },
  {
    image: diagramFaceMarkers,
    imageAlt: "Facial markers comparison",
    markerName: "Mandible Shape",
    question: "Which jawline characteristic indicates a male skull?",
    options: ["Rounded with obtuse gonial angle", "Square with ~90° gonial angle", "Narrow and pointed"],
    correct: 1,
    hint: "Look at the corners of the jaw — the angle matters.",
    explanation: "Male mandibles have nearly right-angle gonial flaring (~90°), creating a square jaw. Female mandibles have more obtuse angles (~120°) creating a softer, more rounded jawline.",
    highlightArea: "Lower face — jaw corners and chin",
  },
  {
    image: diagramMaleSkeleton,
    imageAlt: "Male skeleton diagram",
    markerName: "Rib Cage",
    question: "How does the male rib cage differ from female?",
    options: ["Barrel-shaped and larger volume", "Smaller and cone-shaped", "Identical in shape"],
    correct: 0,
    hint: "Consider lung capacity differences between sexes.",
    explanation: "The male rib cage is larger and more barrel-shaped with greater total volume. Female rib cages tend to be narrower and more conical. This difference supports ~20–30% greater male lung capacity.",
    highlightArea: "Chest area — rib cage shape",
  },
  {
    image: diagramFemaleSkeleton,
    imageAlt: "Female skeleton diagram",
    markerName: "Femoral Angle",
    question: "Why do females typically have a larger femoral angle (Q-angle)?",
    options: ["Shorter femurs", "Wider pelvis tilts the femur inward", "Stronger knee ligaments"],
    correct: 1,
    hint: "The pelvis determines how the thigh bone connects to the knee.",
    explanation: "The wider female pelvis creates a greater angle between the femur and tibia at the knee (Q-angle of 15–20° vs 10–15°). This affects gait biomechanics and knee alignment.",
    highlightArea: "Lower body — hip to knee angle",
  },
  {
    image: diagramFaceMarkers,
    imageAlt: "Facial markers comparison",
    markerName: "Orbital Shape",
    question: "Which eye socket shape is typically female?",
    options: ["Rectangular with blunt upper rim", "Rounded with sharp superior margin", "Narrow slits"],
    correct: 1,
    hint: "Think circular vs angular.",
    explanation: "Female orbits tend to be rounder with sharper, more defined superior (upper) margins. Male orbits are more rectangular or square with blunter upper rims.",
    highlightArea: "Mid-face — eye socket area",
  },
  {
    image: diagramMaleSkeleton,
    imageAlt: "Male skeleton diagram",
    markerName: "Mastoid Process",
    question: "The mastoid process (bone behind the ear) is typically larger in which sex?",
    options: ["Female", "Male", "Same in both"],
    correct: 1,
    hint: "This bone serves as an attachment point for neck muscles.",
    explanation: "Males develop larger mastoid processes due to greater muscle mass attachment requirements. This is a reliable cranial sex marker used extensively in forensic anthropology.",
    highlightArea: "Skull — behind the ear area",
  },
];

const SpotTheMarkers = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [challenges, setChallenges] = useState<MarkerChallenge[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const startGame = useCallback(() => {
    const shuffled = [...CHALLENGES].sort(() => Math.random() - 0.5).slice(0, 8);
    setChallenges(shuffled);
    setCurrentIdx(0);
    setSelected(null);
    setShowHint(false);
    setScore(0);
    setHintsUsed(0);
    setGameState("playing");
  }, []);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === challenges[currentIdx].correct) {
      setScore((s) => s + (showHint ? 1 : 2)); // half points with hint
    }
  };

  const useHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed((h) => h + 1);
    }
  };

  const next = () => {
    if (currentIdx + 1 >= challenges.length) {
      setGameState("finished");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowHint(false);
    }
  };

  if (gameState === "idle") {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full gradient-brand mx-auto flex items-center justify-center">
          <Target className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl font-bold">Spot the Markers</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Study real forensic diagrams and identify anatomical sex markers.
          Use hints if you're stuck — but they cost you points!
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-secondary">🎯 Diagram-based</span>
          <span className="px-3 py-1 rounded-full bg-secondary">💡 Hints available</span>
          <span className="px-3 py-1 rounded-full bg-secondary">📐 8 challenges</span>
        </div>
        <Button size="lg" className="gradient-brand text-primary-foreground" onClick={startGame}>
          Start Challenge
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    const maxScore = challenges.length * 2;
    const pct = Math.round((score / maxScore) * 100);
    return (
      <div className="text-center space-y-6 py-12 animate-fade-in">
        <Target className="w-16 h-16 mx-auto text-primary" />
        <h3 className="font-display text-3xl font-bold">Challenge Complete!</h3>
        <p className="text-4xl font-display font-bold gradient-brand-text">{score}/{maxScore} pts</p>
        <p className="text-muted-foreground">{pct}% • {hintsUsed} hints used</p>
        <Button size="lg" variant="outline" className="gap-2" onClick={startGame}>
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const ch = challenges[currentIdx];
  const isCorrect = selected === ch.correct;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground">{currentIdx + 1}/{challenges.length}</span>
        <span className="font-display font-bold gradient-brand-text">{score} pts</span>
      </div>
      <Progress value={((currentIdx + 1) / challenges.length) * 100} className="h-1.5" />

      {/* Diagram */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <ZoomableImage
          src={ch.image}
          alt={ch.imageAlt}
          className="w-full max-h-[300px] object-contain object-center bg-background/50 p-2"
        />
        <div className="px-4 py-2 border-t border-border bg-secondary/30">
          <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-2">
            <Target className="w-3 h-3 text-primary" />
            Focus: <span className="text-foreground font-medium">{ch.highlightArea}</span>
          </p>
        </div>
      </div>

      {/* Marker name + question */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-accent/10 text-accent">
          {ch.markerName}
        </span>
        <h3 className="font-display text-lg font-bold pt-2">{ch.question}</h3>
      </div>

      {/* Hint */}
      {!selected && (
        <div className="text-center">
          {showHint ? (
            <p className="text-sm text-accent italic animate-fade-in">💡 {ch.hint}</p>
          ) : (
            <button onClick={useHint} className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 mx-auto">
              <Lightbulb className="w-3 h-3" /> Use hint (−1 pt)
            </button>
          )}
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {ch.options.map((opt, idx) => {
          const showResult = selected !== null;
          const isThis = idx === selected;
          const isAnswer = idx === ch.correct;

          let cls = "border-border hover:border-primary/40";
          if (showResult && isAnswer) cls = "border-green-500 bg-green-500/10";
          else if (showResult && isThis && !isAnswer) cls = "border-destructive bg-destructive/10";

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${cls} ${
                !showResult ? "cursor-pointer hover:bg-secondary/50" : "cursor-default"
              } flex items-center gap-3`}
            >
              <span className="w-7 h-7 shrink-0 rounded-md bg-secondary flex items-center justify-center text-xs font-mono font-bold">
                {idx + 1}
              </span>
              <span className="font-medium">{opt}</span>
              {showResult && isAnswer && <CheckCircle className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
              {showResult && isThis && !isAnswer && <XCircle className="w-4 h-4 text-destructive ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {selected !== null && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-fade-in">
          <p className="text-sm font-semibold flex items-center gap-2">
            {isCorrect ? (
              <><CheckCircle className="w-4 h-4 text-green-500" /> Correct! {showHint ? "(+1 pt with hint)" : "(+2 pts)"}</>
            ) : (
              <><XCircle className="w-4 h-4 text-destructive" /> Not quite.</>
            )}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{ch.explanation}</p>
          <div className="text-right">
            <Button size="sm" onClick={next} className="gap-1">
              {currentIdx + 1 >= challenges.length ? "See Results" : <>Next <ArrowRight className="w-3 h-3" /></>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotTheMarkers;
