"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Check, X, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "framer-motion";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg", 0.9);
    });
  };

  const handleSave = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 flex flex-col items-center justify-center p-8">
      <div className="relative w-full h-[60vh] max-w-4xl bg-neutral-900 border border-white/20 mb-8">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={2 / 3} // Enforce 2:3 Portrait Ratio
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
          classes={{
            containerClassName: "bg-neutral-950",
            cropAreaClassName: "border-2 border-white/50"
          }}
        />
      </div>

      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Zoom Control */}
        <div className="flex items-center gap-4 text-white">
          <ZoomOut size={16} />
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
          <ZoomIn size={16} />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-oswald uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-white hover:bg-neutral-200 text-black font-oswald uppercase tracking-widest text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
