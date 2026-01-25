import Quill from "quill";

class VideoResize {
  quill: Quill;
  options: any;
  currentVideo: HTMLElement | null;
  overlay: HTMLElement | null;

  constructor(quill: Quill, options: any) {
    this.quill = quill;
    this.options = options;
    this.currentVideo = null;
    this.overlay = null;

    this.quill.root.addEventListener("click", this.handleClick.bind(this));
    this.quill.root.addEventListener("scroll", this.handleScroll.bind(this));
    document.addEventListener("keydown", this.handleKeydown.bind(this));

    // Add CSS for video styling
    const style = document.createElement("style");
    style.textContent = `
      .ql-video {
        display: block;
        max-width: 100%;
      }
      .video-resize-overlay {
        pointer-events: auto;
      }
      .video-delete-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background-color: #ff4444;
        color: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      .video-delete-button:hover {
        background-color: #cc0000;
      }
    `;
    document.head.appendChild(style);
  }

  handleClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;

    // Check if clicked on iframe (video) or its wrapper
    const iframe = target.tagName === "IFRAME"
      ? target
      : target.querySelector("iframe");

    if (iframe && !this.quill.options.readOnly) {
      if (this.currentVideo === iframe) return;
      if (this.currentVideo) this.hide();
      this.show(iframe as HTMLElement);
    } else if (this.currentVideo) {
      this.hide();
    }
  }

  show(video: HTMLElement) {
    this.currentVideo = video;
    this.showOverlay();
  }

  showOverlay() {
    if (this.overlay) {
      this.hideOverlay();
    }

    this.overlay = document.createElement("div");
    this.overlay.classList.add("video-resize-overlay");
    Object.assign(this.overlay.style, {
      position: "absolute",
      boxSizing: "border-box",
      border: "2px solid #0066ff",
      backgroundColor: "rgba(0, 102, 255, 0.1)",
      zIndex: "100",
    });
    this.quill.root.parentNode?.appendChild(this.overlay);
    this.positionOverlay();

    // Add toolbar container
    const toolbarContainer = document.createElement("div");
    toolbarContainer.classList.add("video-toolbar-container");
    Object.assign(toolbarContainer.style, {
      position: "absolute",
      top: "-36px",
      left: "0",
      right: "0",
      display: "flex",
      justifyContent: "center",
      gap: "8px",
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("video-delete-button");
    deleteButton.innerHTML = "✕";
    deleteButton.title = "Xóa video (Delete)";
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.deleteVideo();
    });
    toolbarContainer.appendChild(deleteButton);

    this.overlay.appendChild(toolbarContainer);
  }

  hideOverlay() {
    if (!this.overlay) return;
    this.overlay.parentNode?.removeChild(this.overlay);
    this.overlay = null;
  }

  positionOverlay() {
    if (!this.overlay || !this.currentVideo) return;
    const rect = this.currentVideo.getBoundingClientRect();
    const containerRect = (
      this.quill.root.parentNode as any
    )?.getBoundingClientRect();

    if (containerRect) {
      Object.assign(this.overlay.style, {
        left: `${rect.left - containerRect.left - 1 + this.quill.root.scrollLeft}px`,
        top: `${rect.top - containerRect.top + this.quill.root.scrollTop}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
    }
  }

  hide() {
    this.hideOverlay();
    this.currentVideo = null;
  }

  handleScroll() {
    if (this.currentVideo) {
      this.positionOverlay();
    }
  }

  handleKeydown(evt: KeyboardEvent) {
    if (!this.currentVideo) return;

    if (evt.key === "Delete" || evt.key === "Backspace") {
      evt.preventDefault();
      this.deleteVideo();
    }
  }

  deleteVideo() {
    if (!this.currentVideo) return;

    // Find the Blot (Quill element) for the video
    const blot = Quill.find(this.currentVideo);

    if (blot) {
      // Get the index of the video in the document
      const index = this.quill.getIndex(blot as any);

      // Delete the video (iframe is 1 character in Quill)
      this.quill.deleteText(index, 1);
    } else {
      // Fallback: remove the iframe directly from DOM
      // and also try to remove the parent wrapper if it exists
      const parent = this.currentVideo.parentElement;

      if (parent && parent.classList.contains("ql-video-wrapper")) {
        parent.remove();
      } else if (parent) {
        this.currentVideo.remove();
      }
    }

    this.hide();
  }
}

export default VideoResize;
