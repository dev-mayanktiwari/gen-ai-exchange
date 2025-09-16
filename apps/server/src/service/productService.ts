import { v4 as uuidV4 } from "uuid";
import { getFirestoreDb } from "../lib/firestore";
import { Product } from "../lib/product";

export const ProductService = {
  async createDraft(userId: string, preferredLanguage?: string) {
    const db = getFirestoreDb();
    const productId = `pid_${uuidV4().split("-")[0]}`;

    const productData = {
      id: productId,
      userId,
      status: "DRAFT",
      preferredLanguage: preferredLanguage || "en",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("products").doc(productId).set(productData);
    return productData;
  },

  async getProductById(productId: string) {
    const doc = await getFirestoreDb()
      .collection("products")
      .doc(productId)
      .get();
    return doc.exists ? (doc.data() as Product) : null;
  },

  async updateProduct(productId: string, data: Partial<Product>) {
    const productRef = getFirestoreDb().collection("products").doc(productId);

    const now = new Date();
    const productData = {
      ...data,
      updatedAt: now,
    };

    await productRef.set(productData, { merge: true });
  },

  async userOwnsProduct(userId: string, productId: string) {
    const doc = await getFirestoreDb()
      .collection("products")
      .doc(productId)
      .get();
    return doc.exists && doc.data()?.userId === userId;
  },
};
