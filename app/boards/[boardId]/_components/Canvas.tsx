"use client";

import {
    useHistory,
    useCanRedo,
    useCanUndo,
    useMutation,
} from "@liveblocks/react";
import Info from "./Info";
import Toolbar from "./Toolbar";
import Participants from "./Participants";
import { use, useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import CursorsPresence from "./CursorsPresence";
import {} from "convex/react";
import { pointerEventToCanvasPoint } from "@/lib/utils";

interface CanvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    // 处理滚轮事件的回调函数，用于调整相机位置
    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    // 处理指针移动事件
    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault();

            const current = pointerEventToCanvasPoint(e, camera);
            setMyPresence({ cursor: current });
        },
        []
    );

    // 当指针离开画布时调用的处理函数，用于更新用户的存在状态
    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

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
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}>
                <g>
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    );
};

export default Canvas;
