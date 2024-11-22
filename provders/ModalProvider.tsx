"use client";

import { useEffect, useState } from "react"; // 从 react 导入 useEffect 和 useState 钩子
import RenameModal from "@/components/modals/RenameModal"; // 导入 RenameModal 组件

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false); // 定义 isMounted 状态和 setIsMounted 函数，初始值为 false

    useEffect(() => {
        setIsMounted(true); // 在组件挂载时将 isMounted 设置为 true
    }, []); // 空依赖数组，确保只在组件挂载时执行一次

    if (!isMounted) {
        return null; // 如果组件未挂载，返回 null，不渲染任何内容
    }

    return <RenameModal />;
};

export default ModalProvider; // 导出 ModalProvider 组件
