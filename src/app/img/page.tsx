"use client";

import { useDropzone } from "react-dropzone";
import { ReactSortable } from "react-sortablejs";
import { UploadImage } from "./types";
import { useImageUploader } from "./useImageUploader";
import { Plus } from "lucide-react";

type Props = {
  max?: number;
  value?: UploadImage[];
  onChange?: (images: UploadImage[]) => void;
};

export default function ImageUploader({ max = 8, value, onChange }: Props) {
  const { images, setImages, addFiles, removeImage, error, isMaxReached } =
    useImageUploader(value, onChange, max);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    disabled: isMaxReached,
    onDrop: addFiles,
  });

  return (
    <div className="space-y-3">
      {/* Error */}
      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`rounded-lg py-3 p-3 text-sm bg-[#F5F8FD]
          ${
            isMaxReached
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : isDragActive
              ? "cursor-pointer border-blue-500 bg-blue-50"
              : "cursor-pointer border-gray-300"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex justify-center items-center border size-15 rounded-md border-dashed border-slate-500">
            <Plus size={35} />
          </div>

          {/* Preview + Sort */}
          <div className="" onClick={(e) => e.stopPropagation()}>
            <ReactSortable
              list={images}
              setList={(newList) => {
                setImages(newList);
                onChange?.(newList);
              }}
              animation={200}
              className="flex gap-2 flex-wrap"
            >
              {images.map((img) => (
                <div key={img.id} className="group relative rounded border">
                  <img
                    src={img.preview}
                    alt=""
                    className="size-15 rounded object-cover"
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white group-hover:flex"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </ReactSortable>
          </div>
        </div>
      </div>
    </div>
  );
}
