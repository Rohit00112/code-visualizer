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
  const Group = ResizablePanelGroup as any;
  const Panel = ResizablePanel as any;
  const Handle = ResizableHandle as any;

  return (
    <Group direction="vertical" className="min-h-screen w-full">
      <Panel defaultSize={75}>
        <Group direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <div className="flex h-full items-center justify-center p-0">
              {left}
            </div>
          </Panel>
          <Handle withHandle />
          <Panel defaultSize={50} minSize={30}>
            <div className="flex h-full p-0">
              {right}
            </div>
          </Panel>
        </Group>
      </Panel>
      {bottom && (
        <>
          <Handle withHandle />
          <Panel defaultSize={25} minSize={10}>
            <div className="flex h-full p-0">
              {bottom}
            </div>
          </Panel>
        </>
      )}
    </Group>
  );
}
