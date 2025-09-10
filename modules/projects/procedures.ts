import { generateSlug } from "random-word-slugs"
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod"

export const projectRouter = createTRPCRouter({
    getMany: baseProcedure
        .query(async () => {
            const projects = await prisma.project.findMany({
                orderBy: {
                    updatedAt: "asc",
                }
            })
            return projects;
        }),

    create: baseProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, { message: "value is required" })
                    .max(10000, { message: "value is too long" })
            }),
        )
        .mutation(async ({ input }) => {
            const createdProject = await prisma.project.create({
                data: {
                    name: generateSlug(2, {
                        format: "kebab",
                    }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT",
                        }
                    }
                }
            })

            // await inngest.send({
            //     name: "test/hello.world",
            //     data: {
            //         value: input.value
            //         projectId = createProject.id,

            //     }
            // })

            return createdProject;
        })
})