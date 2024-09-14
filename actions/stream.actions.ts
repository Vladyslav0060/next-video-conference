"use server";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export const tokenProvider = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User is not authenticated");
  if (!apiKey || !apiSecret)
    throw new Error("Stream API key and secret are required");
  const client = new StreamClient(apiKey, apiSecret);
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const iat = Math.floor(Date.now() / 1000) - 60;
  const token = client.generateUserToken({
    user_id: user.id,
    exp,
    iat,
  });
  return token;
};

export const deleteCall = async (callId: string) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User is not authenticated");
    if (!apiKey || !apiSecret)
      throw new Error("Stream API key and secret are required");
    const streamClient = new StreamClient(apiKey, apiSecret);
    const call = streamClient.video.call("default", callId);
    await call.delete({ hard: true });
  } catch (error) {
    // console.error(error);
  }
};
