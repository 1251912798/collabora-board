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
        <LiveblocksProvider
            publicApiKey={
                "pk_dev_r8d49h_wM7eeyP5xcjK_5-VVfb0AZWJoAR1X2GjyHHL2wnrFHikLEmggbxTEFwGs"
            }>
            <RoomProvider id={roomId}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
};

export default Room;
