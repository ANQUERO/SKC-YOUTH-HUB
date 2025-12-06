import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Box,
    Chip
} from "@mui/material";
import { Inbox as InboxIcon, MessageSquare, Calendar, User } from "lucide-react";
import style from "@styles/inbox.module.scss";

const Inbox = () => {
    const [selectedForm, setSelectedForm] = useState(null);

    const { data: inboxData, isLoading } = useQuery({
        queryKey: ["inbox"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/inbox");
            return data.data || [];
        },
    });

    const { data: formDetails } = useQuery({
        queryKey: ["inbox", selectedForm],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/inbox/${selectedForm}`);
            return data.data;
        },
        enabled: !!selectedForm,
    });

    if (isLoading) {
        return (
           <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" className={style.loadingContainer}>
  <CircularProgress className={style.loadingSpinner} />
</Box>

        );
    }

    if (selectedForm && formDetails) {
        return (
            <div className={style.inboxContainer}>
                <div className={style.headerSection}>
    <button
      onClick={() => setSelectedForm(null)}
      className={style.backButton}
    >
      ← Back to Inbox
    </button>
  </div>

               <Card className={style.formCard}>
    <CardContent className={style.cardContent}>
      <Typography variant="h4" gutterBottom className={style.formTitle}>
        {formDetails.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph className={style.formDescription}>
        {formDetails.description}
      </Typography>
      <Box className={style.formMetadata}>
        <Chip
          icon={<User size={16} />}
          label={`Created by: ${formDetails.official?.name}`}
          size="small"
          className={style.metadataChip}
        />
        <Chip
          icon={<Calendar size={16} />}
          label={new Date(formDetails.created_at).toLocaleDateString()}
          size="small"
          className={style.metadataChip}
        />
        <Chip
          icon={<MessageSquare size={16} />}
          label={`${formDetails.replies?.length || 0} Replies`}
          size="small"
          color="primary"
          className={`${style.metadataChip} ${style.chipPrimary}`}
        />
      </Box>

      <div className={style.repliesSection}>
        <Typography variant="h6" gutterBottom className={style.repliesTitle}>
          Feedback Replies
        </Typography>

        {formDetails.replies && formDetails.replies.length > 0 ? (
          <div className={style.repliesList}>
            {formDetails.replies.map((reply) => (
              <Card key={reply.replied_id} className={style.replyCard}>
                <CardContent className={style.cardContent}>
                  <Box className={style.replyHeader}>
                    <Typography variant="subtitle2" fontWeight="bold" className={style.youthName}>
                      {reply.youth_name || `Youth #${reply.youth_id}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className={style.youthEmail}>
                      {reply.youth_email}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className={style.replyText}>
                    {reply.response}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={style.noReplies}>
            <Typography variant="body2" color="text.secondary" className={style.noRepliesText}>
              No replies yet.
            </Typography>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
            </div>
        );
    }

    return (
        <div className={style.inboxContainer}>
          <div className={style.headerSection}>
    <div className={style.headerContent}>
      <InboxIcon size={24} className={style.inboxIcon} />
      <Typography variant="h4" className={style.headerTitle}>Inbox</Typography>
    </div>
  </div>
             {inboxData && inboxData.length > 0 ? (
    <TableContainer component={Paper} className={style.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Replies</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inboxData.map((form) => (
            <TableRow
              key={form.form_id}
              hover
              onClick={() => setSelectedForm(form.form_id)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>
                <span className={style.titleCell}>{form.title}</span>
              </TableCell>
              <TableCell>
                <span className={style.descriptionCell}>
                  {form.description?.substring(0, 50)}
                  {form.description?.length > 50 ? "..." : ""}
                </span>
              </TableCell>
              <TableCell>
                <span className={style.replyCount}>
                  {form.reply_count || 0}
                </span>
              </TableCell>
              <TableCell>
                <span className={style.dateCell}>
                  {new Date(form.created_at).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <button
                  className={style.viewButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedForm(form.form_id);
                  }}
                >
                  View Replies
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div className={style.emptyState}>
      <Typography variant="body1" color="text.secondary" className={style.emptyStateText}>
        No feedback forms in inbox.
      </Typography>
    </div>
  )}
        </div>
    );
};

export default Inbox;




