import { useCallback, useState, useRef, useEffect } from "react";
import { Upload, X, Mic, Video, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaUploadZoneProps {
  type: "audio" | "video";
  onMediaSelected: (base64: string) => void;
  mediaPreview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

const MediaUploadZone = ({ type, onMediaSelected, mediaPreview, onClear, disabled }: MediaUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const accept = type === "audio"
    ? "audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/webm"
    : "video/mp4,video/quicktime,video/webm";

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onMediaSelected(result);
    };
    reader.readAsDataURL(file);
  }, [onMediaSelected]);

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

  const startRecording = async () => {
    try {
      const constraints = type === "audio"
        ? { audio: true }
        : { audio: true, video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (type === "video" && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const mimeType = type === "audio" ? "audio/webm" : "video/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onload = (e) => {
          onMediaSelected(e.target?.result as string);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      console.error(`${type === "audio" ? "Microphone" : "Camera"} access denied`);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  if (mediaPreview) {
    return (
      <div className="relative max-w-md mx-auto rounded-lg overflow-hidden border border-border glow-teal p-4">
        {type === "audio" ? (
          <audio src={mediaPreview} controls className="w-full" />
        ) : (
          <video src={mediaPreview} controls className="w-full max-h-80 rounded" />
        )}
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
    <div className="space-y-3 max-w-md mx-auto">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-10 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 glow-teal"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className="p-3 rounded-full bg-primary/10">
          {type === "audio" ? <Mic className="w-6 h-6 text-primary" /> : <Video className="w-6 h-6 text-primary" />}
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            Drop {type === "audio" ? "an audio file" : "a video"} here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            {type === "audio" ? "MP3, WAV, M4A, or WEBM" : "MP4, MOV, or WEBM"}
          </p>
        </div>
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
      </label>

      {type === "audio" && !isRecording && (
        <div className="flex justify-center">
          <Button onClick={startRecording} variant="outline" size="sm" className="gap-2">
            <Mic className="w-3 h-3" />
            Record with Microphone
          </Button>
        </div>
      )}

      {type === "video" && !isRecording && (
        <div className="flex justify-center">
          <Button onClick={startRecording} variant="outline" size="sm" className="gap-2">
            <Video className="w-3 h-3" />
            Record with Camera
          </Button>
        </div>
      )}

      {isRecording && (
        <div className="space-y-3">
          {type === "video" && (
            <div className="max-w-md mx-auto rounded-lg overflow-hidden border border-destructive/50">
              <video ref={videoPreviewRef} muted playsInline className="w-full max-h-64 rounded" />
            </div>
          )}
          <div className="flex justify-center">
            <Button onClick={stopRecording} variant="destructive" size="sm" className="gap-2">
              <Square className="w-3 h-3" />
              Stop Recording
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploadZone;
