import { logger } from "@workspace/utils";
import { getPubSubClient } from "../lib/pubsub";

export const PubSubService = {
  async publishMessage(topicName: string, data: Record<string, any>) {
    logger.log(`Publishing message to topic ${topicName}:`, data);
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const messageId = await getPubSubClient()
      .topic(topicName)
      .publish(dataBuffer);
    logger.log(`Message ${messageId} published to topic ${topicName}`, {
      meta: { data },
    });
    return messageId;
  },
};
