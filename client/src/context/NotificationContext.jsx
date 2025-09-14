import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuthContext } from '@context/AuthContext';

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};

export const NotificationProvider = ({ children }) => {
    const { authUser } = useAuthContext();
    const storageKey = authUser ? `notifications:${authUser.userType}:${authUser.id}` : null;
    const [notifications, setNotifications] = useState([]);
    const [seen, setSeen] = useState({ comments: {}, reactions: {} });
    const counterRef = useRef(1);

    // Load persisted notifications for this user
    useEffect(() => {
        if (!storageKey) {
            setNotifications([]);
            return;
        }
        try {
            const raw = localStorage.getItem(storageKey);
            setNotifications(raw ? JSON.parse(raw) : []);
        } catch {
            setNotifications([]);
        }
    }, [storageKey]);

    // Persist on changes
    useEffect(() => {
        if (!storageKey) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(notifications));
        } catch { }
    }, [notifications, storageKey]);

    // Persist seen ids per user
    const seenKey = storageKey ? `${storageKey}:seen` : null;
    useEffect(() => {
        if (!seenKey) return;
        try {
            const raw = localStorage.getItem(seenKey);
            setSeen(raw ? JSON.parse(raw) : { comments: {}, reactions: {} });
        } catch {
            setSeen({
                comments: {
                    use
                }, reactions: {}
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seenKey]);
    useEffect(() => {
        if (!seenKey) return;
        try {
            localStorage.setItem(seenKey, JSON.stringify(seen));
        } catch { }
    }, [seen, seenKey]);

    const pushNotification = (notif) => {
        const id = counterRef.current++;
        setNotifications((prev) => [
            {
                id,
                type: notif.type || 'info',
                title: notif.title || '',
                message: notif.message || '',
                createdAt: new Date().toISOString(),
                read: false,
                meta: notif.meta || {},
            },
            ...prev,
        ]);
        return id;
    };

    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const clear = () => setNotifications([]);
    const clearRead = () => setNotifications((prev) => prev.filter((n) => !n.read));

    const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
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
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};


