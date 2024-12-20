"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import useApiMutation from "@/hooks/useApiMutation";
import useRenameModal from "@/store/useRenameModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RenameModal = () => {
    const { mutate: update, isLoading } = useApiMutation(api.board.update);

    const { isOpen, onClose, initialValues } = useRenameModal();

    const [title, setTitle] = useState(initialValues.title);

    useEffect(() => {
        setTitle(initialValues.title);
    }, [initialValues.title]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        update({
            id: initialValues.id,
            title,
        })
            .then(() => {
                toast.success("Board renamed");
                onClose();
            })
            .catch(() => {
                toast.error("Failed to rename board");
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>修改画板标题</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    为这个画板输入一个新的标题
                </DialogDescription>

                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        required
                        maxLength={60}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Board title"
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                取消
                            </Button>
                        </DialogClose>

                        <Button
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            type="submit">
                            保存
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RenameModal;
