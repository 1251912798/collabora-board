import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react/suspense";
import { warn } from "console";
import { memo } from "react";
import Rectangle from "./Rectangle";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string;
}
const LayerPreview = ({
    id,
    onLayerPointerDown,
    selectionColor,
}: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
        return null;
    }
    // 矩形
    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        default:
            return null;
    }
};

export default memo(LayerPreview);

LayerPreview.display = "LayerPreview";
