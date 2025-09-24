import {
  ServerUnaryCall,
  sendUnaryData,
} from "@grpc/grpc-js/build/src/server-call";
import { getFirestoreInstance } from "../utils/firestore";
import { generateSignedUrl } from "../utils/storage";
import { publishMessage } from "../utils/pubsub";
import { v4 as uuidv4 } from "uuid";

export const productService = {
  createDraft: async (
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ) => {
    try {
      const { user_id, photos_count, include_voice, preferred_language } =
        call.request;
      const productId = `pid_${uuidv4().split("-")[0]}`;

      const firestore = getFirestoreInstance();
      await firestore
        .collection("products")
        .doc(productId)
        .set({
          id: productId,
          user_id,
          status: "DRAFT",
          preferred_language: preferred_language || "en",
          include_voice: include_voice || false,
          created_at: new Date(),
          updated_at: new Date(),
        });
    } catch (error) {
      console.error("Error creating draft:", error);
      return callback({
        code: 13, // INTERNAL
        message: "Failed to create draft",
      });
    }
  },
};
