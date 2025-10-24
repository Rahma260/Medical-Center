import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";

export const useProfile = (collectionName, userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await profileService.fetchProfile(collectionName, userId);

      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [collectionName, userId]);

  return { profile, loading, error };
};