import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import Image from "next/image";

export function EmptyOrg() {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src="/elements.svg" alt="Empty" height={200} width={200} />
            <h2 className="text-2xl font-semibold mt-6">欢迎来到 Board</h2>
            <p className="text-muted-foreground text-sm mt-2">
                创建一个组织，开始行动
            </p>
            <div className="mt-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg">创建组织</Button>
                    </DialogTrigger>

                    <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                        {/* <DialogTitle>创建组织</DialogTitle>
                        <DialogDescription className="DialogDescription">
                            Make changes to your profile here. Click save when
                        </DialogDescription> */}
                        <CreateOrganization routing="hash" />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
