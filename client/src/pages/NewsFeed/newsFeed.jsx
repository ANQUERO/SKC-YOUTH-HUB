import React from "react";
import style from "@styles/newsFeed.module.scss";
import { usePostContext } from "@context/PostContext";
import { CreatePost } from "./feedComponents/createPost";
import { PostCard } from "./feedComponents/postCard";

export const NewsFeed = () => {
    const { posts, isLoading } = usePostContext();
    const feed = posts.filter((p) => p.type === "post");

    return (
        <section className={style.feed}>
            <CreatePost />
            {isLoading ? (
                <p>Loading posts...</p>
            ) : (
                feed.map((post) => <PostCard key={post.post_id || post.id} post={post} />)
            )}
        </section>
    );
};
