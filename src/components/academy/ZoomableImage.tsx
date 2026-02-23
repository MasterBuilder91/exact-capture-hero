import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ZoomableImage = ({ src, alt, className = "" }: ZoomableImageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative group cursor-zoom-in" onClick={() => setOpen(true)}>
        <img src={src} alt={alt} className={className} />
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-background/80 backdrop-blur-sm rounded-full p-2 border border-border shadow-lg">
            <ZoomIn className="w-5 h-5 text-foreground" />
          </span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-background border-none rounded-none [&>button]:z-50 [&>button]:bg-background/80 [&>button]:rounded-full [&>button]:p-2">
          <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
            <img
              src={src}
              alt={alt}
              className="max-w-none w-auto h-auto max-h-[95vh] object-contain cursor-zoom-out"
              onClick={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZoomableImage;
