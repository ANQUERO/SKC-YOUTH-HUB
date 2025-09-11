import React from "react";
import { usePostContext } from "@context/PostContext";
import { PostCard } from "./feedComponents/postCard";
import { CreatePost } from "./feedComponents/createPost";
import { useAuthContext } from "@context/AuthContext";
import style from "@styles/newsFeed.module.scss";

export const Announcement = () => {
    const { posts, isLoading } = usePostContext();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const canManage = isSkSuperAdmin || isSkNaturalAdmin;
    const announcements = posts.filter((p) => p.type === "announcement");

    return (
        <section className={style.feed}>
            {canManage && <CreatePost />}
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
