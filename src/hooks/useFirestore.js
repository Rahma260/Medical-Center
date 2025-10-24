import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        docId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate
          ? doc.data().createdAt.toDate()
          : doc.data().createdAt,
      }));
      setData(list);
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addData = async (newData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...newData,
        createdAt: serverTimestamp(),
      });
      await fetchData();
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err);
      return { success: false, error: err.message };
    }
  };

  const updateData = async (id, updatedData) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      await fetchData();
      return { success: true };
    } catch (err) {
      console.error(`Error updating ${collectionName}:`, err);
      return { success: false, error: err.message };
    }
  };

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      await fetchData();
      return { success: true };
    } catch (err) {
      console.error(`Error deleting from ${collectionName}:`, err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    fetchData,
    addData,
    updateData,
    deleteData,
  };
};