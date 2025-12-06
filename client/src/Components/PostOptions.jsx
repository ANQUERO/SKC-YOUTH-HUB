import React, { useState } from 'react';
import axiosInstance from '@lib/axios';
import { useAuthContext } from '@context/AuthContext';
import { useNotifications } from '@context/NotificationContext';
import '../styles/postOptions.module.scss';

const PostOptions = ({ post, onPostDeleted, onPostHidden }) => {
    const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const { pushNotification } = useNotifications();
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
    const isOwner = authUser && (
        (authUser.userType === 'youth' && authUser.youth_id === post.user_id) ||
        (authUser.userType === 'official' && authUser.official_id === post.user_id)
    );

    const canDelete = isOwner || isOfficial;
    const canHide = isOfficial && !isOwner;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.delete(`/post/${post.post_id}`);
            pushNotification({
                type: 'success',
                title: 'Post deleted',
                message: 'Post has been deleted successfully'
            });
            onPostDeleted && onPostDeleted();
        } catch (error) {
            console.error('Error deleting post:', error);
            pushNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Failed to delete post'
            });
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    const handleHide = async () => {
        const reason = prompt('Enter reason for hiding this post (optional):');
        if (reason === null) return; // User cancelled

        setLoading(true);
        try {
            await axiosInstance.put(`/post/${post.post_id}/hide`, { reason });
            pushNotification({
                type: 'success',
                title: 'Post hidden',
                message: 'Post has been hidden from public view'
            });
            onPostHidden && onPostHidden();
        } catch (error) {
            console.error('Error hiding post:', error);
            pushNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Failed to hide post'
            });
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    const handleUnhide = async () => {
        setLoading(true);
        try {
            await axiosInstance.put(`/post/${post.post_id}/unhide`);
            pushNotification({
                type: 'success',
                title: 'Post unhidden',
                message: 'Post has been made visible again'
            });
            onPostHidden && onPostHidden();
        } catch (error) {
            console.error('Error unhiding post:', error);
            pushNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Failed to unhide post'
            });
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    const handleBanUser = async () => {
        const userType = post.user_type || (post.official ? 'official' : 'youth');
        const userId = post.user_id || (post.official ? post.official.official_id : post.youth_id);
        const reason = prompt(`Enter reason for banning this ${userType} (optional):`);
        if (reason === null) return; // User cancelled

        setLoading(true);
        try {
            await axiosInstance.put(`/post/ban/${userType}/${userId}`, { reason });
            pushNotification({
                type: 'success',
                title: 'User banned',
                message: `${userType} has been banned from commenting`
            });
        } catch (error) {
            console.error('Error banning user:', error);
            pushNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Failed to ban user'
            });
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    if (!canDelete && !canHide) {
        return null;
    }

    return (
        <div className="post-options">
            <button
                className="options-trigger"
                onClick={() => setShowMenu(!showMenu)}
                disabled={loading}
            >
                {loading ? '⋯' : '⋯'}
            </button>

            {showMenu && (
                <>
                    <div
                        className="backdrop"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="options-menu">
                        {canDelete && (
                            <button
                                className="option-item delete"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                🗑️ Delete Post
                            </button>
                        )}

                        {canHide && (
                            <>
                                {post.is_hidden ? (
                                    <button
                                        className="option-item"
                                        onClick={handleUnhide}
                                        disabled={loading}
                                    >
                                        👁️ Unhide Post
                                    </button>
                                ) : (
                                    <button
                                        className="option-item"
                                        onClick={handleHide}
                                        disabled={loading}
                                    >
                                        🙈 Hide Post
                                    </button>
                                )}
                            </>
                        )}

                        {isOfficial && !isOwner && (
                            <button
                                className="option-item ban"
                                onClick={handleBanUser}
                                disabled={loading}
                            >
                                🚫 Ban User
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PostOptions;
