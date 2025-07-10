import React from 'react';
import style from '@styles/newsFeed.module.scss';

export const PostCard = ({ post }) => {
    return (
        <div className={style.card}>
            <div className={style.header}>
                <img src={post.avatar} alt="Author" className={style.avatar} />
                <div>
                    <h4>{post.author}</h4>
                    <p>{post.role}</p>
                </div>
                <span className={style.time}>{post.time}</span>
            </div>

            <p className={style.content}>{post.content}</p>

            {post.image && (
                <img src={post.image} alt="Post visual" className={style.postImage} />
            )}

            <button className={style.cta}>Click</button>
        </div>
    );
};
