"use client";

import type React from "react";
import { useState, useRef } from "react";
import { X, UploadIcon, PlusIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/data/schema";
import { MediaItemRow } from "./media-panel";

interface ReighImage {
  id: string;
  src: string | File;
  name: string;
}

interface ReighImageSelectorProps {
  maxImages?: number;
  mediaItems: MediaItem[];
  onChange: (images: (string | File)[]) => void;
}

export default function ReighImageSelector({
  maxImages = 8,
  mediaItems,
  onChange,
}: ReighImageSelectorProps) {
  const [images, _setImages] = useState<ReighImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setImages = (images: ReighImage[]) => {
    _setImages(images);
    onChange(images.map((img) => img.src));
  };

  const addImage = (image: ReighImage) => {
    if (images.length >= maxImages) return;
    setImages([...images, image]);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleSelectMedia = (item: MediaItem) => {
    addImage({
      id: item.id,
      src: item.output?.images?.[0]?.url || item.url || "",
      name: item.input?.prompt || "Untitled",
    });
    setIsDialogOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.slice(0, maxImages - images.length).forEach((file) => {
      addImage({
        id: `file-${Date.now()}-${Math.random()}`,
        src: file,
        name: file.name,
      });
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Transform Images ({images.length}/{maxImages})
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-md overflow-hidden border border-border bg-accent group"
          >
            <img
              src={
                typeof image.src === "string"
                  ? image.src
                  : URL.createObjectURL(image.src)
              }
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(image.id)}
            >
              <X size={12} />
            </Button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxImages - images.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="relative aspect-square rounded-md border-2 border-dashed border-border bg-accent/20 flex items-center justify-center"
          >
            <ImageIcon className="w-6 h-6 text-muted-foreground opacity-30" />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {images.length < maxImages && (
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 border border-dashed"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 border border-dashed"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Select
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select an Image</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 flex-wrap overflow-y-auto max-h-80 divide-y divide-border">
                {mediaItems
                  .filter((media) => media.mediaType === "image")
                  .map((job) => (
                    <MediaItemRow
                      draggable={false}
                      key={job.id}
                      data={job}
                      onOpen={handleSelectMedia}
                      className="cursor-pointer"
                    />
                  ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
