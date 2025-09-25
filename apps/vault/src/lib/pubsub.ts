import { PubSub } from "@google-cloud/pubsub";
import path from "path";

let pubSubClient: PubSub | null = null;

export function getPubSubClient(): PubSub {
  if (!pubSubClient) {
    pubSubClient = new PubSub({
      keyFilename: path.resolve(
        __dirname,
        "../../gen-ai-hackathon-123-firebase-adminsdk-fbsvc-fd5985da59.json"
      ),
    });
  }
  return pubSubClient;
}
