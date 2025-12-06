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
    const { isSkSuperAdmin, isSkNaturalAdmin, isSkYouth} = useAuthContext(); 
    const canManage = isSkSuperAdmin || isSkNaturalAdmin;
    const canView = canManage || isSkYouth; // ADD THIS LINE
    const feed = posts;

    console.log('NewsFeed Debug:', {
        isSkYouth,
        isSkSuperAdmin,
        isSkNaturalAdmin,
        canManage,
        canView, // Now this will work
        postsCount: feed.length,
        isLoading
    });

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
            ) : canView ? ( 
                feed.map((post) => (
                    <div key={post.post_id || post.id} id={`post-${post.post_id || post.id}`}>
                        <PostCard post={post} />
                    </div>
                ))
            ) : (
                <p>You don't have permission to view the feed.</p>
            )}
        </section>
    );
};