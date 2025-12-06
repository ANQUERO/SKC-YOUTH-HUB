import React, { useState } from "react";
import { useAuthContext } from "@context/AuthContext";
import useFeedback from "@hooks/useFeedback";
import { CreateFeedback } from "./feedComponents/CreateFeedback";
import style from "@styles/newsFeed.module.scss";

export const FeedBack = () => {
    const { isSkSuperAdmin, isSkNaturalAdmin, isSkYouth } = useAuthContext();
    const { feedbackForms, isLoading, canManage } = useFeedback();
    const [selectedForm, setSelectedForm] = useState(null);
    const [response, setResponse] = useState("");
    const canView = isSkYouth || isSkSuperAdmin || isSkNaturalAdmin || canManage;

    if (!canView) {
        return <div>You don't have permission to view feedback forms.</div>;
    }

    if (isLoading) {
        return <p>Loading feedback forms...</p>;
    }

    if (selectedForm) {
        return (
            <div className={style.feedbackContainer}>
                <button
                    onClick={() => {
                        setSelectedForm(null);
                        setResponse("");
                    }}
                    className={style.backButton}
                >
                    ← Back to Forms
                </button>

                <div className={style.feedbackForm}>
                    <h2>{selectedForm.title.charAt(0).toUpperCase() + selectedForm.title.slice(1)}</h2>
                    <p className={style.formDescription}>{selectedForm.description.charAt(0).toUpperCase() + selectedForm.description.slice(1)}</p>
                    <p className={style.formMeta}>
                        Created by {selectedForm.official_name} ({selectedForm.official_position})
                    </p>
                    <p className={style.formMeta}>
                        Created on {new Date(selectedForm.created_at).toLocaleDateString()}
                    </p>

                    {isSkYouth && (
                        <FeedbackReplyForm
                            formId={selectedForm.form_id}
                            response={response}
                            setResponse={setResponse}
                            onSuccess={() => {
                                setSelectedForm(null);
                                setResponse("");
                            }}
                        />
                    )}

                    {canManage && (
                        <div className={style.replyCount}>
                            <p>Total Replies: {selectedForm.reply_count || 0}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <section className={style.feedbackSection}>
            {canManage && <CreateFeedback />}

            <div className={style.feedbackList}>
                <h2>Feedback Forms</h2>
                {feedbackForms.length === 0 ? (
                    <p>No feedback forms available.</p>
                ) : (
                    feedbackForms.map((form) => (
                        <div
                            key={form.form_id}
                            className={style.feedbackCard}
                            onClick={() => setSelectedForm(form)}
                        >
                            <h3>{form.title.charAt(0).toUpperCase() + form.title.slice(1)}</h3>
                            <p className={style.formDescription}>{form.description.charAt(0).toUpperCase() + form.description.slice(1)}</p>
                            <div className={style.formMeta}>
                                <span>By {form.official_name}</span>
                                <span>{new Date(form.created_at).toLocaleDateString()}</span>
                                {canManage && <span>{form.reply_count || 0} replies</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

const FeedbackReplyForm = ({ formId, response, setResponse, onSuccess }) => {
    const { submitFeedbackReply, isSubmitting } = useFeedback();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!response.trim()) return;

        submitFeedbackReply(
            { formId, response },
            {
                onSuccess: () => {
                    onSuccess();
                }
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className={style.replyForm} id="Reply Form">
            <div className={style.formGroup}>
                <label htmlFor="response">Your Feedback</label>
                <textarea
                    id="response"
                    placeholder="Enter your feedback or answer to the questions above"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={6}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className={style.submitButton}
            >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
        </form>
    );
};
