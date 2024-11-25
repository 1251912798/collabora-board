import {
    Circle,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2,
} from "lucide-react";
import ToolButton from "./ToolButton";

import { CanvasMode, LayerType } from "@/types/canvas";

import type { CanvasState } from "@/types/canvas";

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
}: ToolbarProps) => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <ToolButton
                    label="选择"
                    icon={MousePointer2}
                    onClick={() => setCanvasState({ mode: CanvasMode.None })}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton
                    label="文字"
                    icon={Type}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Text,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                />
                <ToolButton
                    label="便签"
                    icon={StickyNote}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Note,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Note
                    }
                />
                <ToolButton
                    label="矩形"
                    icon={Square}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Rectangle,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle
                    }
                />
                <ToolButton
                    label="椭圆"
                    icon={Circle}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Ellipse,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse
                    }
                />
                <ToolButton
                    label="画笔"
                    icon={Pencil}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Pencil,
                        })
                    }
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <ToolButton
                    label="撤销"
                    icon={Undo2}
                    onClick={undo}
                    disabled={canRedo}
                />
                <ToolButton
                    label="重做"
                    icon={Redo2}
                    onClick={redo}
                    disabled={canUndo}
                />
            </div>
        </div>
    );
};

export default Toolbar;

export function ToolbarSkeleton() {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
    );
}
