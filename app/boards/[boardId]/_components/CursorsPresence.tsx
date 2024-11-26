"use client";

import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { memo } from "react";
import Cursor from "./Cursor";

const Cursors = () => {
    const ids = useOthersConnectionIds();
    return (
        <>
            {ids.map((connectionId) => (
                <Cursor key={connectionId} connectionId={connectionId} />
            ))}
        </>
    );
};

const CursorsPresence = () => {
    return (
        <>
            <Cursors />
        </>
    );
};

CursorsPresence.displayName = "CursorsPresence";

export default memo(CursorsPresence);
