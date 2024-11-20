"use client";

import EmptyBoards from "./EmptyBoards";
import EmptyFavourites from "./EmptyFavourites";
import EmptySearch from "./EmptySearch";

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favourites?: string;
    };
}

const BoardList = ({ orgId, query }: BoardListProps) => {
    const data = [];

    if (!data?.length && query.search) {
        return <EmptySearch />;
    }

    if (!data?.length && query.favourites) {
        return <EmptyFavourites />;
    }

    if (!data?.length) {
        return <EmptyBoards />;
    }
    return <div>BoardList</div>;
};

export default BoardList;
