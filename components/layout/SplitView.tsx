"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode } from "react";

interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
  bottom?: ReactNode;
}

export function SplitView({ left, right, bottom }: SplitViewProps) {
  return (
    <ResizablePanelGroup direction="vertical" className="min-h-screen w-full">
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex h-full items-center justify-center p-0">
              {left}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex h-full p-0">
              {right}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      {bottom && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={10}>
            <div className="flex h-full p-0">
              {bottom}
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
