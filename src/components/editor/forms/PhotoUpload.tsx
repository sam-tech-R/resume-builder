import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useResume } from '../../../store/ResumeContext';
import type { PhotoData } from '../../../types/resume';
import { SmallButton } from '../../ui/FormControls';

const MAX_DIMENSION = 640; // generous so zooming in doesn't pixelate
const FRAME_SIZE = 128; // px, on-screen editor frame
const OFFSET_LIMIT = 45; // percent — keeps the image from panning fully out of frame

function readAndResize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PhotoUpload() {
  const { resume, dispatch } = useResume();
  const inputRef = useRef<HTMLInputElement>(null);
  const photo = resume.photo;

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const src = await readAndResize(file);
    const data: PhotoData = { src, zoom: 1, offsetX: 0, offsetY: 0, shape: 'circle' };
    dispatch({ type: 'SET_PHOTO', value: data });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center gap-2">
        <PhotoFrame photo={photo} />
        <div className="flex gap-1.5">
          <SmallButton onClick={() => inputRef.current?.click()}>{photo ? 'Replace' : 'Upload'}</SmallButton>
          {photo && (
            <SmallButton variant="danger" onClick={() => dispatch({ type: 'SET_PHOTO', value: null })}>
              Remove
            </SmallButton>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {photo && (
        <div className="flex flex-1 flex-col gap-3">
          <label className="block">
            <span className="mb-1 flex justify-between text-[12px] font-medium text-ink">
              <span>Zoom</span>
              <span className="text-ink-soft">{photo.zoom.toFixed(1)}×</span>
            </span>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={photo.zoom}
              onChange={(e) => dispatch({ type: 'SET_PHOTO_ADJUSTMENT', patch: { zoom: Number(e.target.value) } })}
              className="w-full accent-primary"
            />
          </label>
          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            {(['circle', 'square'] as const).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => dispatch({ type: 'SET_PHOTO_ADJUSTMENT', patch: { shape } })}
                className={`flex-1 rounded px-2 py-1 text-[12px] capitalize transition ${
                  photo.shape === shape ? 'bg-primary text-paper-raised' : 'text-ink-soft hover:bg-paper'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft">Drag the photo above to reposition it. Optional — never required.</p>
        </div>
      )}
      {!photo && <p className="self-center text-[12px] text-ink-soft sm:self-start sm:pt-3">Optional. Never required to build your resume.</p>}
    </div>
  );
}

function PhotoFrame({ photo }: { photo: PhotoData | null }) {
  const { dispatch } = useResume();
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  if (!photo) {
    return (
      <div
        className="flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-border bg-paper text-center text-[11px] text-ink-soft"
        style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
      >
        No photo
      </div>
    );
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, offsetX: photo.offsetX, offsetY: photo.offsetY };
    setDragging(true);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dxPct = ((e.clientX - dragStart.current.x) / FRAME_SIZE) * 100;
    const dyPct = ((e.clientY - dragStart.current.y) / FRAME_SIZE) * 100;
    const clamp = (v: number) => Math.max(-OFFSET_LIMIT, Math.min(OFFSET_LIMIT, v));
    dispatch({
      type: 'SET_PHOTO_ADJUSTMENT',
      patch: { offsetX: clamp(dragStart.current.offsetX + dxPct), offsetY: clamp(dragStart.current.offsetY + dyPct) },
    });
  };
  const endDrag = () => {
    dragStart.current = null;
    setDragging(false);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className={`relative select-none overflow-hidden border border-border ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ width: FRAME_SIZE, height: FRAME_SIZE, borderRadius: photo.shape === 'circle' ? '50%' : '10px' }}
    >
      <img
        src={photo.src}
        alt=""
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full object-cover"
        style={{ transform: `translate(-50%, -50%) translate(${photo.offsetX}%, ${photo.offsetY}%) scale(${photo.zoom})` }}
      />
    </div>
  );
}
