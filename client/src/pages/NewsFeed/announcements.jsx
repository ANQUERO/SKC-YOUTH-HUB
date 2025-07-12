import React from 'react';
import { usePostContext } from '@context/PostContext';
import { PostCard } from './feedComponents/postCard';
import { CreatePost } from './feedComponents/createPost';
import style from '@styles/newsFeed.module.scss';


export const Announcement = () => {
    const { posts } = usePostContext();
    const announcements = posts.filter(post => post.type === 'announcement');

    return (
        <section className={style.feed}>
            <CreatePost />

            {announcements.length === 0 ? (
                <p>No announcements yet.</p>
            ) : (
                announcements.map(post => <PostCard key={post.id} post={post} />)
            )}
        </section>
    );
};
