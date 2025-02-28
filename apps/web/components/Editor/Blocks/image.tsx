import React, { useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RenderElementProps, useFocused, useSelected } from "slate-react";
import Image from "next/image";
import { ImperativePanelHandle } from "react-resizable-panels";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type DragSide = "left" | "right";

interface Draging {
  isDraging: boolean;
  side: DragSide;
}

export default function ImageBlock({
  attributes,
  children,
  element,
}: RenderElementProps) {
  const selected = useSelected();
  const focused = useFocused();
  const [dragSide, setDragSide] = useState<Draging>();

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const middlePanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const onLayout = (newSize: number[]) => {
    if (dragSide?.isDraging && dragSide.side === "left") {
      rightPanelRef.current?.resize(newSize[0] as any);
    } else if (dragSide?.isDraging && dragSide.side === "right") {
      leftPanelRef.current?.resize(newSize[2] as any);
    }
  };

  return (
    <div {...attributes} contentEditable={false} className="mt-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-h-[500px]"
        onLayout={onLayout}
      >
        <ResizablePanel
          defaultSize={20}
          id="left"
          order={1}
          minSize={5}
          maxSize={40}
          ref={leftPanelRef}
        />
        <ResizableHandle
          withHandle
          className="border-none bg-none"
          onDragging={(value: any) =>
            setDragSide((prevState) => ({
              ...prevState,
              side: "left",
              isDraging: value,
            }))
          }
        />
        <ResizablePanel
          id="middle"
          order={2}
          defaultSize={60}
          minSize={20}
          ref={middlePanelRef}
        >
          <div
            className={`${
              selected && focused ? "border-2 rounded-md" : ""
            } mx-2 px-1 py-1`}
          >
            <AspectRatio
              ratio={10 / 4}
              className={"flex h-full item-center justify-center"}
            >
              {element.type == "img" ? (
                <React.Fragment>
                  <Image
                    src={element.url}
                    fill
                    alt={element.caption || "Image"}
                    className="rounded-md"
                  />
                </React.Fragment>
              ) : null}
            </AspectRatio>
          </div>
          <p className="text-center">
            {element.type === "img" ? element.caption : ""}
          </p>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          onDragging={(value: any) =>
            setDragSide((prevState) => ({
              ...prevState,
              side: "right",
              isDraging: value,
            }))
          }
        />
        <ResizablePanel
          id="right"
          order={3}
          defaultSize={20}
          minSize={5}
          maxSize={40}
          ref={rightPanelRef}
        />
      </ResizablePanelGroup>
      {children}
    </div>
  );
}
