import { AnalysisMode } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { User, Hand, ScanFace } from "lucide-react";

interface ModuleSelectorProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

const modules: { id: AnalysisMode; label: string; icon: typeof User; description: string }[] = [
  { id: "body", label: "Body", icon: User, description: "Shoulder-to-hip ratio" },
  { id: "face", label: "Face", icon: ScanFace, description: "Craniofacial markers" },
  { id: "hands", label: "Hands", icon: Hand, description: "Digit & skeletal cues" },
];

const ModuleSelector = ({ mode, onModeChange }: ModuleSelectorProps) => (
  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
    {modules.map((m) => {
      const Icon = m.icon;
      const active = mode === m.id;
      return (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer",
            active
              ? "border-primary bg-primary/10 glow-teal"
              : "border-border hover:border-primary/40 bg-card"
          )}
        >
          <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("text-sm font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
            {m.label}
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight">{m.description}</span>
        </button>
      );
    })}
  </div>
);

export default ModuleSelector;
