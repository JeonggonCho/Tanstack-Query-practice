import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.py4e.com/api/species/";
const fetchUrl = async (url) => {
    const response = await fetch(url);
    return response.json();
};

export function InfiniteSpecies() {
    const { data, hasNextPage, isFetching, isError, error, isLoading, fetchNextPage } = useInfiniteQuery({
        queryKey: ["sw-species"],
        queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage.next || undefined;
        },
    });

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (isError) {
        return <div>Error : {error.toString()}</div>;
    }

    return (
        <>
            {isFetching && <div className="loading">Loading...</div>}
            <InfiniteScroll
                hasMore={hasNextPage}
                loadMore={() => {
                    if (!isFetching) fetchNextPage();
                }}
            >
                {data.pages.map((pageData) => {
                    return pageData.results.map((species) => {
                        return <Species name={species.name} language={species.language} averageLifespan={species.average_lifespan} />;
                    });
                })}
            </InfiniteScroll>
        </>
    );
}
