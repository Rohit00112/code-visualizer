"use client"

import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = ResizablePrimitive.Group
const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.Separator
    data-slot="resizable-handle"
    className={cn(
      "relative flex w-px items-center justify-center bg-primary/10 transition-colors hover:bg-primary/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 rounded bg-primary shadow-[0_0_10px_#00f2ff] items-center justify-center">
         <div className="h-2 w-[1px] bg-black/40" />
      </div>
    )}
  </ResizablePrimitive.Separator>
)

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
