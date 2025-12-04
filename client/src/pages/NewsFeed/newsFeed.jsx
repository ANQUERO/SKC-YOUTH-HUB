import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import style from "@styles/newsFeed.module.scss";
import { usePostContext } from "@context/PostContext";
import { CreatePost } from "./feedComponents/createPost";
import { useAuthContext } from "@context/AuthContext";
import { PostCard } from "./feedComponents/postCard";

export const NewsFeed = () => {
    const [searchParams] = useSearchParams();
    const { posts, isLoading } = usePostContext();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const canManage = isSkSuperAdmin || isSkNaturalAdmin;
    const feed = posts;

    // Scroll to specific post when post query parameter is present
    useEffect(() => {
        const postId = searchParams.get('post');
        if (postId && !isLoading && feed.length > 0) {
            // Wait for posts to render, then scroll
            setTimeout(() => {
                const postElement = document.getElementById(`post-${postId}`);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight the post briefly
                    postElement.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
                    setTimeout(() => {
                        postElement.style.backgroundColor = '';
                    }, 2000);
                }
            }, 300);
        }
    }, [searchParams, isLoading, feed]);

    return (
        <section className={style.feed}>
            {canManage && <CreatePost />}
            {isLoading ? (
                <p>Loading posts...</p>
            ) : (
                feed.map((post) => (
                    <div key={post.post_id || post.id} id={`post-${post.post_id || post.id}`}>
                        <PostCard post={post} />
                    </div>
                ))
            )}
        </section>
    );
};
