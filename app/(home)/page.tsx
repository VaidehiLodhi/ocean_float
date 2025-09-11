"use client"

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import Image from "next/image"

const Page =()=> {
    return (
      <div className="flex flex-col max-w-5xl mx-auto w-full">
        <section className="space-y-6 py-[16vh] 2xl:py-48">
          <div className="flex flex-col items-center">
            <Image
              src="/logo_black.svg"
              alt="FloatChat"
              width={500}
              height={500}
              className="hidden md:block"
            />
          </div>
          <h3 className="text-xl md:text-xl font-bold text-center">
            a comprehensive companion that accompanies u on ur ocean
            explorations
          </h3>
          <p className="font-bold text-lg md:text-lg text-muted-foreground text-center">
              
          </p>
          <div className="max-w-3xl mx-auto w-full">
            <ProjectForm />
          </div>
        </section>
      </div>
    );
}

export default Page;