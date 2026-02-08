import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext"; // CHANGE THIS LINE

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const { authUser } = useAuthContext(); // CHANGE THIS LINE - use the hook instead
  const queryClient = useQueryClient();
  const storageKey = authUser
    ? `notifications:${authUser.userType}:${authUser.id}`
    : null;
  const [localNotifications, setLocalNotifications] = useState([]);
  const [seen, setSeen] = useState({ comments: {}, reactions: {} });
  const counterRef = useRef(1);

  // Fetch notifications from API - real-time with 5 second polling
  const { data: apiNotifications = [], refetch: refetchNotifications } =
    useQuery({
      queryKey: ["notifications"],
      queryFn: async () => {
        if (!authUser) return [];
        const { data } = await axiosInstance.get("/notifications");
        return data.data || [];
      },
      enabled: !!authUser,
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
      refetchIntervalInBackground: true, // Continue polling even when tab is in background
    });

  // Fetch unread count - real-time with 5 second polling
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      if (!authUser) return 0;
      const { data } = await axiosInstance.get("/notifications/unread-count");
      return data.unread_count || 0;
    },
    enabled: !!authUser,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    refetchIntervalInBackground: true, // Continue polling even when tab is in background
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications", "unread-count"]);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.put("/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications", "unread-count"]);
    },
  });

  // Load persisted local notifications for this user (for backward compatibility)
  useEffect(() => {
    if (!storageKey) {
      setLocalNotifications([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      setLocalNotifications(raw ? JSON.parse(raw) : []);
    } catch {
      setLocalNotifications([]);
    }
  }, [storageKey]);

  // Persist local notifications on changes
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(localNotifications));
    } catch {
      console.error("Error");
    }
  }, [localNotifications, storageKey]);

  // Persist seen ids per user
  const seenKey = storageKey ? `${storageKey}:seen` : null;
  useEffect(() => {
    if (!seenKey) return;
    try {
      const raw = localStorage.getItem(seenKey);
      setSeen(raw ? JSON.parse(raw) : { comments: {}, reactions: {} });
    } catch {
      setSeen({
        comments: {},
        reactions: {},
      });
    }
  }, [seenKey]);
  useEffect(() => {
    if (!seenKey) return;
    try {
      localStorage.setItem(seenKey, JSON.stringify(seen));
    } catch {
      console.error("Error");
    }
  }, [seen, seenKey]);

  // Combine API notifications with local notifications
  const notifications = useMemo(() => {
    // Transform API notifications to match local format
    const transformedApiNotifications = apiNotifications.map((n) => {
      const notificationType = n.notification_type;
      let title = "";
      let message = "";

      if (notificationType === "reaction") {
        title = "New Reaction";
        message = `${n.actor_name || "Someone"} reacted to a post`;
      } else if (notificationType === "comment") {
        title = "New Comment";
        message = `${n.actor_name || "Someone"} commented on a post`;
      } else if (notificationType === "post") {
        title = "New Post";
        message = `${n.actor_name || "Someone"} created a new post`;
      } else {
        title = "New Notification";
        message = "You have a new notification";
      }

      return {
        id: n.notification_id,
        type: notificationType,
        title,
        message,
        createdAt: n.created_at || n.createdAt,
        read: n.is_read || n.read,
        meta: {
          post_id: n.post_id,
          comment_id: n.comment_id,
          actor_name: n.actor_name,
          actor_type: n.actor_type,
        },
        // Store original API data for redirect
        _apiData: n,
      };
    });

    return [...transformedApiNotifications, ...localNotifications];
  }, [apiNotifications, localNotifications]);

  // Push local notification (for backward compatibility, but won't show in main notification list)
  const pushNotification = (notif) => {
    const id = counterRef.current++;
    setLocalNotifications((prev) => [
      {
        id,
        type: notif.type || "info",
        title: notif.title || "",
        message: notif.message || "",
        createdAt: new Date().toISOString(),
        read: false,
        meta: notif.meta || {},
      },
      ...prev,
    ]);
    return id;
  };

  const markAllRead = () => {
    markAllAsReadMutation.mutate();
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    // Check if it's an API notification
    const apiNotif = apiNotifications.find((n) => n.notification_id === id);
    if (apiNotif) {
      markAsReadMutation.mutate(id);
    } else {
      // Local notification
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    }
  };

  const clear = () => {
    setLocalNotifications([]);
  };

  const clearRead = () => {
    setLocalNotifications((prev) => prev.filter((n) => !n.read));
  };
  const hasSeen = (category, id) => Boolean(seen?.[category]?.[id]);
  const markItemSeen = (category, id) => {
    setSeen((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), [id]: true },
    }));
  };

  const value = {
    notifications,
    unreadCount,
    pushNotification,
    markRead,
    markAllRead,
    clearRead,
    clear,
    hasSeen,
    markItemSeen,
    refetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
