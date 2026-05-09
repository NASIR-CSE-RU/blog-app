"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { ChangeEvent } from "react";

type CreatePostImagePickerProps = {
  inputName?: string;
  resetKey?: number;
};

export type CreatePostImagePickerHandle = {
  openPicker: () => void;
};

const CreatePostImagePicker = forwardRef<CreatePostImagePickerHandle, CreatePostImagePickerProps>(
  function CreatePostImagePicker(
    {
      inputName = "image",
      resetKey = 0,
    }: CreatePostImagePickerProps,
    ref,
  ) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  useEffect(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setImagePreviewUrl(null);
    setImageName(null);
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function handlePhotoPickerOpen() {
    inputRef.current?.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!file) {
      setImagePreviewUrl(null);
      setImageName(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setImagePreviewUrl(nextPreviewUrl);
    setImageName(file.name);
  }

  function handleImageRemove() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setImagePreviewUrl(null);
    setImageName(null);
  }

  useImperativeHandle(ref, () => ({
    openPicker: handlePhotoPickerOpen,
  }));

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        name={inputName}
        accept="image/*"
        className="d-none"
        onChange={handleImageChange}
      />
      {imagePreviewUrl ? (
        <div className="mt-3">
          <div className="border rounded p-2">
            <img
              src={imagePreviewUrl}
              alt="Selected post photo preview"
              className="img-fluid rounded w-100"
            />
            <div className="d-flex align-items-center justify-content-between mt-2 gap-2 flex-wrap">
              <small className="text-muted">{imageName}</small>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={handleImageRemove}
              >
                Remove photo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
  },
);

export default CreatePostImagePicker;
