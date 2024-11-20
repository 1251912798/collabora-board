import { Button } from "@/components/ui/button";
import Image from "next/image";

const EmptyBoards = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src="/note.svg" alt="Empty" height={110} width={110} />
            <h2 className="text-2xl font-semibold mt-6">创建你的第一个画板</h2>
            <p className="text-muted-foreground text-sm mt-2">
                在你的团队创建一个画板
            </p>
            <div className="mt-6">
                <Button size="lg">创建画板</Button>
            </div>
        </div>
    );
};

export default EmptyBoards;
