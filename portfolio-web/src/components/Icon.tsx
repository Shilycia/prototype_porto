'use client';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  fill?: boolean;
}

export default function Icon({
  name,
  className = '',
  size = 22,
  fill = false,
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center shrink-0 ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontVariationSettings: fill
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
