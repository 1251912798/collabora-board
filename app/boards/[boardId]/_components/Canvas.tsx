"use client";

import { useHistory, useCanRedo, useCanUndo } from "@liveblocks/react";
import Info from "./Info";
import Toolbar from "./Toolbar";
import Participants from "./Participants";
import { useState } from "react";
import { CanvasMode, CanvasState } from "@/types/canvas";

interface CanvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canRedo={!canUndo}
                canUndo={!canRedo}
                undo={history.undo}
                redo={history.redo}
                canvasState={canvasState}
                setCanvasState={setCanvasState}
            />
        </main>
    );
};

export default Canvas;
