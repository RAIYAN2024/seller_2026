import { useState, useEffect } from "react";

export type UploadImage = {
  id: string;
  file?: File; // optional for remote images
  preview: string;
};

const MIN_DIM = 330;
const MAX_DIM = 6500;
const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

export function useImageUploader(
  value?: UploadImage[],
  onChange?: (images: UploadImage[]) => void,
  max = 8
) {
  const [images, setImages] = useState<UploadImage[]>(value || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) setImages(value);
  }, [value]);

  const isMaxReached = images.length >= max;

  // Validate image dimensions and file size
  const validateFile = (file: File) => {
    return new Promise<string | null>((resolve) => {
      if (file.size > MAX_FILE_SIZE) return resolve("File too large (>6MB)");

      const img = new Image();
      img.onload = () => {
        if (
          img.width < MIN_DIM ||
          img.height < MIN_DIM ||
          img.width > MAX_DIM ||
          img.height > MAX_DIM
        ) {
          resolve(`Image size must be between 330x330 and 6500x6500 px`);
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve("Invalid image file");
      img.src = URL.createObjectURL(file);
    });
  };

  const addFiles = async (files: File[]) => {
    if (isMaxReached) {
      setError(`Maximum ${max} images allowed`);
      return;
    }

    const existingKeys = new Set(
      images.filter((i) => i.file).map((i) => `${i.file!.name}-${i.file!.size}`)
    );

    const accepted: UploadImage[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (images.length + accepted.length >= max) break;

      const key = `${file.name}-${file.size}`;
      if (existingKeys.has(key)) {
        errors.push(`Duplicate file: ${file.name}`);
        continue;
      }

      const validationError = await validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }

      accepted.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (errors.length) setError(errors.join("; "));
    else setError(null);

    const updated = [...images, ...accepted];
    setImages(updated);
    onChange?.(updated);
  };

  const removeImage = (id: string) => {
    const updated = images.filter((i) => i.id !== id);
    setImages(updated);
    onChange?.(updated);
    setError(null);
  };

  const replaceImageAtIndex = async (index: number, file: File) => {
    const validationError = await validateFile(file);
    if (validationError) {
      setError(`${file.name}: ${validationError}`);
      return;
    }

    const updated = [...images];
    updated[index] = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    };
    setImages(updated);
    onChange?.(updated);
    setError(null);
  };

  return {
    images,
    setImages,
    addFiles,
    removeImage,
    replaceImageAtIndex,
    error,
    isMaxReached,
  };
}
