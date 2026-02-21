import { useCallback, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
  imagePreview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

const UploadZone = ({ onImageSelected, imagePreview, onClear, disabled }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  if (imagePreview) {
    return (
      <div className="relative max-w-md mx-auto rounded-lg overflow-hidden border border-border glow-teal">
        <img src={imagePreview} alt="Uploaded" className="w-full h-auto max-h-96 object-contain bg-muted" />
        {!disabled && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-10 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 max-w-md mx-auto",
        isDragging
          ? "border-primary bg-primary/5 glow-teal"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="p-3 rounded-full bg-primary/10">
        <Upload className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">Drop an image here or click to upload</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, or WEBP</p>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
      />
    </label>
  );
};

export default UploadZone;
