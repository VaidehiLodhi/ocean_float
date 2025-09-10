import { inngest } from "./client";
import { prisma } from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const processChatMessage = inngest.createFunction(
  { id: "process-chat-message" },
  { event: "chat/message.process" },
  async ({ event, step }) => {
    const { messageId, projectId, userMessage } = event.data;

    // Call ChatGPT API
    const chatGptResponse = await step.run("call-chatgpt", async () => {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for ocean exploration and marine research. Provide informative and engaging responses about marine life, oceanography, and underwater exploration."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    });

    // Save the assistant's response to the database
    await step.run("save-assistant-message", async () => {
      await prisma.message.create({
        data: {
          content: chatGptResponse,
          role: "ASSISTANT",
          type: "RESULT",
          projectId: projectId,
        },
      });
    });

    return {
      messageId,
      projectId,
      assistantResponse: chatGptResponse
    };
  },
);