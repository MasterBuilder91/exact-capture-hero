import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, Swords, ArrowRight } from "lucide-react";

interface ShowdownCard {
  feature: string;
  description: string;
  answer: "male" | "female";
  explanation: string;
  category: string;
}

const CARDS: ShowdownCard[] = [
  {
    feature: "Prominent Brow Ridge",
    description: "A thick, continuous bony ridge above the eye sockets creating a pronounced shelf-like overhang.",
    answer: "male",
    explanation: "The supraorbital ridge is significantly more developed in males due to testosterone-driven bone growth. In females, the forehead transitions more smoothly into the nasal bridge.",
    category: "Face",
  },
  {
    feature: "Wider Pelvic Inlet",
    description: "A broad, circular opening in the center of the pelvis with a wide sub-pubic angle greater than 90°.",
    answer: "female",
    explanation: "The female pelvis evolved a wider inlet and sub-pubic angle to accommodate childbirth. The male pelvis has a narrower, heart-shaped inlet with a sub-pubic angle under 70°.",
    category: "Skeleton",
  },
  {
    feature: "Lower Fundamental Frequency (F0)",
    description: "A speaking voice with a fundamental frequency consistently below 155 Hz during natural conversation.",
    answer: "male",
    explanation: "Males develop longer, thicker vocal folds during puberty (typically 17–25mm vs 12.5–17.5mm), producing lower F0 values. This change is permanent and driven by testosterone.",
    category: "Voice",
  },
  {
    feature: "Higher Q-Angle",
    description: "A larger angle between the thigh bone and kneecap tendon, creating a more pronounced inward knee angle.",
    answer: "female",
    explanation: "The wider female pelvis creates a larger Q-angle (typically 15–20° vs 10–15° in males), affecting knee alignment and creating distinctive gait patterns.",
    category: "Gait",
  },
  {
    feature: "Ring Finger Longer Than Index",
    description: "The fourth digit (ring finger) is noticeably longer than the second digit (index finger), yielding a 2D:4D ratio below 0.96.",
    answer: "male",
    explanation: "Lower 2D:4D ratios correlate with higher prenatal androgen exposure. Males average ~0.947 while females average ~0.965. This is established in utero and doesn't change.",
    category: "Hands",
  },
  {
    feature: "Rounded Eye Sockets",
    description: "Orbital openings that are circular with sharp, defined superior margins.",
    answer: "female",
    explanation: "Female orbits tend to be rounder with sharper upper rims. Male orbits are typically more rectangular with blunter superior margins — a well-established forensic marker.",
    category: "Face",
  },
  {
    feature: "Longer Stride Length",
    description: "Walking pattern with an average stride length exceeding 1.5 meters at comfortable pace.",
    answer: "male",
    explanation: "Males typically have 10–15% longer stride lengths due to greater leg length relative to total height and narrower pelvic structure allowing more linear leg swing.",
    category: "Gait",
  },
  {
    feature: "Robust Metacarpals",
    description: "Hand bones (metacarpals) that are proportionally thicker relative to their length with pronounced muscle attachment ridges.",
    answer: "male",
    explanation: "Male metacarpals average 15–20% greater robustness (width-to-length ratio). This skeletal difference is established during puberty and persists regardless of muscle mass changes.",
    category: "Hands",
  },
  {
    feature: "Wider Formant Dispersion",
    description: "Vocal resonant frequencies that are more widely spaced apart across the frequency spectrum.",
    answer: "female",
    explanation: "A shorter vocal tract in females produces more widely spaced formant frequencies. Males' longer vocal tracts (due to laryngeal descent) create more closely spaced formants.",
    category: "Voice",
  },
  {
    feature: "Square Mandible Angle",
    description: "A jawbone with nearly right-angle corners (gonial angle ~90°) and a broad, squared chin.",
    answer: "male",
    explanation: "Testosterone drives mandibular growth creating more angular, squared jawlines. Female mandibles typically have more obtuse gonial angles (~120°) with more tapered, rounded chins.",
    category: "Face",
  },
  {
    feature: "Greater Lateral Trunk Sway",
    description: "A walking pattern with more pronounced side-to-side movement of the upper body during each step.",
    answer: "female",
    explanation: "The wider female pelvis creates biomechanical need for greater lateral trunk sway to maintain balance during single-leg stance phases of walking.",
    category: "Gait",
  },
  {
    feature: "Narrower Clavicles Relative to Pelvis",
    description: "A body frame where the shoulder width (clavicle span) is only slightly wider than the hips.",
    answer: "female",
    explanation: "Females typically have a shoulder-to-hip ratio of ~1.2:1 compared to males at ~1.4:1. Male clavicles grow substantially longer during puberty, creating the characteristic V-shaped torso.",
    category: "Skeleton",
  },
];

const MarkerShowdown = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [cards, setCards] = useState<ShowdownCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<"male" | "female" | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const startGame = useCallback(() => {
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5).slice(0, 10);
    setCards(shuffled);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
    setGameState("playing");
  }, []);

  const handleGuess = (guess: "male" | "female") => {
    if (selected) return;
    setSelected(guess);
    const correct = guess === cards[currentIdx].answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  };

  const next = () => {
    if (currentIdx + 1 >= cards.length) {
      setGameState("finished");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  };

  if (gameState === "idle") {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full gradient-brand mx-auto flex items-center justify-center">
          <Swords className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl font-bold">Male vs Female Showdown</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Read the anatomical feature description and decide: is it typically male or female?
          Flashcard-style learning with instant feedback and explanations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-secondary">♂ vs ♀</span>
          <span className="px-3 py-1 rounded-full bg-secondary">10 rounds</span>
          <span className="px-3 py-1 rounded-full bg-secondary">📚 Learn as you go</span>
        </div>
        <Button size="lg" className="gradient-brand text-primary-foreground" onClick={startGame}>
          Start Showdown
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    const pct = Math.round((score / cards.length) * 100);
    return (
      <div className="text-center space-y-6 py-12 animate-fade-in">
        <Swords className="w-16 h-16 mx-auto text-primary" />
        <h3 className="font-display text-3xl font-bold">Showdown Complete!</h3>
        <p className="text-4xl font-display font-bold gradient-brand-text">{score}/{cards.length}</p>
        <p className="text-muted-foreground">{pct}% accuracy</p>
        <div className="flex justify-center gap-1">
          {answers.map((correct, i) => (
            <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              correct ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"
            }`}>
              {correct ? "✓" : "✗"}
            </div>
          ))}
        </div>
        <Button size="lg" variant="outline" className="gap-2" onClick={startGame}>
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    );
  }

  const card = cards[currentIdx];
  const isCorrect = selected === card.answer;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground">Round {currentIdx + 1}/{cards.length}</span>
        <span className="font-display font-bold gradient-brand-text">{score} correct</span>
      </div>
      <Progress value={((currentIdx + 1) / cards.length) * 100} className="h-1.5" />

      <div className="text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 text-primary">
          {card.category}
        </span>
      </div>

      {/* Feature card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 text-center">
        <h3 className="font-display text-xl sm:text-2xl font-bold">{card.feature}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {card.description}
        </p>
      </div>

      {/* Male / Female buttons */}
      {!selected && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleGuess("male")}
            className="p-6 rounded-xl border border-border bg-card text-center space-y-2 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
          >
            <span className="text-4xl">♂</span>
            <p className="font-display font-bold">Male</p>
          </button>
          <button
            onClick={() => handleGuess("female")}
            className="p-6 rounded-xl border border-border bg-card text-center space-y-2 transition-all hover:border-accent/50 hover:bg-accent/5 cursor-pointer"
          >
            <span className="text-4xl">♀</span>
            <p className="font-display font-bold">Female</p>
          </button>
        </div>
      )}

      {/* Result + Explanation */}
      {selected && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-fade-in">
          <p className="text-sm font-semibold flex items-center gap-2">
            {isCorrect ? (
              <><CheckCircle className="w-4 h-4 text-green-500" /> Correct! This is a <span className="font-bold">{card.answer}</span> marker.</>
            ) : (
              <><XCircle className="w-4 h-4 text-destructive" /> Wrong — this is a <span className="font-bold">{card.answer}</span> marker.</>
            )}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.explanation}</p>
          <div className="text-right">
            <Button size="sm" onClick={next} className="gap-1">
              {currentIdx + 1 >= cards.length ? "See Results" : <>Next <ArrowRight className="w-3 h-3" /></>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkerShowdown;
