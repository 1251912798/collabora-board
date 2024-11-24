import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// 创建一个 Convex 客户端实例，使用公开的 Convex URL
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// 初始化 Liveblocks 客户端，使用环境变量中的密钥
const liveBlocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

/**
 * 处理创建 Liveblocks 会话的请求。
 * 此端点用于授权用户访问特定房间的 Liveblocks 环境。
 * @param {Request} request - HTTP 请求对象，预期在请求体中包含房间信息。
 * @returns {Response} 返回 HTTP 响应对象。
 */
export async function POST(request: Request) {
    console.log("未验证身份");
    // 验证用户身份
    const authorization = auth();
    const user = await currentUser();
    console.log("已验证身份");

    // 如果没有授权信息或用户不存在，则返回未授权状态
    if (!authorization || !user) {
        return new Response("Unauthorized", { status: 403 });
    }

    // 从请求中获取房间信息
    const { room } = await request.json();

    // 通过 Convex 查询获取房间对应的看板信息
    const board = await convex.query(api.board.get, { id: room });

    // 如果看板所属的组织ID与授权信息中的组织ID不符，则返回未授权状态
    if (board?.orgId !== authorization.orgId) {
        return new Response("Unauthorized", { status: 403 });
    }

    // 构建用户信息
    const userInfo = {
        name: user.firstName || "Teammate",
        picture: user.imageUrl,
    };

    // 准备 Liveblocks 会话
    const session = liveBlocks.prepareSession(user.id, { userInfo });

    // 如果房间存在，则允许该会话访问该房间，并授予完全权限
    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }

    // 执行会话授权并获取结果
    const { status, body } = await session.authorize();

    // 返回授权结果
    return new Response(body, { status });
}
