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

    // Call your Langflow RAG model http://localhost:7860/api/v1/run/dfb9e75e-1341-407e-9d58-7bf81ed5f861
    const ragResponse = await step.run("call-langflow-rag", async () => {
      const response = await fetch(`${process.env.LANGFLOW_API_URL}/api/v1/run/dfb9e75e-1341-407e-9d58-7bf81ed5f861`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value: userMessage,
          output_type: "chat",
          input_type: "chat",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Langflow API error: ${response.status} - ${errorText}`);
        throw new Error(`Langflow API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Langflow response:", data);

      // Extract the response from the complex Langflow structure
      try {
        const responseText = data.outputs?.[0]?.outputs?.[0]?.text ||
          data.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
          data.output ||
          data.result ||
          data.data;

        if (responseText) {
          return responseText;
        } else {
          console.error("Could not extract response from Langflow data:", data);
          return "Sorry, I couldn't generate a response.";
        }
      } catch (error) {
        console.error("Error parsing Langflow response:", error);
        return "Sorry, I couldn't generate a response.";
      }
    });

    // Save the assistant's response to the database
    await step.run("save-assistant-message", async () => {
      await prisma.message.create({
        data: {
          content: ragResponse,
          role: "ASSISTANT",
          type: "RESULT",
          projectId: projectId,
        },
      });
    });

    return {
      messageId,
      projectId,
      assistantResponse: ragResponse
    };
  },
);