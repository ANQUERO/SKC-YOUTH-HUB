import React from "react";
import style from "@styles/newsFeed.module.scss";
import { usePostContext } from "@context/PostContext";
import { CreatePost } from "./feedComponents/createPost";
import { useAuthContext } from "@context/AuthContext";
import { PostCard } from "./feedComponents/postCard";

export const NewsFeed = () => {
    const { posts, isLoading } = usePostContext();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const canManage = isSkSuperAdmin || isSkNaturalAdmin;
    const feed = posts; // show all posts; schema has no type column

    return (
        <section className={style.feed}>
            {canManage && <CreatePost />}
            {isLoading ? (
                <p>Loading posts...</p>
            ) : (
                feed.map((post) => <PostCard key={post.post_id || post.id} post={post} />)
            )}
        </section>
    );
};
