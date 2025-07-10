import React, { useState } from 'react';
import style from '@styles/newsFeed.module.scss';
import Avatar from '@images/about.png';
import { Image, Paperclip, Send } from 'lucide-react';

export const CreatePost = ({ onPost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handlePost = () => {
        if (content.trim() === '') return;

        const newPost = {
            id: Date.now(),
            author: 'SK Councilor, Lester Q. Cuasqueria',
            role: 'Official',
            avatar: Avatar,
            time: new Date().toLocaleString(),
            content,
            image,
        };

        onPost(newPost);
        setContent('');
        setImage(null);
    };

    return (
        <div className={style.createPost}>
            <div className={style.userInfo}>
                <img src={Avatar} alt="avatar" />
                <div>
                    <strong>SK Councilor, Lester Q. Cuasqueria</strong>
                    <p>Official</p>
                </div>
            </div>

            <textarea
                placeholder="What's your announcement...."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className={style.actions}>
                <label>
                    <Paperclip />
                    <input type="file" style={{ display: 'none' }} />
                </label>
                <label>
                    <Image />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                        style={{ display: 'none' }}
                    />
                </label>

                <button onClick={handlePost}>
                    <Send />
                </button>
            </div>
        </div>
    );
};
