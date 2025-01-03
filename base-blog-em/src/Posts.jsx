import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);

    const queryClient = useQueryClient(); // prefetching을 위해 App에서 전달한 queryClient 객체 가져오기 -> 이 객체에 prefetchQuery 메서드가 존재함

    const deleteMutation = useMutation({
        mutationFn: (postId) => deletePost(postId),
    });

    const updateMutation = useMutation({
        mutationFn: (postId) => updatePost(postId),
    });

    // 페이지가 바뀔 때마다 prefetch 하기
    useEffect(() => {
        if (currentPage < maxPostPage) {
            const nextPage = currentPage + 1;
            queryClient.prefetchQuery({
                queryKey: ["posts", nextPage],
                queryFn: () => fetchPosts(nextPage),
            });
        }
    }, [currentPage, queryClient]);

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: () => fetchPosts(currentPage),
        staleTime: 2000,
    });

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    if (isError) {
        return (
            <>
                <h3>에러 발생</h3>
                <p>{error.toString()}</p>
            </>
        );
    }

    return (
        <>
            <ul>
                {data.map((post) => (
                    <li
                        key={post.id}
                        className="post-title"
                        onClick={() => {
                            deleteMutation.reset();
                            updateMutation.reset();
                            setSelectedPost(post);
                        }}
                    >
                        {post.title}
                    </li>
                ))}
            </ul>
            <div className="pages">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                        setCurrentPage((prev) => (prev -= 1));
                    }}
                >
                    Previous page
                </button>
                <span>Page {currentPage}</span>
                <button
                    disabled={currentPage >= maxPostPage}
                    onClick={() => {
                        setCurrentPage((prev) => (prev += 1));
                    }}
                >
                    Next page
                </button>
            </div>
            <hr />
            {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation} updateMutation={updateMutation} />}
        </>
    );
}
