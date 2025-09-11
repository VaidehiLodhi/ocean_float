import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface Props {
    projectId: string;
}

export const ProjectHeader =({projectId}: Props)=> {
    const trpc = useTRPC();
    const {data: project} = useSuspenseQuery(
        trpc.projects.getOne.queryOptions({id: projectId})
    )

    const {setTheme, theme} = useTheme();

    return (
      <header className=" font-bold text-[#EBEBEB] p-2 flex justify-between items-center border-b bg-[#393939]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="focus-visible: ring-0 hover:bg-[#EBEBEB] hover:opacity-75 transition-opacity pl-2!"
            >
              {/* <Image
                            src="/logo.svg"
                            alt="Floaty"
                            width={18}
                            height={18}
                        /> */}
              <span className="text-sm font-bold">{project.name}</span>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="bg-[#EBEBEB]"
          >
            <DropdownMenuItem className=" hover:bg-[#393939]/10" asChild>
              <Link href="/">
                <ChevronLeftIcon />
                <span className="font-bold">Go to Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <SunMoonIcon className="size-4 text-muted-foreground" />
                <span className="font-bold">Appearance</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-[#EBEBEB] font-bold">
                  <DropdownMenuRadioGroup
                    value="light"
                    onValueChange={(theme) => {
                      setTheme(theme);
                    }}
                  >
                    <DropdownMenuRadioItem value="light">
                      <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <span>Wotah</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    );
}