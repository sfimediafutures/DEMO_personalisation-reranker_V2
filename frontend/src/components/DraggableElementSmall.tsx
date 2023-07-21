import { FC, useMemo } from "react";
import { styled } from "@stitches/react";

import { Draggable } from "../primitives/Draggable";
import { IDraggableElement } from "../interfaces/interface";

export const DraggableElementSmall: FC<IDraggableElement> = ({
    identifier
}) => {
    const itemIdentifier = useMemo(() => identifier, [identifier])

    return (
        <Draggable id={itemIdentifier}>
            <ElementWrapper>
                <ElementText>{identifier}</ElementText>
            </ElementWrapper>
        </Draggable>
    )
}

const ElementWrapper = styled("div", {
    // background: "#f6f6f6",
    height: 50,
    width: 50,
    display: "flex",
    margin: ".5rem .1rem .5rem .1rem",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 50,
    color: "#FFF",
    background: "rgba( 255, 255, 255, 0.25 )",

    backdropFilter: "blur(5px)",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
});

const ElementText = styled("h3", {
    fontSize: 18,
    fontWeight: 600,
});