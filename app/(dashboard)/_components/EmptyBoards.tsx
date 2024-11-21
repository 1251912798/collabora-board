import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import useApiMutation from "@/hooks/useApiMutation";

const EmptyBoards = () => {
    const { organization } = useOrganization();
    const { mutate, isLoading } = useApiMutation(api.board.create);

    const onClick = () => {
        if (!organization) return;

        mutate({
            orgId: organization.id,
            title: "未命名",
        })
            .then((id) => toast.success("画板创建成功", id))
            .catch(() => toast.error("画板创建失败"));
    };
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src="/note.svg" alt="Empty" height={110} width={110} />
            <h2 className="text-2xl font-semibold mt-6">创建你的第一个画板</h2>
            <p className="text-muted-foreground text-sm mt-2">
                在你的团队创建一个画板
            </p>
            <div className="mt-6" onClick={onClick}>
                <Button size="lg" disabled={isLoading}>
                    创建画板
                </Button>
            </div>
        </div>
    );
};

export default EmptyBoards;
