import React from "react";

const Toolbar = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <div className="">Pencil</div>
                <div className="">Square</div>
                <div className="">Circle</div>
                <div className="">Ellipsis</div>
            </div>
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <div className="">Reset</div>
                <div className="">Undo</div>
                <div className="">Redo</div>
            </div>
        </div>
    );
};

export default Toolbar;
