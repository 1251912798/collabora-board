import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas";
import React from "react";

interface EllipseProps {
    id: string;
    layer: EllipseLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor: string;
}

const Ellipse = ({
    id,
    layer,
    onPointerDown,
    selectionColor,
}: EllipseProps) => {
    const { x, y, width, height, fill } = layer;
    return (
        <ellipse
            className="drop-shadow-md"
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            fill={fill ? colorToCss(fill) : "#000"}
            stroke={selectionColor || "transparent"}
            strokeWidth={1}
        />
    );
};

export default Ellipse;
