import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Swords, Target, ArrowLeft, GraduationCap } from "lucide-react";
import QuizChallenge from "@/components/academy/QuizChallenge";
import MarkerShowdown from "@/components/academy/MarkerShowdown";
import SpotTheMarkers from "@/components/academy/SpotTheMarkers";

const Academy = () => {
  const [tab, setTab] = useState("quiz");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-2xl py-8 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Analysis
          </Link>
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Forensic <span className="gradient-brand-text">Academy</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Learn the science of biological sex determination through interactive games.
            Three modes, dozens of questions, real forensic knowledge.
          </p>
        </div>

        {/* Game Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="quiz" className="flex flex-col items-center gap-1 py-3 text-xs">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz Challenge</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="showdown" className="flex flex-col items-center gap-1 py-3 text-xs">
              <Swords className="w-4 h-4" />
              <span className="hidden sm:inline">Showdown</span>
              <span className="sm:hidden">♂ vs ♀</span>
            </TabsTrigger>
            <TabsTrigger value="spot" className="flex flex-col items-center gap-1 py-3 text-xs">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Spot Markers</span>
              <span className="sm:hidden">Spot</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="mt-6">
            <QuizChallenge />
          </TabsContent>
          <TabsContent value="showdown" className="mt-6">
            <MarkerShowdown />
          </TabsContent>
          <TabsContent value="spot" className="mt-6">
            <SpotTheMarkers />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Academy;
