import { Quill } from "react-quill-new";

const Parchment = Quill.import("parchment");

class ImageResize {
  quill: any;
  options: any;
  currentImg: HTMLElement | null;
  overlay: HTMLElement | null;
  handle: HTMLElement | null;

  constructor(quill: any, options: any) {
    this.quill = quill;
    this.options = options;
    this.currentImg = null;
    this.overlay = null;
    this.handle = null;

    this.quill.root.addEventListener("click", this.handleClick.bind(this));
    this.quill.root.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleClick(evt: MouseEvent) {
    if (evt.target && (evt.target as HTMLElement).tagName === "IMG") {
      if (this.currentImg === evt.target) return;
      if (this.currentImg) this.hide();
      this.show(evt.target as HTMLElement);
    } else if (this.currentImg) {
      this.hide();
    }
  }

  show(img: HTMLElement) {
    this.currentImg = img;
    this.showOverlay();
    this.showHandle();
  }

  showOverlay() {
    if (this.overlay) {
      this.hideOverlay();
    }
    this.overlay = document.createElement("div");
    this.overlay.classList.add("image-resize-overlay");
    Object.assign(this.overlay.style, {
      position: "absolute",
      boxSizing: "border-box",
      border: "1px dashed #444",
    });
    this.quill.root.parentNode.appendChild(this.overlay);
    this.positionOverlay();
  }

  hideOverlay() {
    if (!this.overlay) return;
    this.overlay.parentNode?.removeChild(this.overlay);
    this.overlay = null;
  }

  showHandle() {
    if (this.handle) {
      this.hideHandle();
    }
    this.handle = document.createElement("div");
    this.handle.classList.add("image-resize-handle");
    Object.assign(this.handle.style, {
      position: "absolute",
      height: "12px",
      width: "12px",
      backgroundColor: "white",
      border: "1px solid #777",
      boxSizing: "border-box",
      opacity: "0.80",
      cursor: "se-resize",
    });
    this.handle.addEventListener("mousedown", this.handleMousedown.bind(this));
    this.quill.root.parentNode.appendChild(this.handle);
    this.positionHandle();
  }

  hideHandle() {
    if (!this.handle) return;
    this.handle.removeEventListener(
      "mousedown",
      this.handleMousedown.bind(this),
    );
    this.handle.parentNode?.removeChild(this.handle);
    this.handle = null;
  }

  positionOverlay() {
    if (!this.overlay || !this.currentImg) return;
    const rect = this.currentImg.getBoundingClientRect();
    const containerRect = this.quill.root.parentNode.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${rect.left - containerRect.left - 1 + this.quill.root.scrollLeft}px`,
      top: `${rect.top - containerRect.top + this.quill.root.scrollTop}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  }

  positionHandle() {
    if (!this.handle || !this.currentImg) return;
    const rect = this.currentImg.getBoundingClientRect();
    const containerRect = this.quill.root.parentNode.getBoundingClientRect();

    Object.assign(this.handle.style, {
      left: `${rect.left - containerRect.left + rect.width - 6 + this.quill.root.scrollLeft}px`,
      top: `${rect.top - containerRect.top + rect.height - 6 + this.quill.root.scrollTop}px`,
    });
  }

  hide() {
    this.hideOverlay();
    this.hideHandle();
    this.currentImg = null;
  }

  handleMousedown(evt: MouseEvent) {
    if (!this.currentImg) return;
    const start = {
      x: evt.clientX,
      y: evt.clientY,
      width: (this.currentImg as any).width,
      height: (this.currentImg as any).height,
    };
    const mousemove = (e: MouseEvent) => {
      const deltaX = e.clientX - start.x;
      const deltaY = e.clientY - start.y;
      const width = start.width + deltaX;
      const height = start.height + deltaY;
      const aspectRatio = start.width / start.height;
      const newWidth = Math.round(Math.max(width, height * aspectRatio));
      const newHeight = Math.round(newWidth / aspectRatio);

      (this.currentImg as any).setAttribute("width", newWidth.toString());
      (this.currentImg as any).setAttribute("height", newHeight.toString());
      this.positionOverlay();
      this.positionHandle();
    };
    const mouseup = () => {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  }

  handleScroll() {
    this.positionOverlay();
    this.positionHandle();
  }
}
export default ImageResize;
