"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";

export default function UploadMovies() {
  const [file, setFile] = useState<File | null>(null);
  const [movieName, setMovieName] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    setUploadSuccess(null);
    setErrorMessage("");
  };

  const handleImageUpload = async (file: File | null): Promise<void> => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("name", movieName);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(progress);
          },
          params: {
            name: movieName,
          },
        }
      );

      if (response.status === 200) {
        setUploadSuccess(true);
        setErrorMessage("");
      } else {
        setUploadSuccess(false);
        setErrorMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadSuccess(false);
      setErrorMessage("An error occurred during the upload. Please try again.");
    }
  };

  return (
    <div className="my-5">
      <h1 className="text-xl text-white">Upload Movies</h1>
      <main className="border border-solid rounded-xl w-full px-12 py-8 gap-5 flex flex-col">
        <h1 className="text-xl">Upload Movie</h1>
        <Input
          onChange={(e) => setMovieName(e.target.value)}
          type="text"
          placeholder="Enter movie name (will be shown)"
        />
        <Input
          onChange={handleFileChange}
          type="file"
          accept="video/*"
          placeholder="Select a video file"
        />
        <Button onClick={() => handleImageUpload(file)}>Upload Video</Button>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        {uploadSuccess === true && <p>Upload successful!</p>}
        {uploadSuccess === false && <p>Upload failed. {errorMessage}</p>}
      </main>
    </div>
  );
}
