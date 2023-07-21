import { FC, useMemo } from "react";
import { styled } from "@stitches/react";
import * as _ from "radash";

import { Droppable } from "../primitives/Droppable";

import { DraggableElement } from "./DraggableElement";

import { IColumn } from "../interfaces/interface";



export const Column: FC<IColumn> = ({ heading, elements}) => {
    const columnIdentifier = useMemo(() => _.camel(heading), [heading]);

    return (
        <ColumnWrapper>
            <Droppable id={columnIdentifier}>
                {elements.map((elm, elmIndex) => (
                        <DraggableElement 
                            key={`draggable-element-${elmIndex}-${columnIdentifier}`}
                            identifier={elm.id}
                        />
                ))}
                <DropPlaceholder />
            </Droppable>

        </ColumnWrapper>
    );
};


const ColumnWrapper = styled("div", {
    height: "100%",
    padding: ".5rem",
    border: "solid .5px",
    borderRadius: 10,

  });
  
const DropPlaceholder = styled("div", {
    height: 200,
    backgroundColor: "transparent",

});
