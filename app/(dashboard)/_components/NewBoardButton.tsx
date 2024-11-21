"use client";

import { api } from "@/convex/_generated/api";
import useApiMutation from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewBoardButtonProps {
    orgId: string;
    disabled?: boolean;
}
const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
    const router = useRouter();
    const { mutate: create, isLoading } = useApiMutation(api.board.create);

    const handleClick = () => {
        create({ orgId, title: "未命名" })
            .then((id) => {
                toast.success("画板创建成功!");
                // router.push(`/board/${id}`);
            })
            .catch(() => toast.error("画板创建失败"));
    };
    return (
        <button
            disabled={disabled || isLoading}
            onClick={handleClick}
            className={cn(
                "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
                (disabled || isLoading) &&
                    "opacity-65 hover:bg-blue-600 cursor-not-allowed"
            )}>
            <div />
            <Plus className="h-12 w-12 text-white stroke-1" />
            <p className="text-sm text-white font-light">创建画板</p>
        </button>
    );
};

export default NewBoardButton;
