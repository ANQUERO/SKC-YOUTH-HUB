import React, { useState } from 'react';
import style from '@styles/newsFeed.module.scss';

import { CreatePost } from './createPost';
import { PostCard } from './postCard';

export const NewsFeed = () => {
    const [posts, setPosts] = useState([]);

    const addPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <section className={style.feed}>
            <CreatePost onPost={addPost} />
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </section>
    );
};
