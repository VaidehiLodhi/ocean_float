"use client";

import { shinkaBoldFont } from "../layout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AnimatedSVG from "@/components/animated_logo";

export default function Home() {
  const router = useRouter();

  const [value, setValue] = useState("");

  const trpc = useTRPC();
  //const {data : messages} = useQuery(trpc.messages.getMany.queryOptions());
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );

  return (
    <div
      style={{ color: "#393939" }}
      //backgroundColor: "#EBEBEB"
      className="w-full min-h-screen relative"
    >

      {/* Lines container */}
      <div className="absolute inset-0 z-10 flex justify-between pointer-events-none">
        {/* Repeat this div for each vertical line */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-px bg-red-300 opacity-30 h-full" />
        ))}
      </div>

      {/* Lines container */}
      <div className="transform translate-x-2 absolute inset-0 z-10 flex justify-between pointer-events-none">
        {/* Repeat this div for each vertical line */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-px bg-blue-300 opacity-30 h-full" />
        ))}
      </div>

      {/* Main content - starts after the logo animation */}
      <div className="relative p-4">
        <div className="flex justify-start p-4 items-center z-0 pointer-events-none">
          <img
            src="/logo_black.svg" // Your SVG path here
            alt="My Logo"
          />
        </div>
        <p className="text-sm font-extrabold w-sm px-4 py-8">
          a comprehensive companion that accompanies u on ur ocean explorations
        </p>

        <div className="p-4 max-w-7xl mx-auto">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <Button
            className="bg-[#393939]"
            disabled={createProject.isPending || value.trim().length === 0}
            onClick={() => createProject.mutate({ value: value.trim() })}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
