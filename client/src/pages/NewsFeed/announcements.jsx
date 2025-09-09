import React from "react";
import { usePostContext } from "@context/PostContext";
import { PostCard } from "./feedComponents/PostCard";
import { CreatePost } from "./feedComponents/CreatePost";
import style from "@styles/newsFeed.module.scss";

export const Announcement = () => {
    const { posts, isLoading } = usePostContext();
    const announcements = posts.filter((p) => p.type === "announcement");

    return (
        <section className={style.feed}>
            <CreatePost />
            {isLoading ? (
                <p>Loading announcements...</p>
            ) : announcements.length === 0 ? (
                <p>No announcements yet.</p>
            ) : (
                announcements.map((post) => <PostCard key={post.post_id || post.id} post={post} />)
            )}
        </section>
    );
};
