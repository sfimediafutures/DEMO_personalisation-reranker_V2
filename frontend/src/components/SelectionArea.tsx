import { FC, useMemo } from "react";
import { styled } from "@stitches/react";
import * as _ from "radash";

import { Droppable } from "../primitives/Droppable";

import { DraggableElementSmall } from "./DraggableElementSmall";

import { IElement } from "../interfaces/interface";

interface IArea {
    heading: string;
    elements: IElement[];
}

export const SelectionArea: FC<IArea> = ({ heading, elements}) => {
    const areaIdentifier = useMemo(() => _.camel(heading), [heading]);

    const amounts = useMemo(
        () => elements.filter((elm) => elm.column === areaIdentifier).length, 
        [elements, areaIdentifier]
    );

    return (
        <AreaWrapper>

            <AreaHeaderWrapper>
                <Heading>
                    
                </Heading>
                <AreaTasksAmount>
                    {amounts}
                </AreaTasksAmount>
            </AreaHeaderWrapper>
            <DroppableArea>
                <Droppable id={areaIdentifier} direction="row" wrap="wrap">
                    {elements.map((elm, elmIndex) => (
                        <DraggableElementSmall 
                            key={`draggable-element-${elmIndex}-${areaIdentifier}`}
                            identifier={elm.id}
                            content={elm.id}
                        />
                    ))}
                    <DropPlaceholder />
                </Droppable>
            </DroppableArea>

        </AreaWrapper>
    );
};

const Heading = styled("h3", {
    color: "#fff",
    padding: "0 0 0 0",
    margin: "0 0 0 0",
});

const AreaWrapper = styled("div", {
    zIndex: "2",
    // overflow: "scroll",
    padding: 10,
    border: "solid .5px",
    borderRadius: 10,
  });
  
const DropPlaceholder = styled("div", {
    zIndex: "100",
});

const DroppableArea = styled("div", {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    // overflow: "hidden",
})
  
const AreaHeaderWrapper = styled("div", {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 3px 0px 3px",
    borderRadius: 10,
});

const AreaTasksAmount = styled("span", {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 6,
    color: "#FFF",
    background: "rgba( 255, 255, 255, 0.1 )",
    boxShadow: "0 8px 32px 0 rgba( 255, 255, 255, 0.18 )",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
});