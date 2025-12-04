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

    const { data: formDetails, isLoading: isLoadingDetails } = useQuery({
        queryKey: ["inbox", selectedForm],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/inbox/${selectedForm}`);
            return data.data;
        },
        enabled: !!selectedForm,
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (selectedForm && formDetails) {
        return (
            <div className={style.inboxContainer}>
                <button
                    onClick={() => setSelectedForm(null)}
                    className={style.backButton}
                >
                    ← Back to Inbox
                </button>

                <Card className={style.formCard}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {formDetails.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {formDetails.description}
                        </Typography>
                        <Box display="flex" gap={2} mb={3}>
                            <Chip
                                icon={<User size={16} />}
                                label={`Created by: ${formDetails.official?.name}`}
                                size="small"
                            />
                            <Chip
                                icon={<Calendar size={16} />}
                                label={new Date(formDetails.created_at).toLocaleDateString()}
                                size="small"
                            />
                            <Chip
                                icon={<MessageSquare size={16} />}
                                label={`${formDetails.replies?.length || 0} Replies`}
                                size="small"
                                color="primary"
                            />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Feedback Replies
                        </Typography>

                        {formDetails.replies && formDetails.replies.length > 0 ? (
                            <div className={style.repliesList}>
                                {formDetails.replies.map((reply) => (
                                    <Card key={reply.replied_id} className={style.replyCard}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {reply.youth_name || `Youth #${reply.youth_id}`}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
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
                            <Typography variant="body2" color="text.secondary">
                                No replies yet.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={style.inboxContainer}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <InboxIcon size={24} />
                <Typography variant="h4">Inbox</Typography>
            </Box>

            {inboxData && inboxData.length > 0 ? (
                <TableContainer component={Paper}>
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
                                    <TableCell>{form.title}</TableCell>
                                    <TableCell>
                                        {form.description?.substring(0, 50)}
                                        {form.description?.length > 50 ? "..." : ""}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={form.reply_count || 0}
                                            size="small"
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(form.created_at).toLocaleDateString()}
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
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" align="center">
                            No feedback forms in inbox.
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Inbox;




