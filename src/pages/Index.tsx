import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import UploadZone from "@/components/UploadZone";
import MediaUploadZone from "@/components/MediaUploadZone";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultsCard from "@/components/ResultsCard";
import FaceResultsCard from "@/components/FaceResultsCard";
import HandsResultsCard from "@/components/HandsResultsCard";
import VoiceResultsCard from "@/components/VoiceResultsCard";
import GaitResultsCard from "@/components/GaitResultsCard";
import ModuleSelector from "@/components/ModuleSelector";
import Disclaimer from "@/components/Disclaimer";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { AnalysisMode, AnalysisResult, FaceAnalysisResult, HandAnalysisResult, VoiceAnalysisResult, GaitAnalysisResult } from "@/types/analysis";
import { Scan, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FREE_USES_KEY = "bmbf_free_uses";
const MAX_FREE_USES = 1;

const UPLOAD_GUIDANCE: Record<AnalysisMode, string> = {
  body: "Upload a photo showing the full torso (shoulders to hips). For chest analysis, a fitted top or shirtless photo gives the most accurate breast/chest authenticity results.",
  face: "Upload a front-facing photo where the face is clearly visible and unobscured for best results.",
  hands: "Upload a clear photo of the hand(s) with fingers spread. Palm-up or palm-down both work. Include the wrist if possible.",
  voice: "Upload an audio clip (5–30 seconds) of the person speaking naturally, or record directly with your microphone.",
  gait: "Upload a short video (5–15 seconds) of the person walking naturally. Side or 45° angle showing the full body works best.",
};

const LOADER_TEXT: Record<AnalysisMode, { title: string; subtitle: string }> = {
  body: { title: "Analyzing proportions…", subtitle: "AI is examining skeletal structure cues" },
  face: { title: "Analyzing facial features…", subtitle: "AI is examining craniofacial markers" },
  hands: { title: "Analyzing hand anatomy…", subtitle: "AI is examining digit and skeletal cues" },
  voice: { title: "Analyzing voice patterns…", subtitle: "AI is examining acoustic characteristics" },
  gait: { title: "Analyzing walking pattern…", subtitle: "AI is examining biomechanical markers" },
};

const Index = () => {
  const { user, subscription, loading: authLoading, isAdmin } = useAuth();
  const [mode, setMode] = useState<AnalysisMode>("body");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mediaBase64, setMediaBase64] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | FaceAnalysisResult | HandAnalysisResult | VoiceAnalysisResult | GaitAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [freeUsesExhausted, setFreeUsesExhausted] = useState(false);
  const { toast } = useToast();

  const isSubscribed = subscription.subscribed || isAdmin;

  // Check free uses on mount
  useEffect(() => {
    const uses = parseInt(localStorage.getItem(FREE_USES_KEY) || "0", 10);
    setFreeUsesExhausted(uses >= MAX_FREE_USES);
  }, []);

  const incrementFreeUses = () => {
    const uses = parseInt(localStorage.getItem(FREE_USES_KEY) || "0", 10) + 1;
    localStorage.setItem(FREE_USES_KEY, String(uses));
    if (uses >= MAX_FREE_USES) setFreeUsesExhausted(true);
  };

  // Determine access: subscribed users always have access, non-subscribed get free tries
  const hasAccess = isSubscribed || !freeUsesExhausted;

  const isMediaMode = mode === "voice" || mode === "gait";
  const currentMedia = isMediaMode ? mediaBase64 : imageBase64;

  const extractVideoFrames = async (videoBase64: string): Promise<string[]> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = videoBase64;
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const frameCount = Math.min(8, Math.max(4, Math.floor(duration * 1.5)));
        const interval = duration / frameCount;
        const frames: string[] = [];
        let currentFrame = 0;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        const captureFrame = () => {
          if (currentFrame >= frameCount) {
            resolve(frames);
            return;
          }
          video.currentTime = interval * currentFrame + 0.1;
        };

        video.onseeked = () => {
          canvas.width = Math.min(video.videoWidth, 1024);
          canvas.height = Math.min(video.videoHeight, 1024);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL("image/jpeg", 0.7));
          currentFrame++;
          captureFrame();
        };

        captureFrame();
      };
    });
  };

  const handleAnalyze = async () => {
    if (!currentMedia) return;

    // If not subscribed and free uses exhausted, prompt signup
    if (!isSubscribed && freeUsesExhausted) {
      setAuthOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    const MAX_RETRIES = 2;
    let lastError: string | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

        let requestBody: any = { mode };

        if (mode === "gait") {
          const frames = await extractVideoFrames(currentMedia);
          requestBody.frames = frames;
        } else if (mode === "voice") {
          requestBody.audio = currentMedia;
        } else {
          requestBody.image = currentMedia;
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-proportions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(errBody || `Server error (${response.status})`);
        }

        const data = await response.json();
        if (data?.error) throw new Error(data.error);

        setResult(data);

        // Count free use if not subscribed
        if (!isSubscribed) {
          incrementFreeUses();
        }
        lastError = null;
        break; // success — exit retry loop
      } catch (err: any) {
        const isTimeout = err?.name === "AbortError";
        lastError = isTimeout
          ? "Analysis timed out. Retrying…"
          : err?.message || "Analysis failed. Please try again with a clearer photo.";

        if (attempt < MAX_RETRIES && (isTimeout || err?.message?.includes("502"))) {
          console.warn(`Attempt ${attempt + 1} failed, retrying…`, lastError);
          continue; // retry
        }

        const finalMsg = isTimeout
          ? "Analysis timed out after multiple attempts. Please try a smaller or clearer photo."
          : lastError;
        setError(finalMsg);
        toast({ title: "Analysis Error", description: finalMsg, variant: "destructive" });
      }
    }

    setLoading(false);
  };

  const handleReset = () => {
    setImageBase64(null);
    setMediaBase64(null);
    setResult(null);
    setError(null);

    // If free uses exhausted and not subscribed, show signup prompt
    if (!isSubscribed && freeUsesExhausted) {
      setAuthOpen(true);
    }
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setImageBase64(null);
      setMediaBase64(null);
      setResult(null);
      setError(null);
    }
  };

  const renderResults = () => {
    if (!result) return null;
    switch (mode) {
      case "body":
        return <ResultsCard result={result as AnalysisResult} imageBase64={imageBase64!} onReset={handleReset} />;
      case "face":
        return <FaceResultsCard result={result as FaceAnalysisResult} imageBase64={imageBase64!} onReset={handleReset} />;
      case "hands":
        return <HandsResultsCard result={result as HandAnalysisResult} imageBase64={imageBase64!} onReset={handleReset} />;
      case "voice":
        return <VoiceResultsCard result={result as VoiceAnalysisResult} onReset={handleReset} />;
      case "gait":
        return <GaitResultsCard result={result as GaitAnalysisResult} onReset={handleReset} />;
    }
  };

  // Show landing page only if: free uses exhausted AND no result currently being displayed
  // (first-time visitors go straight to the tool; results always shown after analysis)
  if (!authLoading && !user && freeUsesExhausted && !result) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <LandingPage />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  // Authenticated but not subscribed and free uses done and no result → landing page
  if (!authLoading && user && !isSubscribed && freeUsesExhausted && !result) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-2xl py-8 px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold gradient-brand-text">Born Male Born Female</h1>
          <p className="text-sm text-muted-foreground">Everyone has the right to know.</p>
          {!isSubscribed && !freeUsesExhausted && (
            <p className="text-xs text-accent font-medium">✨ Try one free analysis — no signup required</p>
          )}
        </div>

        <ModuleSelector mode={mode} onModeChange={handleModeChange} />

        {loading ? (
          <AnalysisLoader title={LOADER_TEXT[mode].title} subtitle={LOADER_TEXT[mode].subtitle} />
        ) : result ? (
          renderResults()
        ) : (
          <>
            <p className="text-center text-xs text-muted-foreground">{UPLOAD_GUIDANCE[mode]}</p>

            {isMediaMode ? (
              <MediaUploadZone
                type={mode === "voice" ? "audio" : "video"}
                onMediaSelected={setMediaBase64}
                mediaPreview={mediaBase64}
                onClear={() => setMediaBase64(null)}
              />
            ) : (
              <UploadZone
                onImageSelected={setImageBase64}
                imagePreview={imageBase64}
                onClear={() => setImageBase64(null)}
              />
            )}

            {currentMedia && (
              <div className="flex justify-center">
                <Button onClick={handleAnalyze} size="lg" className="gap-2 gradient-brand text-primary-foreground">
                  <Scan className="w-4 h-4" />
                  Analyze {mode === "body" ? "Proportions" : mode === "face" ? "Face" : mode === "hands" ? "Hands" : mode === "voice" ? "Voice" : "Gait"}
                </Button>
              </div>
            )}

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
          </>
        )}

        <Disclaimer />
      </main>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default Index;
