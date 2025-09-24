import { PubSub } from "@google-cloud/pubsub";

let pubsubInstance: PubSub | null = null;

export function getPubSubInstance(): PubSub {
  if (!pubsubInstance) {
    pubsubInstance = new PubSub();
  }
  return pubsubInstance;
}

export async function publishMessage(
  topicName: string,
  data: Record<string, string>
): Promise<string> {
  const pubsub = getPubSubInstance();
  const dataBuffer = Buffer.from(JSON.stringify(data));

  const messageId = await pubsub.topic(topicName).publish(dataBuffer);
  return messageId;
}
