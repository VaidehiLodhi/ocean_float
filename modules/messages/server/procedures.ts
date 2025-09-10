import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod"
export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                projectId: z.string().min(1, { message: "Project Id is required" })
            }),
        )
        .query(async ({ input }) => {
            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                },
                include: {
                    fragment: true,
                },
                orderBy: {
                    updatedAt: "asc",
                }
            })
            return messages;
        }),

    create: baseProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, { message: "Message is required" })
                    .max(10000, { message: "Message is too long" }),
                projectId: z.string().min(1, { message: "Project Id is required" })
            }),
        )
        .mutation(async ({ input }) => {
            const createdMessage = await prisma.message.create({
                data: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                    projectId: input.projectId,
                }
            })

            // Trigger Langflow RAG processing
            await inngest.send({
                name: "chat/message.process",
                data: {
                    messageId: createdMessage.id,
                    projectId: input.projectId,
                    userMessage: input.value,
                }
            });

            return createdMessage;
        })
})