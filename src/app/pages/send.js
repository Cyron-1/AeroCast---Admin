// src/utils/firestoreHelpers.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Update a Firestore document
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The ID of the document to update
 * @param {Object} data - The fields to update
 */
export const updateFirestoreDoc = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId); // reference to the document
    await updateDoc(docRef, data); // update the document with new fields
    console.log(`Document ${docId} updated successfully in ${collectionName}`);
  } catch (error) {
    console.error("Error updating document:", error);
  }
};