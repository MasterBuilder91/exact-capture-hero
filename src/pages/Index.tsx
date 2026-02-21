import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultsCard from "@/components/ResultsCard";
import FaceResultsCard from "@/components/FaceResultsCard";
import HandsResultsCard from "@/components/HandsResultsCard";
import ModuleSelector from "@/components/ModuleSelector";
import Disclaimer from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { AnalysisMode, AnalysisResult, FaceAnalysisResult, HandAnalysisResult } from "@/types/analysis";
import { supabase } from "@/integrations/supabase/client";
import { Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UPLOAD_GUIDANCE: Record<AnalysisMode, string> = {
  body: "Upload a photo showing the full torso (shoulders to hips) for best results.",
  face: "Upload a front-facing photo where the face is clearly visible and unobscured for best results.",
  hands: "Upload a clear photo of the hand(s) with fingers spread. Palm-up or palm-down both work. Include the wrist if possible.",
};

const LOADER_TEXT: Record<AnalysisMode, { title: string; subtitle: string }> = {
  body: { title: "Analyzing proportions…", subtitle: "AI is examining skeletal structure cues" },
  face: { title: "Analyzing facial features…", subtitle: "AI is examining craniofacial markers" },
  hands: { title: "Analyzing hand anatomy…", subtitle: "AI is examining digit and skeletal cues" },
};

const Index = () => {
  const [mode, setMode] = useState<AnalysisMode>("body");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | FaceAnalysisResult | HandAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-proportions", {
        body: { image: imageBase64, mode },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      const msg = err?.message || "Analysis failed. Please try again with a clearer photo.";
      setError(msg);
      toast({ title: "Analysis Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageBase64(null);
    setResult(null);
    setError(null);
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      handleReset();
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
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-2xl py-8 px-4 space-y-8">
        {!result && <HeroSection onUploadClick={() => {}} />}

        <ModuleSelector mode={mode} onModeChange={handleModeChange} />

        {loading ? (
          <AnalysisLoader title={LOADER_TEXT[mode].title} subtitle={LOADER_TEXT[mode].subtitle} />
        ) : result ? (
          renderResults()
        ) : (
          <>
            {!result && (
              <p className="text-center text-xs text-muted-foreground">{UPLOAD_GUIDANCE[mode]}</p>
            )}

            <UploadZone
              onImageSelected={setImageBase64}
              imagePreview={imageBase64}
              onClear={() => setImageBase64(null)}
            />

            {imageBase64 && (
              <div className="flex justify-center">
                <Button onClick={handleAnalyze} size="lg" className="gap-2 glow-teal">
                  <Scan className="w-4 h-4" />
                  Analyze {mode === "body" ? "Proportions" : mode === "face" ? "Face" : "Hands"}
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
    </div>
  );
};

export default Index;
