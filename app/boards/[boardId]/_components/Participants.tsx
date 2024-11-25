"use client";

import { useSelf, useOthers } from "@liveblocks/react/suspense";
import UserAvatar from "./UserAvatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_OTHER_USERS = 2;

const Participants = () => {
    const otherUsers = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = otherUsers.length > MAX_SHOWN_OTHER_USERS;
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {otherUsers
                    .slice(0, MAX_SHOWN_OTHER_USERS)
                    .map(({ connectionId, info }) => (
                        <UserAvatar
                            key={connectionId}
                            src={info?.picture}
                            name={info?.name}
                            fallback={info?.name?.[0] || "T"}
                            borderColor={connectionIdToColor(connectionId)}
                        />
                    ))}
                {currentUser && (
                    <UserAvatar
                        src={currentUser.info?.picture}
                        name={`${currentUser.info?.name} (You)`}
                        fallback={currentUser.info?.name?.[0]}
                        borderColor={connectionIdToColor(
                            currentUser.connectionId
                        )}
                    />
                )}
                {hasMoreUsers && (
                    <UserAvatar
                        name={`${otherUsers.length - MAX_SHOWN_OTHER_USERS} more`}
                        fallback={`+${otherUsers.length - MAX_SHOWN_OTHER_USERS}`}
                    />
                )}
            </div>
        </div>
    );
};

export default Participants;

export function ParticipantsSkeleton() {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
    );
}
