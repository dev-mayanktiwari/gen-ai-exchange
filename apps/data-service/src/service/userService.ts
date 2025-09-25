import { getFirestoreDb } from "../lib/firestore";

export const userService = {
  async createOrUpdateUser(userId: string, data: any) {
    const userRef = getFirestoreDb().collection("users").doc(userId);

    const now = new Date();
    const userData = {
      ...data,
      updatedAt: now,
    };

    const doc = await userRef.get();
    if (!doc.exists) {
      userData.createdAt = now;
    }

    await userRef.set(userData, { merge: true });
  },

  async getUserById(userId: string) {
    const doc = await getFirestoreDb().collection("users").doc(userId).get();
    return doc.exists ? doc.data() : null;
  },
};
