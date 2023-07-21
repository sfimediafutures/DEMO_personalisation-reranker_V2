import { FC, ReactNode, useMemo } from "react";
import { styled } from "@stitches/react";

import { useDraggable } from "@dnd-kit/core";

interface IDraggable {
  id: string;
  children: ReactNode;
}

export const DraggableLarge: FC<IDraggable> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const style = useMemo(() => {
    if (transform) {
      return {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      };
    }
    return undefined;
  }, [transform]);

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <Holder>
          <StyledButton
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
          >
            <p>Drag me</p>
          </StyledButton>
          {!isDragging && children}
        </Holder>
      </div>
    </>
  );
};

const Holder = styled("div", {
  display: "grid",
  gridTemplateColumns: "50% 50%",
  gridTemplateRows: "2.5rem auto",
});

const StyledButton = styled("button", {
  gridColumn: "1/1",
  gridRow: "1/1",
  width: "auto",
  borderRadius: 6,
  color: "#FFF",
  background: "rgba( 255, 255, 255, 0.25 )",
  boxShadow: "0 8px 32px 0 rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",

  "& p": {
    margin: "0",
    padding: "0",
  },
});
