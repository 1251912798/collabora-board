import { create } from "zustand"; // 从 zustand 导入 create 函数

// 定义默认值
const defaultValues = { id: "", title: "" };

// 定义接口 IRenameModal
interface IRenameModal {
    isOpen: boolean; // 模态框是否打开
    initialValues: typeof defaultValues; // 初始值
    onOpen: (id: string, title: string) => void; // 打开模态框的函数
    onClose: () => void; // 关闭模态框的函数
}

// 使用 Zustand 创建状态管理
const useRenameModal = create<IRenameModal>((set) => ({
    isOpen: false, // 初始状态下模态框关闭
    initialValues: defaultValues, // 设置初始值
    onOpen: (id: string, title: string) =>
        set({
            isOpen: true, // 打开模态框
            initialValues: { id, title }, // 设置初始值
        }),
    onClose: () =>
        set({
            isOpen: false,
            initialValues: defaultValues,
        }), // 关闭模态框
}));

export default useRenameModal;
