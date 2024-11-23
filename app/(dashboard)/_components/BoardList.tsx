"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import EmptyBoards from "./EmptyBoards";
import EmptyFavourites from "./EmptyFavourites";
import EmptySearch from "./EmptySearch";
import BoardCard from "./boardCatd";
import NewBoardButton from "./NewBoardButton";

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favourites?: string;
    };
}

const BoardList = ({ orgId, query }: BoardListProps) => {
    // TODO: 多条件搜索
    const data = useQuery(api.boards.get, { orgId, ...query });

    if (data === undefined) {
        return (
            <div>
                <h2 className="text-3xl">
                    {query.favourites ? "收藏画板" : "团队画板"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    <NewBoardButton orgId={orgId} disabled />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                </div>
            </div>
        );
    }

    if (!data?.length && query.search) {
        return <EmptySearch />;
    }

    if (!data?.length && query.favourites) {
        return <EmptyFavourites />;
    }

    if (!data?.length) {
        return <EmptyBoards />;
    }
    return (
        <div>
            <h2 className="text-3xl mb-3">
                {query.favourites ? "收藏画板" : "团队画板"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <NewBoardButton orgId={orgId} />
                {data?.map((board) => (
                    <BoardCard
                        key={board._id}
                        id={board._id}
                        title={board.title}
                        imageUrl={board.imageUrl}
                        authorId={board.authorId}
                        authorName={board.authorName}
                        createdAt={board._creationTime}
                        orgId={board.orgId}
                        isFavourite={board.isFavourite}
                    />
                ))}
            </div>
        </div>
    );
};

export default BoardList;
