import { Firestore, getFirestore } from "firebase-admin/firestore";

let db: Firestore | null = null;

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore();
    return db;
  }

  return db;
}
