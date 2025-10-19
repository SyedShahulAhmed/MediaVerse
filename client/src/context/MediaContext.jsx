import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const MediaContext = createContext();

export function MediaProvider({ children }) {
  const { user } = useAuth();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await API.get("/media");
      setMediaList(data);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMedia = async (newMedia) => {
    try {
      const { data } = await API.post("/media", newMedia);
      setMediaList((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error adding media:", err);
    }
  };

  const updateMedia = async (id, updates) => {
    try {
      const { data } = await API.put(`/media/${id}`, updates);
      setMediaList((prev) => prev.map((m) => (m._id === id ? data : m)));
    } catch (err) {
      console.error("Error updating media:", err);
    }
  };

  const deleteMedia = async (id) => {
    try {
      await API.delete(`/media/${id}`);
      setMediaList((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [user]);

  return (
    <MediaContext.Provider
      value={{ mediaList, loading, addMedia, updateMedia, deleteMedia }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export const useMedia = () => useContext(MediaContext);
