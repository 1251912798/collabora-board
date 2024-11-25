"use client";

import Info from "./Info";
import Toolbar from "./Toolbar";
import Participants from "./Participants";
import { useSelf } from "@liveblocks/react/suspense";

interface CanvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
    const info = useSelf((me) => me.info);
    console.log(info);

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar />
        </main>
    );
};

export default Canvas;
