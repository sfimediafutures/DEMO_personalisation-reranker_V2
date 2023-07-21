import {FC, ReactNode, useMemo} from 'react'
import { useDroppable } from '@dnd-kit/core'

interface IDroppable {
    id: string;
    children: ReactNode;
    direction?: 'row' | 'column';
    wrap?: 'wrap' | 'nowrap';
}

export const Droppable: FC<IDroppable> = ({ id, children, direction= 'column', wrap='nowrap'}) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    const style = useMemo(
        () => ({
            opacity: isOver ? 0.5 : 1,

        }),
        [isOver]
    );
    return (
        <div ref={setNodeRef}  style={{
            display: 'flex', // Set display to 'flex'
            flexDirection: direction, // Arrange items horizontally in a row
            flexWrap: wrap,
            maxWidth: "100%",
            ...style, // Include the transform style if applicable
            }}> 
            {children}
        </div>
    )
};