"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
    disabled?: boolean;
    header: string;
    description?: string;
}

const ConfirmModal = ({
    children,
    onConfirm,
    disabled,
    header,
    description,
}: ConfirmModalProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{header}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>关闭</AlertDialogCancel>
                    <AlertDialogAction disabled={disabled} onClick={onConfirm}>
                        确认
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmModal;
