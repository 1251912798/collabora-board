import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Camera } from "@/types/canvas";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const connectionIdToColor = (connectionId: number) => {
    return COLORS[connectionId % COLORS.length];
};

// 将指针事件转换为画布坐标点
export const pointerEventToCanvasPoint = (
    e: React.PointerEvent,
    camera: Camera
) => {
    return {
        x: Math.round(e.clientX) - camera.x,
        y: Math.round(e.clientY) - camera.y,
    };
};
