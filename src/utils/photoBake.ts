import type { PhotoData } from '../types/resume';

const OUTPUT_SIZE = 300; // px, plenty for a resume-sized photo

/**
 * Renders the user's pan/zoom adjustment onto a fixed-size square canvas so
 * the PDF (which can't apply live CSS transforms) shows the same crop the
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
      // cover), then apply the extra user zoom and pan on top.
      const coverScale = Math.max(OUTPUT_SIZE / img.width, OUTPUT_SIZE / img.height);
      const scale = coverScale * photo.zoom;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const offsetXPx = (photo.offsetX / 100) * OUTPUT_SIZE;
      const offsetYPx = (photo.offsetY / 100) * OUTPUT_SIZE;

      const dx = (OUTPUT_SIZE - drawWidth) / 2 + offsetXPx;
      const dy = (OUTPUT_SIZE - drawHeight) / 2 + offsetYPx;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = photo.src;
  });
}
