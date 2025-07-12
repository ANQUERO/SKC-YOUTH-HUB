import React, { useState } from 'react';
import style from '@styles/newsFeed.module.scss';
import { usePostContext } from '@context/PostContext';
import { CreatePost } from './feedComponents/createPost';
import { PostCard } from './feedComponents/postCard';

export const NewsFeed = () => {
    const { posts } = usePostContext();
    const post = posts.filter(post => post.type === 'post')

    return (
        <section className={style.feed}>
            <CreatePost />
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </section>
    );
};
