import useContent from "@hooks/useContent";
import React, { useEffect, useState } from "react";
import styles from '@styles/content.module.scss';

const LandingPageContent = () => {
  const { 
    loading, 
    success, 
    error, 
    fetchContents, 
    createContent, 
    updateContent, 
    deleteContent, 
    clearMessages,
    isAuthorized 
  } = useContent();

  const [contents, setContents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    official_name: "",
    official_title: "",
    media_url: "",
    media_file: null
  });

  // Fetch all contents on component mount
  useEffect(() => {
    loadContents();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const loadContents = async () => {
    try {
      const data = await fetchContents();
      setContents(data || []);
    } catch (error) {
      console.error("Failed to load contents:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      media_file: file,
      media_url: file ? URL.createObjectURL(file) : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingContent) {
        await updateContent(editingContent.content_id, formData);
      } else {
        await createContent(formData);
      }
      
      // Reset form and reload contents
      resetForm();
      await loadContents();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      official_name: content.official_name,
      official_title: content.official_title,
      media_url: content.media_url,
      media_file: null
    });
    setShowForm(true);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteContent(contentId);
        await loadContents();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      official_name: "",
      official_title: "",
      media_url: "",
      media_file: null
    });
    setEditingContent(null);
    setShowForm(false);
    clearMessages();
  };

  if (!isAuthorized) {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.unauthorizedCard}>
          <h2 className={styles.unauthorizedTitle}>Access Denied</h2>
          <p className={styles.unauthorizedMessage}>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Landing Page Officials</h1>
          <p className={styles.subtitle}>Manage official content for your landing page</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className={styles.successMessage}>
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {/* Add Content Button */}
        <div className={styles.buttonContainer}>
          <button
            onClick={() => setShowForm(!showForm)}
            className={styles.addButton}
          >
            <span className={styles.buttonIcon}>+</span>
            {showForm ? "Cancel" : "Add New Official"}
          </button>
        </div>

        {/* Content Form */}
        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {editingContent ? "Edit Official" : "Add New Official"}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Official Name *
                  </label>
                  <input
                    type="text"
                    name="official_name"
                    value={formData.official_name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Enter official name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Official Title *
                  </label>
                  <input
                    type="text"
                    name="official_title"
                    value={formData.official_title}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Enter official title"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Media URL *
                </label>
                <input
                  type="url"
                  name="media_url"
                  value={formData.media_url}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Enter image URL"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Or Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </div>

              {/* Image Preview */}
              {formData.media_url && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Image Preview
                  </label>
                  <div className={styles.imagePreview}>
                    <img
                      src={formData.media_url}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitButton}
                >
                  {loading ? "Processing..." : editingContent ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contents List */}
        <div className={styles.contentCard}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Current Officials</h2>
          </div>

          {loading && !contents.length ? (
            <div className={styles.loadingState}>
              <p className={styles.loadingText}>Loading contents...</p>
            </div>
          ) : contents.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No officials added yet. Click "Add New Official" to get started.</p>
            </div>
          ) : (
            <div className={styles.contentList}>
              {contents.map((content) => (
                <div key={content.content_id} className={styles.contentItem}>
                  <div className={styles.contentInfo}>
                    <img
                      src={content.media_url}
                      alt={content.official_name}
                      className={styles.contentImage}
                    />
                    <div className={styles.contentDetails}>
                      <h3 className={styles.officialName}>
                        {content.official_name}
                      </h3>
                      <p className={styles.officialTitle}>{content.official_title}</p>
                      <p className={styles.contentDate}>
                        Added: {new Date(content.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className={styles.contentActions}>
                    <button
                      onClick={() => handleEdit(content)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(content.content_id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;