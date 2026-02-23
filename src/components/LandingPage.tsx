import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Search, Shield, FlaskConical, Lock, Zap } from "lucide-react";
import { User, ScanFace, Hand } from "lucide-react";
import maleSkeleton from "@/assets/diagram_male_skeleton.png";
import femaleSkeleton from "@/assets/diagram_female_skeleton.png";
import AuthModal from "./AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { toast } = useToast();

  const handleStartTrial = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <span className="gender-symbol top-10 -left-20 text-primary/5">♂</span>
        <span className="gender-symbol bottom-10 -right-16 text-accent/5">♀</span>

        {/* Male skeleton - left side */}
        <img
          src={maleSkeleton}
          alt="Male skeletal proportions"
          className="hidden md:block absolute left-4 lg:left-12 bottom-8 w-40 lg:w-52 opacity-20 pointer-events-none select-none"
        />
        {/* Female skeleton - right side */}
        <img
          src={femaleSkeleton}
          alt="Female skeletal proportions"
          className="hidden md:block absolute right-4 lg:right-12 bottom-8 w-40 lg:w-52 opacity-20 pointer-events-none select-none"
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 space-y-6 py-20">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Everyone Has the Right to <span className="gradient-brand-text">Know.</span>
          </h1>
          <p className="text-xl font-medium text-foreground max-w-xl mx-auto">
            Is your date really who they say they are?
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Find out in seconds with science-backed biological sex analysis. <strong className="text-foreground">Body. Face. Hands.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              className="gradient-brand text-primary-foreground px-8 text-base"
              onClick={handleStartTrial}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Loading…" : "Start Free Trial"}
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToHowItWorks} className="px-8 text-base">
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            In today's dating landscape, transparency matters. Born Male Born Female is a safety and awareness tool for people
            who want to make informed decisions about who they date. Upload a photo and let our AI analyze body,
            facial, and hand proportions using the same forensic anthropology markers scientists use — and get an
            educated, science-based estimate in seconds.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            How It <span className="gradient-brand-text">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, step: "1", title: "Upload a photo", desc: "Take or upload a clear photo of the person." },
              { icon: Search, step: "2", title: "AI analyzes anatomy", desc: "Our AI examines forensic anthropology markers." },
              { icon: Shield, step: "3", title: "Get your result", desc: "Receive a science-based estimate in seconds." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-card border border-border">
                <div className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Modules */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Three <span className="gradient-brand-text">Modules</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: User, title: "Body Analysis", desc: "Shoulder-to-hip ratio, rib cage shape, skeletal frame", symbol: "♂" },
              { icon: ScanFace, title: "Face Analysis", desc: "Forehead, brow ridge, jaw, orbital shape, chin structure", symbol: "♀" },
              { icon: Hand, title: "Hands Analysis", desc: "Digit ratio, metacarpal robustness, wrist width, clavicle", symbol: "♂" },
            ].map((m) => (
              <div key={m.title} className="relative p-6 rounded-xl bg-card border border-border space-y-3 overflow-hidden">
                <span className="absolute -top-4 -right-4 text-8xl font-bold opacity-[0.03]">{m.symbol}</span>
                <m.icon className="w-8 h-8 text-primary" />
                <h3 className="font-display font-semibold text-lg">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Born Male Born Female */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display text-3xl font-bold">
            Everyone has the right to <span className="gradient-brand-text">know.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Transparency in dating isn't just a preference — it's a safety issue. Born Male Born Female gives you a science-based second
            opinion so you can make informed decisions. No judgment. Just data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {[
              { icon: FlaskConical, label: "Science-backed" },
              { icon: Lock, label: "Private & secure" },
              { icon: Zap, label: "Results in seconds" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-2 p-4">
                <t.icon className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-20 px-4 overflow-hidden">
        <span className="gender-symbol top-0 left-1/4 text-primary/3">♂</span>
        <span className="gender-symbol bottom-0 right-1/4 text-accent/3">♀</span>

        <div className="relative z-10 max-w-md mx-auto">
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6 text-center gradient-border">
            <h2 className="font-display text-3xl font-bold gradient-brand-text">$5 / week</h2>
            <p className="text-sm text-accent font-medium">3-day free trial included</p>
            <ul className="space-y-3 text-sm text-left">
              {[
                "Unlimited analyses",
                "Body, Face & Hands modules",
                "Instant AI-powered results",
                "Results overlay on your photo",
                "Cancel anytime",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-primary">✓</span> {f}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="w-full gradient-brand text-primary-foreground text-base"
              onClick={handleStartTrial}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Loading…" : "Start My Free Trial"}
            </Button>
            <p className="text-xs text-muted-foreground">
              $5/week after 3-day free trial. Cancel anytime. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="font-display text-lg font-bold gradient-brand-text">Born Male Born Female™</p>
          <p className="text-sm text-muted-foreground">Everyone has the right to know.</p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Contact</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Born Male Born Female provides educational estimates based on anatomical proportion analysis.
            Results are not a definitive determination of biological sex or gender identity.
            For informational purposes only.
          </p>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default LandingPage;
