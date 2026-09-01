import React, {
    createContext, useContext
} from 'react';
import usePosts from '@hooks/usePost';


const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const {
        postsQuery,
        createPost,
        createPostUpload,
        updatePost,
        deletePost
    } = usePosts();

    return (
        <PostContext.Provider
            value={{
                posts: postsQuery.data || [],
                isLoading: postsQuery.isLoading,
                createPost,
                createPostUpload,
                updatePost,
                deletePost,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => useContext(PostContext);
