import React, {
    createContext, useContext
} from 'react';
import usePosts from '@hooks/usePost';


const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const {
        postsQuery,
        createPost,
        updatePost,
        deletePost
    } = usePosts();

    return (
        <PostContext.Provider
            value={{
                posts: postsQuery.data || [],
                isLoading: postsQuery.isLoading,
                createPost,
                updatePost,
                deletePost,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => useContext(PostContext);