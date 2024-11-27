import { useSelf, useStorage } from "@liveblocks/react";
import type { Layer, XYWH } from "@/types/canvas";
import { shallow } from "@liveblocks/react";

/**
 * 计算多个图层的最小包围框
 * @param layers 图层数组，每个图层都有坐标和尺寸信息
 * @returns 返回最小包围框的坐标和尺寸，如果没有图层则返回null
 */
const boundingBox = (layers: Layer[]): XYWH | null => {
    // 获取第一个图层作为初始的边界
    const first = layers[0];

    // 如果没有图层，则返回null
    if (!first) return null;

    // 初始化边界为第一个图层的边界
    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    // 遍历其余图层，更新边界
    for (let i = 1; i < layers.length; i++) {
        const { x, y, width, height } = layers[i];

        if (left > x) {
            left = x;
        }

        if (right < x + width) {
            right = x + width;
        }

        if (top > y) {
            top = y;
        }

        if (bottom < y + height) {
            bottom = y + height;
        }
    }

    // 返回计算出的最小包围框
    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

/**
 * 使用钩子函数获取当前选择的图层的最小包围框
 * @returns 返回当前选择的图层的最小包围框，如果没有选择则为null
 */
export const useSelectionBounds = () => {
    // 获取当前用户的presence中的selection信息
    const selection = useSelf((me) => me.presence.selection);

    // 使用storage钩子函数计算选择的图层的最小包围框
    return useStorage((root) => {
        // 根据选择的图层ID获取实际的图层对象
        const selectedLayers = selection!
            .map((layerId) => root.layers.get(layerId)!)
            .filter(Boolean);

        // 计算并返回最小包围框
        return boundingBox(selectedLayers);
    }, shallow);
};
