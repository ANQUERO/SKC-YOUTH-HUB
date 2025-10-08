import React from "react";
import { usePostContext } from "@context/PostContext";
import { PostCard } from "./feedComponents/postCard";
import { CreateActivity } from "./feedComponents/CreateActivity";
import { useAuthContext } from "@context/AuthContext";
import style from "@styles/newsFeed.module.scss";

export const Activities = () => {
    const { posts, isLoading } = usePostContext();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const canManage = isSkSuperAdmin || isSkNaturalAdmin;
    const activities = posts.filter((p) => p.type === "activity");

    return (
        <section className={style.feed}>
            {canManage && <CreateActivity />}
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
