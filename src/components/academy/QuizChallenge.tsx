import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Timer, Zap, RotateCcw, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const QUESTIONS: Question[] = [
  {
    question: "Which sex typically has a more prominent brow ridge (supraorbital ridge)?",
    options: ["Male", "Female", "No difference", "Depends on ethnicity only"],
    correct: 0,
    explanation: "Males typically develop a more pronounced supraorbital ridge due to higher testosterone exposure during puberty. This bony prominence above the eye sockets is one of the most reliable craniofacial sex markers.",
    category: "Face",
  },
  {
    question: "A 2D:4D digit ratio close to 1.00 is more common in which sex?",
    options: ["Male", "Female", "Equal in both", "Only found in children"],
    correct: 1,
    explanation: "Females typically have a 2D:4D ratio close to 1.00 (index and ring finger roughly equal). Males tend to have a lower ratio (~0.95), meaning the ring finger is longer — a result of higher prenatal androgen exposure.",
    category: "Hands",
  },
  {
    question: "What is the average fundamental frequency (F0) of an adult male voice?",
    options: ["250–300 Hz", "85–155 Hz", "180–220 Hz", "50–70 Hz"],
    correct: 1,
    explanation: "Adult males have an average F0 of 85–155 Hz due to longer, thicker vocal folds. Adult females average 165–255 Hz. This difference is driven by testosterone's effect on laryngeal cartilage growth during puberty.",
    category: "Voice",
  },
  {
    question: "Which skeletal feature is MOST reliable for sex determination?",
    options: ["Skull shape", "Pelvic structure", "Femur length", "Rib count"],
    correct: 1,
    explanation: "The pelvis is the most sexually dimorphic bone in the human skeleton, with 95%+ accuracy. The female pelvis is wider and more circular (gynecoid) to accommodate childbirth, while the male pelvis is narrower and heart-shaped (android).",
    category: "Skeleton",
  },
  {
    question: "The 'Q-angle' in gait biomechanics is typically larger in which sex?",
    options: ["Male", "Female", "Equal in both", "Only relevant in athletes"],
    correct: 1,
    explanation: "Females typically have a larger Q-angle (the angle between the quadriceps muscle and patellar tendon) due to their wider pelvis. This creates a more pronounced inward knee angle and affects walking gait patterns.",
    category: "Gait",
  },
  {
    question: "Which jaw shape is more commonly associated with males?",
    options: ["Round and tapered", "Square with prominent gonial angle", "V-shaped", "Pointed chin"],
    correct: 1,
    explanation: "Males tend to have a more square jaw with prominent gonial angles (the corner of the jaw). This is due to testosterone-driven bone remodeling and larger masseter muscle attachment sites.",
    category: "Face",
  },
  {
    question: "What is the typical male shoulder-to-hip ratio?",
    options: ["1.0:1", "1.4:1 or greater", "0.8:1", "1.1:1"],
    correct: 1,
    explanation: "Males typically have a shoulder-to-hip ratio of 1.4:1 or greater due to broader clavicles and narrower pelvis. Females tend toward 1.2:1. This skeletal proportion is set by puberty and is not significantly altered by exercise or hormones.",
    category: "Skeleton",
  },
  {
    question: "Vocal formant dispersion (spacing of resonant frequencies) is typically wider in which sex?",
    options: ["Male", "Female", "Equal", "Varies randomly"],
    correct: 1,
    explanation: "Females typically have wider formant dispersion due to a shorter vocal tract. Males have a longer vocal tract (especially after laryngeal descent during puberty), resulting in more closely spaced formants.",
    category: "Voice",
  },
  {
    question: "Which gait characteristic is more common in biological males?",
    options: ["Wider pelvic sway", "Longer stride length", "Higher cadence", "Toe-in walking"],
    correct: 1,
    explanation: "Males tend to have longer stride lengths due to greater leg length relative to height and narrower pelvis. Females tend to have a higher cadence (steps per minute) with relatively shorter strides.",
    category: "Gait",
  },
  {
    question: "The metacarpal robustness index measures what in hand analysis?",
    options: ["Finger flexibility", "Bone thickness relative to length", "Nail growth rate", "Grip rotation angle"],
    correct: 1,
    explanation: "The metacarpal robustness index measures bone width relative to length. Males typically have more robust (thicker) metacarpals, while females have more gracile (slender) hand bones — a reliable skeletal sex marker.",
    category: "Hands",
  },
  {
    question: "Which orbital (eye socket) shape is more typical in females?",
    options: ["Square and angular", "Rounded with sharp upper margin", "Narrow slits", "Triangular"],
    correct: 1,
    explanation: "Female eye sockets tend to be rounder with sharper superior margins. Male orbits are typically more rectangular or square with blunter upper rims. This is a well-established forensic craniometric marker.",
    category: "Face",
  },
  {
    question: "At what age do most skeletal sex differences become clearly established?",
    options: ["Birth", "Age 6–8", "Puberty (12–18)", "Age 25+"],
    correct: 2,
    explanation: "While some sex differences exist from birth, the majority of skeletal sexual dimorphism develops during puberty due to differential hormone exposure. By age 18, most skeletal sex markers are fully established and permanent.",
    category: "Skeleton",
  },
];

const TIMER_SECONDS = 20;

const QuizChallenge = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const startGame = useCallback(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setShowExplanation(false);
    setTimeLeft(TIMER_SECONDS);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing" || showExplanation || selected !== null) return;
    if (timeLeft <= 0) {
      setSelected(-1); // time's up
      setShowExplanation(true);
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, showExplanation, selected]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const isCorrect = idx === shuffledQuestions[currentQ].correct;
    if (isCorrect) {
      const timeBonus = Math.ceil(timeLeft / 4);
      const streakBonus = Math.min(streak, 5);
      setScore((s) => s + 10 + timeBonus + streakBonus);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= shuffledQuestions.length) {
      setGameState("finished");
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(TIMER_SECONDS);
    }
  };

  const q = shuffledQuestions[currentQ];
  const progress = shuffledQuestions.length > 0 ? ((currentQ + 1) / shuffledQuestions.length) * 100 : 0;

  const getGrade = () => {
    const pct = (score / (shuffledQuestions.length * 15)) * 100;
    if (pct >= 90) return { label: "Forensic Expert 🧬", color: "text-green-400" };
    if (pct >= 70) return { label: "Lab Analyst 🔬", color: "text-primary" };
    if (pct >= 50) return { label: "Science Student 📖", color: "text-yellow-400" };
    return { label: "Rookie Investigator 🔍", color: "text-accent" };
  };

  if (gameState === "idle") {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full gradient-brand mx-auto flex items-center justify-center">
          <Zap className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl font-bold">Forensic Quiz Challenge</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Test your knowledge of biological sex markers across 10 randomized questions.
          Answer fast for bonus points and build streaks for multipliers!
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-secondary">⏱ {TIMER_SECONDS}s per question</span>
          <span className="px-3 py-1 rounded-full bg-secondary">🔥 Streak bonuses</span>
          <span className="px-3 py-1 rounded-full bg-secondary">📊 Final grade</span>
        </div>
        <Button size="lg" className="gradient-brand text-primary-foreground" onClick={startGame}>
          Start Quiz
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    const grade = getGrade();
    return (
      <div className="text-center space-y-6 py-12 animate-fade-in">
        <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
        <h3 className="font-display text-3xl font-bold">Quiz Complete!</h3>
        <div className="space-y-2">
          <p className="text-4xl font-display font-bold gradient-brand-text">{score} pts</p>
          <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>
        </div>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{bestStreak}</p>
            <p>Best Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {shuffledQuestions.length}
            </p>
            <p>Questions</p>
          </div>
        </div>
        <Button size="lg" className="gap-2" variant="outline" onClick={startGame}>
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground">
          Q{currentQ + 1}/{shuffledQuestions.length}
        </span>
        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <span className="text-accent font-semibold animate-scale-in">🔥 {streak}x streak</span>
          )}
          <span className="font-display font-bold gradient-brand-text">{score} pts</span>
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />

      {/* Timer */}
      <div className="flex items-center justify-center gap-2">
        <Timer className={`w-4 h-4 ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
        <span className={`font-mono text-lg font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Category badge */}
      <div className="text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 text-primary">
          {q.category}
        </span>
      </div>

      {/* Question */}
      <h3 className="font-display text-lg sm:text-xl font-bold text-center px-2 leading-snug">
        {q.question}
      </h3>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correct;
          const isSelected = idx === selected;
          const showResult = selected !== null;

          let borderClass = "border-border hover:border-primary/40";
          if (showResult && isCorrect) borderClass = "border-green-500 bg-green-500/10";
          else if (showResult && isSelected && !isCorrect) borderClass = "border-destructive bg-destructive/10";

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${borderClass} ${
                !showResult ? "cursor-pointer hover:bg-secondary/50" : "cursor-default"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-xs font-mono font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm font-medium">{opt}</span>
                {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 ml-auto shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive ml-auto shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-fade-in">
          <p className="text-sm font-semibold flex items-center gap-2">
            {selected === q.correct ? (
              <><CheckCircle className="w-4 h-4 text-green-500" /> Correct!</>
            ) : (
              <><XCircle className="w-4 h-4 text-destructive" /> {selected === -1 ? "Time's up!" : "Incorrect"}</>
            )}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
          <div className="text-right">
            <Button size="sm" onClick={nextQuestion}>
              {currentQ + 1 >= shuffledQuestions.length ? "See Results" : "Next →"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizChallenge;
