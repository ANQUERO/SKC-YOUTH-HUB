import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    const addPost = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    return (
        <PostContext.Provider value={{ posts, addPost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => useContext(PostContext);
