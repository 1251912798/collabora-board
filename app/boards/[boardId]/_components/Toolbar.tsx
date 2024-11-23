import React from "react";

const Toolbar = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <div className="">铅笔</div>
                <div className="">正方形</div>
                <div className="">圆形</div>
                <div className="">更多</div>
            </div>
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <div className="">撤销</div>
                <div className="">重置</div>
            </div>
        </div>
    );
};

export default Toolbar;

export function ToolbarSkeleton() {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
    );
}
