import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultsCard from "@/components/ResultsCard";
import Disclaimer from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/types/analysis";
import { supabase } from "@/integrations/supabase/client";
import { Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-proportions", {
        body: { image: imageBase64 },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
    } catch (err: any) {
      const msg = err?.message || "Analysis failed. Please try again with a clearer photo showing the full torso.";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-2xl py-8 px-4 space-y-8">
        {!result && <HeroSection onUploadClick={() => {}} />}

        {loading ? (
          <AnalysisLoader />
        ) : result ? (
          <ResultsCard result={result} onReset={handleReset} />
        ) : (
          <>
            <UploadZone
              onImageSelected={setImageBase64}
              imagePreview={imageBase64}
              onClear={() => setImageBase64(null)}
            />

            {imageBase64 && (
              <div className="flex justify-center">
                <Button onClick={handleAnalyze} size="lg" className="gap-2 glow-teal">
                  <Scan className="w-4 h-4" />
                  Analyze Proportions
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
