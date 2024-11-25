import React from "react";
import ToolButton from "./ToolButton";
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

import { CanvasState, CanvasMode } from "@/types/canvas";

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
                    label="Select"
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
                    label="Text"
                    icon={Type}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                        })
                    }
                    isActive={canvasState.mode === CanvasMode.Inserting}
                />
                <ToolButton
                    label="Sticky note"
                    icon={StickyNote}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                        })
                    }
                    isActive={canvasState.mode === CanvasMode.Inserting}
                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                        })
                    }
                    isActive={canvasState.mode === CanvasMode.Inserting}
                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                        })
                    }
                    isActive={canvasState.mode === CanvasMode.Inserting}
                />
                <ToolButton
                    label="Pen"
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
