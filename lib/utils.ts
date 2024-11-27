import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Camera, Color } from "@/types/canvas";

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

/**
 * 将Color对象转换为CSS可识别的十六进制颜色字符串
 *
 * @param color - 一个包含RGB值的Color对象
 * @returns 返回一个十六进制颜色字符串，格式为"#RRGGBB"
 *
 * 此函数将Color对象的RGB值分别转换为十六进制字符串，并确保每个颜色分量的长度为两位，
 * 然后将这些字符串拼接在一起，形成CSS可识别的颜色格式函数不处理Color对象的其他属性，
 * 仅关注其RGB值
 */
export function colorToCss(color: Color) {
    return `#${color.r.toString(16).padStart(2, "0")}${color.g
        .toString(16)
        .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}
