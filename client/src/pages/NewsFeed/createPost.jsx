import React, { useState } from 'react';
import style from '@styles/newsFeed.module.scss';
import Avatar from '@images/about.png';
import { Image, Paperclip, Send, Video } from 'lucide-react';

export const CreatePost = ({ onPost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setVideo(null); // Clear video if image is selected
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(URL.createObjectURL(file));
            setImage(null); // Clear image if video is selected
        }
    };

    const handlePost = () => {
        if (content.trim() === '') return;

        const newPost = {
            id: Date.now(),
            author: 'SK Chairman, Lester Q. Cruspero',
            role: 'Official',
            avatar: Avatar,
            time: new Date().toLocaleString(),
            content,
            image,
            video,
        };

        onPost(newPost);
        setContent('');
        setImage(null);
        setVideo(null);
    };

    return (
        <div className={style.createPost}>
            <div className={style.userInfo}>
                <img src={Avatar} alt="avatar" />
                <div>
                    <strong>SK Chairman, Lester Q. Cruspero</strong>
                    <p>Official</p>
                </div>
            </div>

            <textarea
                placeholder="What's your announcement...."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className={style.actions}>
                <div className={style.files}>
                    <label>
                        <Image />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <label>
                        <Video />
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <button onClick={handlePost}>
                    <Send />
                </button>
            </div>
        </div>
    );
};