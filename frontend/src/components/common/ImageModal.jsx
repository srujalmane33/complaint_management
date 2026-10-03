export default function ImageModal({ src, onClose, alt = "Problem Photo" }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top Floating Controls Bar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between mb-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-md text-xs font-bold border border-white/20 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-md flex items-center justify-center text-sm font-bold border border-white/20 shadow-lg transition active:scale-95 cursor-pointer"
          title="Close preview"
        >
          ✕
        </button>
      </div>

      {/* Main Image Display Container */}
      <div
        className="relative max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[78vh] max-w-full object-contain rounded-2xl"
        />
      </div>

      {/* Bottom hint */}
      <p className="text-white/60 text-xs font-medium mt-3">
        Click "Back" or anywhere outside to return
      </p>
    </div>
  );
}
