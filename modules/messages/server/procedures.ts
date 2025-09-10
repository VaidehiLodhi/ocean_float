import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod"
export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .query(async() => {
        const messages = await prisma.message.findMany({
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
                .min(1, {message: "Message is required"})
                .max(10000, {message: "Message is too long"}),
            projectId: z.string().min(1, {message: "Project Id is required"})
        }),
    )
    .mutation(async({input}) => {
        const createdMessage = await prisma.message.create({
            data: {
                content: input.value,
                role: "USER",
                type: "RESULT",
                projectId: input.projectId, 
            }
        })

        // await inngest.send({
        //     name: "test/hello.world",
        //     data: {
        //         value: input.value,
        //         projectId: input.projectId,
        //     }
        // })

        return createdMessage;
    })
})