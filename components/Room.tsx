"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

interface RoomProps {
    children: ReactNode;
    roomId: string;
    fallback: ReactNode | null;
}

const Room = ({ children, roomId, fallback }: RoomProps) => {
    return (
        <LiveblocksProvider throttle={16} authEndpoint={"/api/liveblocks-auth"}>
            <RoomProvider
                id={roomId}
                initialPresence={{
                    cursor: null,
                    selection: [],
                    pencilDraft: null,
                    pencilColor: null,
                }}
                initialStorage={{
                    layers: new LiveMap<string, LiveObject<Layer>>(),
                    layerIds: new LiveList<string>([]),
                }}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
};

export default Room;
