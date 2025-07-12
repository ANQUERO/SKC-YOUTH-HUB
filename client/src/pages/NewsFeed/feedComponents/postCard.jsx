import React from 'react';
import style from '@styles/newsFeed.module.scss';

export const PostCard = ({ post }) => {
    return (
        <div className={style.card}>
            <div className={style.header}>
                <div className={style.author}>
                    <img src={post.avatar} alt="Author" className={style.avatar} />
                    <div>
                        <h4>{post.author}</h4>
                        <p>{post.role}</p>
                    </div>
                </div>
                <span className={style.time}>{post.time}</span>
            </div>

            <p className={style.typeTag}>{post.type.toUpperCase()}</p>
            <p className={style.content}>{post.content}</p>

            {post.image && <img src={post.image} alt="Post visual" className={style.postMedia} />}
            {post.video && <video src={post.video} controls className={style.postMedia} />}
        </div>
    );
};
