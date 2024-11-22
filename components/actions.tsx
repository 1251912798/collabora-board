import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import useApiMutation from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import ConfirmModal from "./ConfirmModal";
import useRenameModal from "@/store/useRenameModal";

interface ActionsProp {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
}

const Actions = ({ children, side, sideOffset, id, title }: ActionsProp) => {
    const { onOpen } = useRenameModal();
    const { isLoading, mutate } = useApiMutation(api.board.remove);

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}/boards/${id}`)
            .then(() => toast.success("复制链接成功!"))
            .catch(() => toast.error("复制链接失败"));
    };

    const handleDelete = () => {
        mutate({ id })
            .then(() => toast.success("画板删除成功"))
            .catch(() => toast.error("画板删除失败"));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                onClick={(e) => e.stopPropagation()}
                side={side}
                sideOffset={sideOffset}
                className="w-60">
                <DropdownMenuItem
                    className="p-3 cursor-pointer"
                    onClick={handleCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />
                    复制
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="p-3 cursor-pointer"
                    onClick={() => {
                        onOpen(id, title);
                    }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    重命名
                </DropdownMenuItem>
                <ConfirmModal
                    header="删除画板?"
                    description="确认删除将无法恢复"
                    disabled={isLoading}
                    onConfirm={handleDelete}>
                    <Button
                        className="p-3 cursor-pointer w-full justify-start font-normal"
                        variant="ghost">
                        <Trash2 className="h-4 w-4 mr-4" />
                        删除
                    </Button>
                </ConfirmModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Actions;
