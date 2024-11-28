"use client";

import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import React, { memo } from "react";
import ColorPicker from "./ColorPicker";
import useDeleteLayers from "@/hooks/useDeleteLayers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
            <div className="flex items-center pl-2 ml-2 border-l">
                <Hint label="Delete">
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
