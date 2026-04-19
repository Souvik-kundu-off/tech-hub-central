import { useState, useRef } from "react";
import { uploadToCloudinary, CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary";
import { Upload, Loader2, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  /** Called with the secure URL after successful upload */
  onUpload: (url: string) => void;
  /** Folder name in Cloudinary to organize uploads */
  folder?: string;
  /** Current image URL (for preview) */
  currentUrl?: string;
  /** Called when the image is cleared */
  onClear?: () => void;
  /** Label text above the upload area */
  label?: string;
  /** Max file size in MB (default: 5) */
  maxSizeMB?: number;
  /** Accept specific file types */
  accept?: string;
  /** Display variant */
  variant?: "default" | "compact" | "avatar";
  /** Whether upload is disabled */
  disabled?: boolean;
}

const CloudinaryUpload = ({
  onUpload,
  folder = "tech-hub",
  currentUrl,
  onClear,
  label,
  maxSizeMB = 5,
  accept = "image/*",
  variant = "default",
  disabled = false,
}: CloudinaryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isConfigured = !!CLOUDINARY_CLOUD_NAME;

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder);
      onUpload(url);
      toast.success("Image uploaded!");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be selected again
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px]">
        <AlertCircle size={14} className="shrink-0" />
        <span>Cloudinary not configured. Set <code className="bg-black/20 px-1 rounded">VITE_CLOUDINARY_CLOUD_NAME</code> and <code className="bg-black/20 px-1 rounded">VITE_CLOUDINARY_UPLOAD_PRESET</code> in your .env file.</span>
      </div>
    );
  }

  // Avatar variant - circular
  if (variant === "avatar") {
    return (
      <div className="space-y-2">
        {label && <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center overflow-hidden border-2 border-white/10 shrink-0">
            {currentUrl ? (
              <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex gap-2">
            <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
              uploading ? "bg-white/5 text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}>
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading ? "Uploading..." : "Upload"}
              <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleChange} disabled={disabled || uploading} />
            </label>
            {currentUrl && onClear && (
              <button onClick={onClear} className="px-2 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant - small inline button
  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {label && <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>}
        <div className="flex items-center gap-3">
          {currentUrl && (
            <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
              {onClear && (
                <button onClick={onClear} className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/60 text-white hover:bg-red-500/80 transition-colors">
                  <X size={8} />
                </button>
              )}
            </div>
          )}
          <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold cursor-pointer transition-colors ${
            uploading ? "bg-white/5 text-muted-foreground" : "bg-card hover:border-primary/30 text-foreground"
          }`}>
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            {uploading ? "Uploading..." : currentUrl ? "Replace" : "Upload Image"}
            <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleChange} disabled={disabled || uploading} />
          </label>
        </div>
      </div>
    );
  }

  // Default variant - drop zone
  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>}
      
      {currentUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video max-w-sm">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-white text-[11px] font-bold cursor-pointer hover:bg-white/30 transition-colors">
              Replace
              <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleChange} disabled={disabled || uploading} />
            </label>
            {onClear && (
              <button onClick={onClear} className="px-3 py-1.5 bg-red-500/20 backdrop-blur rounded-lg text-red-300 text-[11px] font-bold hover:bg-red-500/40 transition-colors">
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-white/10 hover:border-primary/30 hover:bg-white/[0.02]"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-primary animate-spin" />
              <span className="text-xs text-muted-foreground">Uploading to cloud...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Upload size={20} />
              </div>
              <span className="text-xs font-medium">Drop an image here or click to browse</span>
              <span className="text-[10px] text-muted-foreground">Max {maxSizeMB}MB — PNG, JPG, WebP</span>
            </>
          )}
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleChange} disabled={disabled || uploading} />
        </label>
      )}
    </div>
  );
};

export default CloudinaryUpload;
