"use client ";

import { connectionIdToColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
    connectionId: number;
}

const Cursor = ({ connectionId }: CursorProps) => {
    // 使用 useOther hook 获取其他用户的信息
    const info = useOther(connectionId, (user) => user?.info);
    // 使用 useOther hook 获取其他用户的光标位置
    const cursor = useOther(connectionId, (user) => user.presence.cursor);

    const name = info?.name || "队员";

    if (!cursor) {
        return null;
    }

    const { x, y } = cursor;
    return (
        <foreignObject
            style={{
                transform: `translate(${x}px, ${y}px)`, // 根据光标位置调整光标组件的位置
            }}
            height={50}
            width={name.length * 10 + 24}
            className="relative drop-shadow-md">
            <MousePointer2
                className="h-5 w-5"
                style={{
                    fill: connectionIdToColor(connectionId),
                    color: connectionIdToColor(connectionId),
                }}
            />
            <div
                className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold" // 设置用户名的样式类
                style={{
                    backgroundColor: connectionIdToColor(connectionId), // 根据连接ID转换的颜色设置背景颜色
                }}>
                {name}
            </div>
        </foreignObject>
    );
};

Cursor.displayName = "Cursor";

export default memo(Cursor);
