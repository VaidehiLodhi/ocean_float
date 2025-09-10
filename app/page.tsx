"use client"

import Image from "next/image";
import { shinkaBoldFont } from "./layout";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {Toaster, toast} from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {

  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message created")
    }
  }))

  return (
    <div
      style={{ backgroundColor: "#EBEBEB", color: "#393939" }}
      className="w-full min-h-screen relative flex flex-col"
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

      <div className="w-full relative z-0 h-auto flex">
        <p className={`${shinkaBoldFont.className}  text-9xl`}>Float</p>
        <p className={`${shinkaBoldFont.className} text-9xl`}>Chat</p>
      </div>
      <p className="text-sm font-extrabold relative z-0 w-sm">
        a comprehensive companion that accompanies u on ur ocean explorations
      </p>

      <div className="p-4 max-w-7xl mx-auto">
        <Input value={value} onChange={(e) => setValue(e.target.value)}/>
        <Button disabled={createMessage.isPending} onClick={()=>createMessage.mutate({value: value})}>
          Send Message
        </Button>
      </div>
    </div>
  );
}
