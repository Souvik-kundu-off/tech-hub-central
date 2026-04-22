import { useState, useRef } from "react";
import { uploadToCloudinary, CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary";
import { Upload, Loader2, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryMultiUploadProps {
  /** Current list of image URLs */
  images: string[];
  /** Called with the updated list after upload/remove */
  onChange: (urls: string[]) => void;
  /** Max number of images allowed */
  maxImages?: number;
  /** Max file size in MB per image */
  maxSizeMB?: number;
  /** Cloudinary folder */
  folder?: string;
  /** Label */
  label?: string;
}

const CloudinaryMultiUpload = ({
  images,
  onChange,
  maxImages = 6,
  maxSizeMB = 5,
  folder = "tech-hub/projects",
  label,
}: CloudinaryMultiUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isConfigured = !!CLOUDINARY_CLOUD_NAME;

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);

    if (images.length + fileArr.length > maxImages) {
      toast.error(`Max ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of fileArr) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxSizeMB}MB`);
        continue;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      try {
        const url = await uploadToCloudinary(file, folder);
        newUrls.push(url);
      } catch (e: any) {
        toast.error(`Failed: ${file.name}`);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded!`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px]">
        <AlertCircle size={14} className="shrink-0" />
        <span>Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label} ({images.length}/{maxImages})
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative group aspect-video rounded-md overflow-hidden border border-border">
            <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
            }}
            className="aspect-video rounded-md border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer text-xs gap-1 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
            <span>{uploading ? "Uploading..." : "Upload"}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default CloudinaryMultiUpload;
