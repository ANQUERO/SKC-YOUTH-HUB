import React from "react";
import { usePostContext } from "@context/PostContext";
import { PostCard } from "./feedComponents/PostCard";
import { CreatePost } from "./feedComponents/CreatePost";
import style from "@styles/newsFeed.module.scss";

export const Activities = () => {
    const { posts, isLoading } = usePostContext();
    const activities = posts.filter((p) => p.type === "activity");

    return (
        <section className={style.feed}>
            <CreatePost />
            {isLoading ? (
                <p>Loading activities...</p>
            ) : activities.length === 0 ? (
                <p>No activities posted yet.</p>
            ) : (
                activities.map((post) => <PostCard key={post.post_id || post.id} post={post} />)
            )}
        </section>
    );
};
