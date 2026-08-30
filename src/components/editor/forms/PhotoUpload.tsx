import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { useResume } from '../../../store/ResumeContext';
import type { PhotoData } from '../../../types/resume';
import { clampPan } from '../../../utils/photoBake';
import { SmallButton } from '../../ui/FormControls';

const MAX_DIMENSION = 640; // generous so zooming in doesn't pixelate
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB — anything bigger gets a friendly message
const FRAME_SIZE = 132; // px, on-screen editor frame
const NUDGE_STEP = 3; // percent of frame per arrow-key press

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
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
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
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("That file isn't an image. Choose a JPG or PNG photo.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('That photo is too large (over 8 MB). A smaller photo will work fine.');
      return;
    }
    try {
      const src = await readAndResize(file);
      // Start slightly zoomed-in so the subject comfortably fills the frame.
      const data: PhotoData = { src, zoom: 1.15, offsetX: 0, offsetY: 0, shape: 'circle' };
      dispatch({ type: 'SET_PHOTO', value: data });
    } catch {
      setError("We couldn't read that image. Try a different photo.");
    }
  };

  const adjust = (patch: Partial<Pick<PhotoData, 'zoom' | 'offsetX' | 'offsetY' | 'shape'>>) =>
    dispatch({ type: 'SET_PHOTO_ADJUSTMENT', patch });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center gap-2">
        <PhotoFrame photo={photo} />
        <div className="flex gap-1.5">
          <SmallButton onClick={() => inputRef.current?.click()}>{photo ? 'Replace' : 'Upload'}</SmallButton>
          {photo && (
            <SmallButton
              variant="danger"
              onClick={() => {
                setError(null);
                dispatch({ type: 'SET_PHOTO', value: null });
              }}
              ariaLabel="Remove profile photo"
            >
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
              onChange={(e) => adjust({ zoom: Number(e.target.value) })}
              className="w-full accent-primary"
              aria-label="Photo zoom"
            />
          </label>
          <div className="flex items-center gap-1 rounded-md border border-border p-1" role="group" aria-label="Photo shape">
            {(['circle', 'square'] as const).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => adjust({ shape })}
                aria-pressed={photo.shape === shape}
                className={`flex-1 rounded px-2 py-1.5 text-[12px] capitalize transition ${
                  photo.shape === shape ? 'bg-primary text-paper-raised' : 'text-ink-soft hover:bg-paper'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
          {(photo.offsetX !== 0 || photo.offsetY !== 0) && (
            <div>
              <SmallButton onClick={() => adjust({ offsetX: 0, offsetY: 0 })}>Reset position</SmallButton>
            </div>
          )}
          <p className="text-[12px] text-ink-soft">
            Drag the photo (or focus it and use arrow keys) to position it. The crop can never slip outside the picture.
          </p>
        </div>
      )}
      {!photo && (
        <p className="self-center text-[12px] text-ink-soft sm:self-start sm:pt-3">
          Optional — never required. A clear, front-facing photo works best.
        </p>
      )}
      {error && (
        <p role="alert" className="text-[12px] text-danger sm:self-start sm:pt-3">
          {error}
        </p>
      )}
    </div>
  );
}

function PhotoFrame({ photo }: { photo: PhotoData | null }) {
  const { dispatch } = useResume();
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const pan = (dXPct: number, dYPct: number) => {
    if (!photo) return;
    dispatch({
      type: 'SET_PHOTO_ADJUSTMENT',
      patch: {
        offsetX: clampPan(photo.offsetX + dXPct, photo.zoom),
        offsetY: clampPan(photo.offsetY + dYPct, photo.zoom),
      },
    });
  };

  if (!photo) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-dashed border-border bg-paper text-center text-[11px] text-ink-soft"
        style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
        aria-hidden="true"
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
    dispatch({
      type: 'SET_PHOTO_ADJUSTMENT',
      patch: {
        offsetX: clampPan(dragStart.current.offsetX + dxPct, photo.zoom),
        offsetY: clampPan(dragStart.current.offsetY + dyPct, photo.zoom),
      },
    });
  };
  const endDrag = () => {
    dragStart.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? NUDGE_STEP * 3 : NUDGE_STEP;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      pan(move[0], move[1]);
    }
  };

  return (
    <div
      role="img"
      tabIndex={0}
      aria-label="Profile photo crop — drag or use arrow keys to reposition"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={`relative select-none overflow-hidden border border-border ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ width: FRAME_SIZE, height: FRAME_SIZE, borderRadius: photo.shape === 'circle' ? '50%' : '10px', touchAction: 'none' }}
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
