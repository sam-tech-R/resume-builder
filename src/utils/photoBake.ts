import type { PhotoData } from '../types/resume';

const OUTPUT_SIZE = 300; // px, plenty for a resume-sized photo

/**
 * The photo is object-fit: cover inside a square frame, then scaled by
 * `zoom`. Panning any further than (zoom - 1) / 2 of the frame would reveal
 * empty background — this is the hard limit that keeps the image (and the
 * user's head) fully inside the frame in the preview *and* the PDF.
 */
export function maxPanPercent(zoom: number): number {
  return Math.max(0, ((zoom - 1) / 2) * 100);
}

export function clampPan(value: number, zoom: number): number {
  const limit = maxPanPercent(zoom);
  return Math.max(-limit, Math.min(limit, value));
}

/**
 * Renders the user's pan/zoom adjustment onto a fixed-size square canvas so
 * the PDF (which can't apply live CSS transforms) shows the exact crop the
 * live preview does. Circle vs square shape is left to the PDF's own
 * clipping so the exported bitmap always stays square underneath.
 */
export function bakePhoto(photo: PhotoData): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      // Scale the image so it covers the square frame (like CSS object-fit:
      // cover), then apply the extra user zoom and pan on top — clamped the
      // same way the editor clamps, so old drafts with wild offsets can't
      // produce a different crop in the PDF than on screen.
      const coverScale = Math.max(OUTPUT_SIZE / img.width, OUTPUT_SIZE / img.height);
      const scale = coverScale * photo.zoom;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const offsetXPct = clampPan(photo.offsetX, photo.zoom);
      const offsetYPct = clampPan(photo.offsetY, photo.zoom);
      const offsetXPx = (offsetXPct / 100) * OUTPUT_SIZE;
      const offsetYPx = (offsetYPct / 100) * OUTPUT_SIZE;

      const dx = (OUTPUT_SIZE - drawWidth) / 2 + offsetXPx;
      const dy = (OUTPUT_SIZE - drawHeight) / 2 + offsetYPx;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = photo.src;
  });
}
