import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useNavigate } from "react-router-dom";

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch notifications
    const notificationsQuery = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/notifications");
            return data.data || [];
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    // Fetch unread count
    const unreadCountQuery = useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/notifications/unread-count");
            return data.unread_count || 0;
        },
        refetchInterval: 30000,
    });

    // Mark notification as read
    const markAsRead = useMutation({
        mutationFn: async (notificationId) => {
            const { data } = await axiosInstance.put(`/notifications/${notificationId}/read`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            queryClient.invalidateQueries(["notifications", "unread-count"]);
        },
    });

    // Mark all notifications as read
    const markAllAsRead = useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.put("/notifications/mark-all-read");
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            queryClient.invalidateQueries(["notifications", "unread-count"]);
        },
    });

    // Handle notification click - redirect to post
    const handleNotificationClick = (notification) => {
        if (notification.post_id) {
            // Mark as read
            if (!notification.is_read) {
                markAsRead.mutate(notification.notification_id);
            }
            // Navigate to the post (assuming posts are displayed on a feed page)
            // You may need to adjust the route based on your app structure
            navigate(`/feed?post=${notification.post_id}`);
            // Or if you have a specific post detail page:
            // navigate(`/post/${notification.post_id}`);
        }
    };

    return {
        notifications: notificationsQuery.data || [],
        isLoading: notificationsQuery.isLoading,
        unreadCount: unreadCountQuery.data || 0,
        markAsRead: markAsRead.mutate,
        markAllAsRead: markAllAsRead.mutate,
        handleNotificationClick,
        refetch: notificationsQuery.refetch,
    };
};

