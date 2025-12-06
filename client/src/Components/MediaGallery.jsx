import React, { useState, useEffect } from "react";
import style from "@styles/newsFeed.module.scss";
import { ChevronLeft, ChevronRight, X, Maximize2, Play, Image as ImageIcon } from "lucide-react";

export const MediaGallery = ({ mediaItems = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!mediaItems || mediaItems.length === 0) return null;

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
  const isVideo = currentMedia?.type === 'video' || 
                  currentMedia?.url?.match(/\.(mp4|webm|mov|m4v|avi|mkv)$/i) ||
                  currentMedia?.mimetype?.includes('video');

  // Keyboard navigation for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          closeFullscreen();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex, mediaItems.length]);

  // Single media item
  if (mediaItems.length === 1) {
    return (
      <div className={style.mediaSingle}>
        {isVideo ? (
          <video 
            src={currentMedia.url || currentMedia} 
            controls 
            className={style.mediaSingleItem}
          />
        ) : (
          <img 
            src={currentMedia.url || currentMedia} 
            alt="Post media" 
            className={style.mediaSingleItem}
            onClick={toggleFullscreen}
            loading="lazy"
          />
        )}
        {!isVideo && (
          <button 
            className={style.fullscreenBtn}
            onClick={toggleFullscreen}
          >
            <Maximize2 size={20} />
          </button>
        )}
      </div>
    );
  }

  // Multiple media items
  return (
    <>
      <div className={style.mediaGallery}>
        {isVideo ? (
          <video 
            src={currentMedia.url || currentMedia} 
            controls 
            className={style.galleryCurrent}
          />
        ) : (
          <img 
            src={currentMedia.url || currentMedia} 
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
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Fullscreen button (only for images) */}
        {!isVideo && (
          <button 
            className={style.galleryFullscreen}
            onClick={toggleFullscreen}
          >
            <Maximize2 size={20} />
          </button>
        )}

        {/* Counter */}
        <div className={style.galleryCounter}>
          {currentIndex + 1} / {mediaItems.length}
        </div>
      </div>

      {/* Fullscreen modal (only for images) */}
      {isFullscreen && !isVideo && (
        <div className={style.fullscreenModal} onClick={closeFullscreen}>
          <button 
            className={style.closeFullscreen} 
            onClick={closeFullscreen}
            aria-label="Close fullscreen"
          >
            <X size={30} />
          </button>
          
          <div className={style.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <img 
              src={currentMedia.url || currentMedia} 
              alt="Fullscreen view"
              className={style.fullscreenImage}
            />

            {mediaItems.length > 1 && (
              <>
                <button 
                  className={style.fullscreenNav} 
                  onClick={handlePrevious}
                  style={{ left: "20px" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={40} />
                </button>
                <button 
                  className={style.fullscreenNav} 
                  onClick={handleNext}
                  style={{ right: "20px" }}
                  aria-label="Next image"
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
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                <div className={style.fullscreenCounter}>
                  {currentIndex + 1} / {mediaItems.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};