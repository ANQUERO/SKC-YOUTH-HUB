import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import { ThumbUp, Comment, Reply, History } from "@mui/icons-material";
import axiosInstance from "@lib/axios";
import styles from "@styles/youthSettings.module.scss";
import { useNavigate } from "react-router-dom";

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/profile/activity");
      setActivities(data.data.activities || []);
      setStats(data.data.stats || {});
    } catch (err) {
      console.error("Error fetching activity:", err);
      setError(
        err.response?.data?.message || "Failed to load activity history"
      );
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "reaction":
        return <ThumbUp />;
      case "comment":
        return <Comment />;
      case "reply":
        return <Reply />;
      default:
        return <History />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "reaction":
        return "primary";
      case "comment":
        return "success";
      case "reply":
        return "info";
      default:
        return "default";
    }
  };

  const getActivityLabel = (activity) => {
    if (activity.type === "reaction") {
      const emojiMap = {
        like: "👍",
        heart: "❤️",
        wow: "😮",
      };
      return `Reacted ${
        emojiMap[activity.reaction_type] || activity.reaction_type
      }`;
    } else if (activity.type === "reply") {
      return "Replied to a comment";
    } else {
      return "Commented on a post";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleActivityClick = (activity) => {
    if (activity.post_id) {
      let path = `/feed?post=${activity.post_id}`;
      if (activity.comment_id) {
        path += `#comment-${activity.comment_id}`;
      }
      navigate(path);
    }
  };

  if (loading) {
    return (
      <Card className={styles.activityCard}>
        <CardContent className={styles.cardContent}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.activityCard}>
        <CardContent className={styles.cardContent}>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.activityCard}>
      <CardContent className={styles.cardContent}>
        <Box
          component="div"
          variant="h6"
          gutterBottom
          className={styles.header}
        >
          <History className={styles.icon} /> Activity History
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.description}
        >
          View your reactions, comments, and replies on posts.
        </Typography>

        {stats && (
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Chip
              label={`${stats.total_reactions || 0} Reactions`}
              color="primary"
              icon={<ThumbUp />}
            />
            <Chip
              label={`${stats.total_comments || 0} Comments`}
              color="success"
              icon={<Comment />}
            />
            <Chip
              label={`${stats.total_replies || 0} Replies`}
              color="info"
              icon={<Reply />}
            />
          </Box>
        )}

        {activities.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No activity yet. Start engaging with posts!
            </Typography>
          </Box>
        ) : (
          <List>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem
                  button={true}
                  onClick={() => handleActivityClick(activity)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${getActivityColor(activity.type)}.main`,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="subtitle1" component="span">
                          {getActivityLabel(activity)}
                        </Typography>
                        <Chip
                          label={activity.type}
                          size="small"
                          color={getActivityColor(activity.type)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                          sx={{ mt: 0.5 }}
                        >
                          {activity.post_description
                            ? activity.post_description.length > 100
                              ? activity.post_description.substring(0, 100) +
                                "..."
                              : activity.post_description
                            : "Post"}
                        </Typography>
                        {activity.type === "comment" ||
                        activity.type === "reply" ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="div"
                            sx={{ mt: 0.5, fontStyle: "italic" }}
                          >
                            "
                            {activity.content.length > 50
                              ? activity.content.substring(0, 50) + "..."
                              : activity.content}
                            "
                          </Typography>
                        ) : null}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {formatDate(activity.created_at)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
