"use client";

import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

const SelectionBox = ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    // 使用useSelf钩子获取当前用户的选择项，判断是否只选择了一个图层
    const soleLayerId = useSelf((me) =>
        me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    // 使用useStorage钩子根据当前选择判断是否显示调整大小的句柄
    const isShowingHandles = useStorage(
        (root) =>
            soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    // 使用useSelectionBounds钩子获取当前选择的边界框
    const bounds = useSelectionBounds();

    // 如果没有有效的边界框，则不渲染任何内容
    if (!bounds) {
        return null;
    }
    return (
        <>
            {/* 绘制一个透明填充、蓝色边框的矩形，用于表示选区边界 */}
            <rect
                className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
                style={{
                    transform: `translate(${bounds.x}px, ${bounds.y}px)`,
                }}
                x={0}
                y={0}
                width={bounds.width}
                height={bounds.height}
            />
            {isShowingHandles && (
                <>
                    {/* 绘制八个方向的调整句柄，用户可以通过这些句柄调整选区大小和位置 */}
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nwse-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(
                                Side.Top + Side.Left,
                                bounds
                            );
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ns-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
            ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
              ${bounds.y - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top, bounds);
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nesw-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(
                                Side.Top + Side.Right,
                                bounds
                            );
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ew-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px
            )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Right, bounds);
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nwse-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px
            )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(
                                Side.Bottom + Side.Right,
                                bounds
                            );
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ns-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px
            )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom, bounds);
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nesw-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px
            )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(
                                Side.Bottom + Side.Left,
                                bounds
                            );
                        }}
                    />
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ew-resize",
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px
            )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Left, bounds);
                        }}
                    />
                </>
            )}
        </>
    );
};

export default memo(SelectionBox);
