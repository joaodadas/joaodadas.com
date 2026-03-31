"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import ContentWrapper from "~/components/ContentWrapper";

interface ImageData {
  name: string;
  src: string;
  date?: string;
}

// In App Router we can't use fs in client components.
// We'll read the gallery images at build time via a server component wrapper.
// For now, keeping it simple with a static list that can be extended.
const galleryImages: ImageData[] = [];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  return (
    <>
      <ContentWrapper>
        <h1 className="font-medium text-2xl tracking-tighter mb-6">Gallery</h1>

        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-muted-foreground/60"
          >
            <path
              d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
              stroke="currentColor"
              strokeWidth="1.125"
              strokeLinecap="round"
              pathLength="100"
              style={{
                strokeDasharray: "15 85",
                animation: "infinity-move 2s linear infinite, infinity-dash 4s ease-in-out infinite",
              }}
            />
          </svg>
          <p className="text-xs text-muted-foreground/60">em construção</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {galleryImages.map((image) => (
            <div
              key={image.name}
              className="group flex cursor-pointer flex-col items-center justify-between rounded-md bg-card p-3 shadow-md transition hover:shadow-xl"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-[220px] w-full overflow-hidden rounded-sm bg-black">
                <Image
                  src={image.src}
                  alt={image.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-3 w-full text-center text-foreground">
                <p className="text-sm font-medium">{image.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {image.date ?? "23/07/2025 18:30"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ContentWrapper>

      <Dialog
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center overflow-auto p-4">
          <div className="w-full max-w-5xl rounded-md bg-card p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="mb-4 rounded-md bg-muted px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              Fechar
            </button>

            {selectedImage && (
              <>
                <div className="flex justify-center">
                  <div className="relative h-[70vh] w-full max-w-4xl">
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.name}
                      fill
                      className="rounded-md object-contain"
                    />
                  </div>
                </div>

                <p className="mt-2 text-center text-muted-foreground">
                  {selectedImage.name} —{" "}
                  {selectedImage.date ?? "23/07/2025 18:30"}
                </p>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
