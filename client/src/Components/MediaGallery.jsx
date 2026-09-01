import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import style from "@styles/newsFeed.module.scss";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Play,
  Image as ImageIcon,
} from "lucide-react";

export const MediaGallery = ({ mediaItems = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const closeFullscreen = (e) => {
    e?.stopPropagation();
    setIsFullscreen(false);
  };

  const currentMedia = mediaItems[currentIndex];
  const currentMediaUrl = currentMedia?.url || currentMedia;
  const isVideo =
    currentMedia?.type === "video" ||
    currentMedia?.url?.match(/\.(mp4|webm|mov|m4v|avi|mkv)$/i) ||
    currentMedia?.mimetype?.includes("video");

  // Keyboard navigation for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "ArrowLeft":
          setCurrentIndex((prev) =>
            prev === 0 ? mediaItems.length - 1 : prev - 1,
          );
          break;
        case "ArrowRight":
          setCurrentIndex((prev) =>
            prev === mediaItems.length - 1 ? 0 : prev + 1,
          );
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, mediaItems.length]);

  useEffect(() => {
    if (!isFullscreen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  if (!mediaItems || mediaItems.length === 0) return null;

  const fullscreenViewer = isFullscreen
    ? createPortal(
        <div
          className={style.fullscreenModal}
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label="Post media viewer"
        >
          <button
            className={style.closeFullscreen}
            onClick={closeFullscreen}
            aria-label="Close fullscreen"
          >
            <X size={30} />
          </button>

          <div
            className={style.fullscreenContent}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video
                src={currentMediaUrl}
                className={style.fullscreenVideo}
                controls
              />
            ) : (
              <img
                src={currentMediaUrl}
                alt="Fullscreen post media"
                className={style.fullscreenImage}
              />
            )}

            {mediaItems.length > 1 && (
              <>
                <button
                  className={style.fullscreenNav}
                  onClick={handlePrevious}
                  style={{ left: "20px" }}
                  aria-label="Previous media"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  className={style.fullscreenNav}
                  onClick={handleNext}
                  style={{ right: "20px" }}
                  aria-label="Next media"
                >
                  <ChevronRight size={40} />
                </button>

                <div className={style.fullscreenIndicators}>
                  {mediaItems.map((_, index) => (
                    <button
                      key={index}
                      className={`${style.fullscreenDot} ${index === currentIndex ? style.active : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>

                <div className={style.fullscreenCounter}>
                  {currentIndex + 1} / {mediaItems.length}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  // Single media item
  if (mediaItems.length === 1) {
    return (
      <>
        <div className={style.mediaSingle}>
          {isVideo ? (
            <video
              src={currentMediaUrl}
              controls
              className={style.mediaSingleItem}
            />
          ) : (
            <img
              src={currentMediaUrl}
              alt="Post media"
              className={style.mediaSingleItem}
              onClick={toggleFullscreen}
              loading="lazy"
            />
          )}
          <button
            className={style.fullscreenBtn}
            onClick={toggleFullscreen}
            aria-label={`Enlarge ${isVideo ? "video" : "image"}`}
            title="Enlarge media"
          >
            <Maximize2 size={20} />
          </button>
        </div>
        {fullscreenViewer}
      </>
    );
  }

  // Multiple media items
  return (
    <>
      <div className={style.mediaGallery}>
        {isVideo ? (
          <video
            src={currentMediaUrl}
            controls
            className={style.galleryCurrent}
          />
        ) : (
          <img
            src={currentMediaUrl}
            alt={`Gallery ${currentIndex + 1}`}
            className={style.galleryCurrent}
            onClick={toggleFullscreen}
            loading="lazy"
          />
        )}

        {/* Media type indicator */}
        <div className={style.mediaTypeIndicator}>
          {isVideo ? <Play size={16} /> : <ImageIcon size={16} />}
        </div>

        {/* Navigation arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              className={style.galleryNav}
              onClick={handlePrevious}
              style={{ left: "10px" }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={style.galleryNav}
              onClick={handleNext}
              style={{ right: "10px" }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Gallery indicators */}
        <div className={style.galleryIndicators}>
          {mediaItems.map((_, index) => (
            <button
              key={index}
              className={`${style.galleryDot} ${index === currentIndex ? style.active : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>

        <button
          className={style.galleryFullscreen}
          onClick={toggleFullscreen}
          aria-label={`Enlarge ${isVideo ? "video" : "image"}`}
          title="Enlarge media"
        >
          <Maximize2 size={20} />
        </button>

        {/* Counter */}
        <div className={style.galleryCounter}>
          {currentIndex + 1} / {mediaItems.length}
        </div>
      </div>
      {fullscreenViewer}
    </>
  );
};
