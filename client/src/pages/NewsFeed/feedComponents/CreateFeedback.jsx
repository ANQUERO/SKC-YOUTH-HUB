import React, { useState } from "react";
import useFeedback from "@hooks/useFeedback";
import { AuthContextProvider } from "@context/AuthContext";
import style from "@styles/newsFeed.module.scss";

export const CreateFeedback = () => {
  const { createFeedbackForm, isCreating } = useFeedback();
  const { isSkSuperAdmin, isSkNaturalAdmin } = AuthContextProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const canManage = isSkSuperAdmin || isSkNaturalAdmin;

  if (!canManage) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    createFeedbackForm(formData, {
      onSuccess: () => {
        setFormData({ title: "", description: "" });
        setIsOpen(false);
      },
    });
  };

  if (!isOpen) {
    return (
      <div className={style.createPost}>
        <button
          onClick={() => setIsOpen(true)}
          className={style.createPostButton}
        >
          Create Feedback Form
        </button>
      </div>
    );
  }

  return (
    <div className={style.createPost}>
      <form onSubmit={handleSubmit} className={style.postForm}>
        <div className={style.formHeader}>
          <h3>Create Feedback Form</h3>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setFormData({ title: "", description: "" });
            }}
            className={style.closeButton}
          >
            ×
          </button>
        </div>

        <div className={style.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter feedback form title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter feedback form description or questions"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={5}
            required
          />
        </div>

        <div className={style.formActions}>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setFormData({ title: "", description: "" });
            }}
            className={style.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className={style.submitButton}
          >
            {isCreating ? "Creating..." : "Create Form"}
          </button>
        </div>
      </form>
    </div>
  );
};
