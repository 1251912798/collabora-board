"use client";

import {
    shallow,
    useOthersConnectionIds,
    useOthersMapped,
} from "@liveblocks/react/suspense";
import { memo } from "react";
import Cursor from "./Cursor";
import Path from "./Path";
import { colorToCss } from "@/lib/utils";

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

// 渲染当前用户绘制的草稿
const Draft = () => {
    // 使用useOthersMapped钩子获取其他用户的映射信息，只关注铅笔草稿和颜色
    const others = useOthersMapped(
        (other) => ({
            pencilDraft: other.presence.pencilDraft,
            pencilColor: other.presence.pencilColor,
        }),
        shallow
    );

    // 渲染每个用户的绘图路径
    return (
        <>
            {others.map(([key, other]) => {
                if (other.pencilDraft) {
                    return (
                        <Path
                            key={key}
                            x={0}
                            y={0}
                            points={other.pencilDraft}
                            fill={
                                other.pencilColor
                                    ? colorToCss(other.pencilColor)
                                    : "#000"
                            }
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

const CursorsPresence = () => {
    return (
        <>
            <Draft />
            <Cursors />
        </>
    );
};

CursorsPresence.displayName = "CursorsPresence";

export default memo(CursorsPresence);
