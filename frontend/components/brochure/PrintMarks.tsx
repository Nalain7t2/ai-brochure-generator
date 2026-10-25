/** Print-production marks: the visual signature of the app. Purely decorative. */

export function RegistrationMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
      <path d="M12 1.5v21M1.5 12h21" />
    </svg>
  );
}

/**
 * Crop marks sit just outside the corners of a `relative` parent.
 * Hidden on small screens so they never cause horizontal scroll.
 */
export function CropMarks() {
  const line = "absolute bg-ink/35";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      {/* top-left */}
      <span className={`${line} -left-7 top-0 h-px w-4`} />
      <span className={`${line} -top-7 left-0 h-4 w-px`} />
      {/* top-right */}
      <span className={`${line} -right-7 top-0 h-px w-4`} />
      <span className={`${line} -top-7 right-0 h-4 w-px`} />
      {/* bottom-left */}
      <span className={`${line} -left-7 bottom-0 h-px w-4`} />
      <span className={`${line} -bottom-7 left-0 h-4 w-px`} />
      {/* bottom-right */}
      <span className={`${line} -right-7 bottom-0 h-px w-4`} />
      <span className={`${line} -bottom-7 right-0 h-4 w-px`} />
    </div>
  );
}
