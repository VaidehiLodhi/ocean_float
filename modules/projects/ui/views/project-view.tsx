"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/lib/generated/prisma";
import { ProjectHeader } from "../components/project-header";

interface Props {
    projectId:  string;
}

export const ProjectView =({projectId} : Props)=> {
    const [activateFragment, setActivateFragment] = useState<Fragment | null>(null);

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<p>Loading project</p>}>
                        <ProjectHeader projectId={projectId}/>
                    </Suspense>
                    <Suspense fallback={<p>Loading....</p>}>
                        <MessagesContainer 
                            projectId={projectId}
                            activateFragment={activateFragment}
                            setActivateFragment={setActivateFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle className="hover:bg-primary transition-colors"/>
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    TODO: Preview
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}