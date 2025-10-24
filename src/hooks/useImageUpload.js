import { useState } from "react";

export const useImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "btd7amx6");
    const publicId = `doctorPhotos/${Date.now()}_${file.name}`;
    formData.append("public_id", publicId);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/drswql658/image/upload",
        { method: "POST", body: formData }
      );
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  const handleImageChange = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      callback?.("Only image files are allowed", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      callback?.("File size exceeds 5MB limit", "error");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(imageFile);
      setIsUploading(false);
      return url;
    } catch (err) {
      setIsUploading(false);
      throw err;
    }
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  return {
    imageFile,
    imagePreview,
    isUploading,
    handleImageChange,
    uploadImage,
    resetImage,
    setImagePreview,
  };
};