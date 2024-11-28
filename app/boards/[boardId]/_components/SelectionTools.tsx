"use client";

import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import React, { memo } from "react";
import ColorPicker from "./ColorPicker";
import useDeleteLayers from "@/hooks/useDeleteLayers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
    camera: Camera;
    setLastUsedColor: (color: Color) => void;
}
const SelectionTools = ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((self) => self.presence.selection);

    // 使用useDeleteLayers钩子定义删除图层的函数
    const deleteLayers = useDeleteLayers();
    // 使用useSelectionBounds钩子获取选择区域的边界
    const selectionBounds = useSelectionBounds();

    // 更改选定图层颜色的mutation
    const handleColorChange = useMutation(
        ({ storage }, fill: Color) => {
            const liveLayers = storage.get("layers");
            setLastUsedColor(fill);

            selection.forEach((id) => {
                liveLayers.get(id)?.set("fill", fill);
            });
        },
        [selection, setLastUsedColor]
    );

    // 将选定的图层移至最底部的mutation
    const onMoveToBack = useMutation(
        ({ storage }) => {
            const liveLayerIds = storage.get("layerIds");

            const indices: number[] = [];

            const arr = liveLayerIds.toImmutable();

            for (let i = 0; i < arr.length; i++) {
                if (selection.includes(arr[i])) {
                    indices.push(i);
                }
            }

            for (let i = 0; i < indices.length; i++) {
                liveLayerIds.move(indices[i], i);
            }
        },
        [selection]
    );

    // 将选定的图层移至最前面的mutation
    const onMoveToFront = useMutation(
        ({ storage }) => {
            const liveLayerIds = storage.get("layerIds");

            const indices: number[] = [];

            const arr = liveLayerIds.toImmutable();

            for (let i = 0; i < arr.length; i++) {
                if (selection.includes(arr[i])) {
                    indices.push(i);
                }
            }

            for (let i = indices.length - 1; i >= 0; i--) {
                liveLayerIds.move(
                    indices[i],
                    arr.length - 1 - (indices.length - 1 - i)
                );
            }
        },
        [selection]
    );

    // 如果没有选择区域边界，则返回null
    if (!selectionBounds) return null;

    // 计算选择工具面板的位置
    const x = selectionBounds.width / 2 + selectionBounds.x - camera.x;
    const y = selectionBounds.y + camera.y;
    return (
        <div
            className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
            style={{
                transform: `translate(
            calc(${x}px - 50%),
            calc(${y - 16}px - 100%)
          )`,
            }}>
            <ColorPicker onChange={handleColorChange} />
            <div className="flex flex-col gap-y-0.5">
                <Hint label="置于顶层">
                    <Button variant="board" size="icon" onClick={onMoveToFront}>
                        <BringToFront />
                    </Button>
                </Hint>
                <Hint label="置于底层">
                    <Button variant="board" size="icon" onClick={onMoveToBack}>
                        <SendToBack />
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center pl-2 ml-2 border-l">
                <Hint label="删除">
                    <Button variant="board" size="icon" onClick={deleteLayers}>
                        <Trash2 />
                    </Button>
                </Hint>
            </div>
        </div>
    );
};

export default memo(SelectionTools);

SelectionTools.displayName = "SelectionTools";
