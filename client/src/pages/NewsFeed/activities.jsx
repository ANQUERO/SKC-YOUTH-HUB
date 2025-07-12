import React from 'react';
import { usePostContext } from '@context/PostContext';
import { PostCard } from './feedComponents/postCard';
import { CreatePost } from './feedComponents/createPost';

import style from '@styles/newsFeed.module.scss';


export const Activities = () => {
    const { posts } = usePostContext();
    const activities = posts.filter(post => post.type === 'activity');

    return (
        <section className={style.feed}>
            <CreatePost />

            {activities.length === 0 ? (
                <p>No activities posted yet.</p>
            ) : (
                activities.map(post => <PostCard key={post.id} post={post} />)
            )}
        </section>
    );
};
