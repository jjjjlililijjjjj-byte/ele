export function ElephantIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Body and legs */}
      <path d="M3 10v9a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-9" />
      {/* Back and head */}
      <path d="M19 10v-3a7 7 0 0 0-7-7h-2a7 7 0 0 0-7 7v3" />
      {/* Trunk (Slide) */}
      <path d="M19 10c2 0 3 1.5 3 3.5s-1.5 3.5-3 3.5h-1" />
      {/* Eye */}
      <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
      {/* Tail */}
      <path d="M3 10c-1.5 0-2 1-2 2" />
    </svg>
  );
}
