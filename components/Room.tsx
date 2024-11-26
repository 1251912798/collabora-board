"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";

interface RoomProps {
    children: ReactNode;
    roomId: string;
    fallback: ReactNode | null;
}

const Room = ({ children, roomId, fallback }: RoomProps) => {
    return (
        <LiveblocksProvider throttle={16} authEndpoint={"/api/liveblocks-auth"}>
            <RoomProvider id={roomId}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
};

export default Room;
